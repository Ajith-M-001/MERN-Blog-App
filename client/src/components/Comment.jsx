/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";

const Comment = ({ comment, onLike }) => {
  const [user, setUser] = useState({});
  const { CurrentUser } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(comment.comment); // Lowercase variable name

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/v1/user/${comment.userId}`);
        const user = await res.json();
        setUser(user.userwithoutpossword);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    getUser();
  }, [comment.userId]);

  const handleEditComment = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/v1/comment/editComment/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: editedValue }),
      });

      if (res.ok) {
        const data = await res.json();
        setEditedValue(data.editedComment.comment);
        setIsEditing(false);
      } else {
        throw new Error("Failed to edit comment");
      }
    } catch (error) {
      console.error(error);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-10 h-10 rounded-full bg-gray-200"
          src={user.profilePic}
          alt="profilepic"
        />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <span className="font-bold mr-1 text-xs truncate">
            {user ? user.username : "Anonymous user"}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>

        {isEditing ? (
          <form onSubmit={handleEditComment} className="my-2">
            <Textarea
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value)}
            />
            <div className="flex gap-3 my-2 justify-end">
              <Button
                type="button"
                onClick={() => setIsEditing(false)}
                outline
                gradientDuoTone="redToYellow"
              >
                Cancel
              </Button>
              <Button gradientDuoTone="purpleToPink" type="submit">
                Save
              </Button>
            </div>
          </form>
        ) : (
          <>
            <p className="text-gray-600 py-1">{editedValue}</p>
            <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
              <button
                type="button"
                onClick={() => onLike(comment._id)}
                className={`text-gray-400 hover:text-blue-500 ${
                  CurrentUser &&
                  comment.likes.includes(CurrentUser._id) &&
                  "!text-blue-500"
                }`}
              >
                <FaThumbsUp className="text-sm" />
              </button>
              <p className="text-gray-400">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "like" : "likes")}
              </p>

              {CurrentUser &&
                (CurrentUser._id === comment.userId || CurrentUser.isAdmin) && (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      type="button"
                      className="text-gray-500 hover:text-blue-500 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button  className="cursor-pointer text-red-500">
                      Delete
                    </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Comment;
