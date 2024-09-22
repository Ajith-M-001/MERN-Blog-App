/* eslint-disable react/prop-types */
import { Button, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Comment from "./Comment";

const CommentSection = ({ postId }) => {
  const { CurrentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState(""); // For new comment input
  const [getComment, setGetComment] = useState([]); // For fetching all comments
  const navigate = useNavigate();

  useEffect(() => {
    const getCommentsByPost = async (id) => {
      try {
        const res = await fetch(`/api/v1/comment/getPostComments/${id}`);
        const data = await res.json();
        setGetComment(data.comments || []);
      } catch (error) {
        console.log(error);
      }
    };

    getCommentsByPost(postId);
  }, [postId, comments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comments.length > 200) {
      return;
    }
    try {
      const res = await fetch(`/api/v1/comment/createComment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: comments,
          postId,
          userId: CurrentUser._id,
        }),
      });
      if (res.ok) {
        setComments(""); // Clear input after submission
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async (commentId) => {
    console.log(commentId);

    try {
      if (!CurrentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`/api/v1/comment/likeComment/${commentId}`, {
        method: "PUT",
      });
      if (res.ok) {
        const data = await res.json();
        setComments(
          getComment.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.numberOfLikes,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full p-3">
      {CurrentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={CurrentUser.profilePic}
            alt="profilepic"
          />
          <Link to={"/dashboard?tab=profile"}>@{CurrentUser.username}</Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5">
          You must be signed in to comment:{" "}
          <Link className="text-blue-500 hover:underline mx-2" to="/sign-in">
            Sign In
          </Link>
        </div>
      )}

      {CurrentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-md p-3"
        >
          <Textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add a comment"
            rows="3"
            maxLength="200"
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-sm">
              {200 - comments.length} characters remaining
            </p>
            <Button type="submit" outline gradientDuoTone="purpleToBlue">
              Submit
            </Button>
          </div>
        </form>
      )}

      {getComment.length === 0 ? (
        <p className="text-xs my-5">No comments yet</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments:</p>
            <div className="border border-gray-500 py-1 px-2 rounded-sm">
              <p>{getComment.length}</p>
            </div>
          </div>
          {getComment.map((comment) => (
            <Comment key={comment._id} comment={comment} onLike={handleLike} />
          ))}
        </>
      )}
    </div>
  );
};

export default CommentSection;
