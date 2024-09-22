import { Button, Textarea } from "flowbite-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const CommentSection = ({ postId }) => {
  const { CurrentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState("");

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
      const data = await res.json();
      if (res.ok) {
        setComments("");
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }
    console.log(comments);
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
        <>
          <div className="text-sm text-teal-500 my-5">
            You Must Singed In to Comment :
            <Link
              className="text-blue-500 hover:underline mx-2"
              to={"/sign-in"}
            >
              Sign In
            </Link>
          </div>
        </>
      )}

      {CurrentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-md p-3 "
        >
          <Textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add a comment"
            rows={"3"}
            maxLength={"200"}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-sm">
              {200 - comments.length} characters remaining
            </p>
            <Button type="submit" outline gradientDuoTone={"purpleToBlue"}>
              Submit
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CommentSection;
