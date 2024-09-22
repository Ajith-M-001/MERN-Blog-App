/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";

const Comment = ({ key, comment, onLike }) => {
  const [user, setUser] = useState({});
  const { CurrentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const getUser = async (comment) => {
      try {
        const res = await fetch(`/api/v1/user/${comment.userId}`);
        const user = await res.json();
        setUser(user.userwithoutpossword);
      } catch (error) {
        console.log(error);
      }
    };
    getUser(comment);
  }, [comment]);

  console.log(comment.numberOfLikes);
  return (
    <div key={key} className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className=" flex-shrink-0 mr-3">
        <img
          className="w-10 h-10 rounded-full bg-gray-200"
          src={user.profilePic}
          alt={"profilepic"}
        />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center ">
          <span className="font-bold mr-1 text-xs truncate">
            {user ? user.username : "anonymous user"}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        <p className="text-gray-600 py-1">{comment.comment}</p>
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
                "" +
                (CurrentUser.numberOfLikes === 1 ? "like" : "likes")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Comment;
