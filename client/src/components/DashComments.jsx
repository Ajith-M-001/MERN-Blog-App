import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, Table } from "flowbite-react";
import { MdDelete } from "react-icons/md";

const DashComments = () => {
  const { CurrentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/v1/comment/getcomments`);
        const data = await res.json();
        console.log(data.comments);
        setComments(data.comments);
        if (data.comments.length <= 10) {
          setShowMore(false);
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    // Fetch posts only if CurrentUser exists and is an admin
    if (CurrentUser?.isAdmin) {
      fetchComments();
    }
  }, [CurrentUser]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(`/api/v1/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setComments((prevComment) => [...prevComment, ...data.comments]);
        if (data.comments.length <= 10) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleCommentDelete = async (commentId) => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/v1/comment/delete/${commentIdToDelete}/${CurrentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (res.ok) {
        console.log(data.message);
        setComments((prevComments) =>
          prevComments.filter((comment) => comment._id !== commentId)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {CurrentUser?.isAdmin && comments.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>no of likes</Table.HeadCell>
              <Table.HeadCell>postId</Table.HeadCell>
              <Table.HeadCell>userId</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {comments.map((comment) => (
                <Table.Row key={comment._id}>
                  <Table.Cell>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </Table.Cell>

                  <Table.Cell>{comment.comment}</Table.Cell>
                  <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  <Table.Cell>{comment.postId}</Table.Cell>
                  <Table.Cell>{comment.userId}</Table.Cell>

                  <Table.Cell>
                    {" "}
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setCommentIdToDelete(comment._id);
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
        <p>No comment yet</p>
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
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color={"failure"}
                onClick={() => handleCommentDelete(commentIdToDelete)}
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

export default DashComments;
