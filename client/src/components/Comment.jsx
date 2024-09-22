/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import moment from "moment";

const Comment = ({ key, comment }) => {
  const [user, setUser] = useState({});
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/v1/user/${comment.userId}`);
        const user = await res.json();
        setUser(user.userwithoutpossword);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [comment]);

  console.log(user);
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
      </div>
    </div>
  );
};

export default Comment;
