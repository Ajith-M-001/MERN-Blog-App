import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { GrClose } from "react-icons/gr";
import { FcCheckmark } from "react-icons/fc";

const DashUsers = () => {
  const { CurrentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/v1/user/getusers`);
        const data = await res.json();
        console.log(data.userWithOutPassword);
        setUsers(data.userWithOutPassword);
        if (data.userWithOutPassword.length <= 10) {
          setShowMore(false);
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    // Fetch posts only if CurrentUser exists and is an admin
    if (CurrentUser?.isAdmin) {
      fetchUser();
    }
  }, [CurrentUser]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/v1/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prevUser) => [...prevUser, ...data.userWithOutPassword]);
        if (data.userWithOutPassword.length <= 10) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleUserDelete = async (userId) => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/v1/user/delete/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        console.log(data.message);
        setUsers((prevUser) => prevUser.filter((user) => user._id !== userId));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {CurrentUser?.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>email</Table.HeadCell>
              <Table.HeadCell>isAdmin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {users.map((user) => (
                <Table.Row key={user._id}>
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
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
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    {user.isAdmin ? (
                      <FcCheckmark className="text-green-500 font-medium text-3xl" />
                    ) : (
                      <GrClose className="text-red-500 font-medium text-3xl" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {" "}
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setUserIdToDelete(user._id);
                      }}
                      className="text-red-500 font-medium hover:underline cursor-pointer"
                    >
                      Delete
                    </span>{" "}
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
        <p>No user yet</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size={"md"}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <MdDelete className="h-14 w-14 text-gray-400 dark:to-green-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color={"failure"}
                onClick={() =>
                  handleUserDelete(userIdToDelete,)
                }
              >
                Yes, Im sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashUsers;
