import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiUserGroup } from "react-icons/hi";
import { HiArrowNarrowUp } from "react-icons/hi";
import { HiAnnotation } from "react-icons/hi";
import { IoMdDocument } from "react-icons/io";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";

const DashboardComp = () => {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const { CurrentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/v1/user/getusers?limit=5");
        const data = await res.json();
        if (res.ok) {
          setUsers(data.userWithOutPassword);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthusers);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/v1/post/posts?limit=5");
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch("/api/v1/comment/getcomments?limit=5");
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setLastMonthComments(data.lastMonthComments);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (CurrentUser.isAdmin) {
      fetchComments();
      fetchPosts();
      fetchUsers();
    }
  }, [CurrentUser]);
  return (
    <div className="p-3 md:mx-auto ">
      <div className="flex-wrap flex gap-4 justify-center">
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full round shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Total Users</h3>
              <p className="text-2xl ">{totalUsers}</p>
            </div>
            <HiUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm items-center">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <p className="text-gray-500">Last Month </p>
          </div>
        </div>
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full round shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">
                Total Comments
              </h3>
              <p className="text-2xl ">{totalComments}</p>
            </div>
            <HiAnnotation className="bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm items-center">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthComments}
            </span>
            <p className="text-gray-500">Last Month </p>
          </div>
        </div>
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full round shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Total posts</h3>
              <p className="text-2xl ">{totalPosts}</p>
            </div>
            <IoMdDocument className="bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm items-center">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthPosts}
            </span>
            <p className="text-gray-500">Last Month </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center ">
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold items-center">
            <h1 className="text-center p-2">Recent Users</h1>
            <Button outline gradientDuoTone={"purpleToPink"}>
              <Link to="/dashboard?tab=users">see all</Link>
            </Button>
          </div>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>user image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {users &&
                users.map((user) => (
                  <Table.Row key={user._id}>
                    <Table.Cell>
                      <Link to={`/user/${user._id}`}>
                        <img
                          src={user.profilePic}
                          alt="user-image"
                          className="w-10 h-10 rounded-full object-cover bg-gray-500"
                        />
                      </Link>
                      {}
                    </Table.Cell>
                    <Table.Cell>{user.username}</Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </div>
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold items-center">
            <h1 className="text-center p-2">Recent comments</h1>
            <Button outline gradientDuoTone={"purpleToPink"}>
              <Link to="/dashboard?tab=comments">see all</Link>
            </Button>
          </div>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>comments</Table.HeadCell>
              <Table.HeadCell>likes</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {comments &&
                comments.map((comment) => (
                  <Table.Row key={comment._id}>
                    <Table.Cell className="w-96">{comment.comment}</Table.Cell>
                    <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </div>
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold items-center">
            <h1 className="text-center p-2">Recent posts</h1>
            <Button outline gradientDuoTone={"purpleToPink"}>
              <Link to="/dashboard?tab=users">see all</Link>
            </Button>
          </div>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>post image</Table.HeadCell>
              <Table.HeadCell>post title</Table.HeadCell>
              <Table.HeadCell>category</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {posts &&
                posts.map((post) => (
                  <Table.Row key={post._id}>
                    <Table.Cell>
                      <Link to={`/post/${post._id}`}>
                        <img
                          src={post.image}
                          alt="post-image"
                          className="w-14 h-10 rounded-md object-cover bg-gray-500"
                        />
                      </Link>
                      {}
                    </Table.Cell>
                    <Table.Cell className="w-96">{post.title}</Table.Cell>
                    <Table.Cell className="w-5">{post.category}</Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default DashboardComp;
