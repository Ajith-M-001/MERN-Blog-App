import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table } from "flowbite-react";
import { Link } from "react-router-dom";

const DashPosts = () => {
  const { CurrentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/v1/post/posts?userId=${CurrentUser._id}`);
        const data = await res.json();
        setUserPosts(data.posts);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    // Fetch posts only if CurrentUser exists and is an admin
    if (CurrentUser?.isAdmin) {
      fetchPost();
    }
  }, [CurrentUser]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(
        `/api/v1/post/posts?userId=${CurrentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prevPost) => [...prevPost, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {CurrentUser?.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {userPosts.map((post) => (
                <Table.Row key={post._id}>
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post._id}`}>
                      <img
                        src={post.image}
                        alt="post-image"
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                    {}
                  </Table.Cell>
                  <Table.Cell>{post.title}</Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    {" "}
                    <span className="text-red-500 font-medium hover:underline cursor-pointer">
                      Delete
                    </span>{" "}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/update-post/${post._id}`}>
                      <span className="text-blue-500 font-medium hover:underline cursor-pointer">
                        Edit
                      </span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>No post yet</p>
      )}
    </div>
  );
};

export default DashPosts;
