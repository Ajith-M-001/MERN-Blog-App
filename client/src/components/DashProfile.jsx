import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import app from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteFailure,
  deleteSuccess,
  deleteStart,
  signOutSuccess,
} from "../redux/features/user/userSlice";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { Link } from "react-router-dom";

const DashProfile = () => {
  const { CurrentUser, error } = useSelector((state) => state.user);
  console.log("current_user", CurrentUser);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const filePickerRef = useRef();
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [showModel, setShowModel] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (imageFileUrl) {
        URL.revokeObjectURL(imageFileUrl);
      }
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
      // Clear previous messages when a new file is selected
      setImageUploadError(null);
      setUpdateUserSuccess(null);
    }
  };

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/v1/user/signout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess(data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (imageFile && !isImageUploading) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setIsImageUploading(true);
    setImageUploadError(null); // Clear previous error message
    const storage = getStorage(app);
    const fileName = `${new Date().getTime()}_${imageFile.name}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageUploadError(
          "Could not upload image. Please ensure the file size is less than 2MB."
        );
        setImageUploadProgress(0);
        setImageFile(null);
        setImageFileUrl(null);
        setIsImageUploading(false);
        setUpdateUserSuccess(null); // Clear success message on failure
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData((prevData) => ({ ...prevData, profilePic: downloadURL }));
          setIsImageUploading(false);
          setImageUploadError(null); // Clear error message on success
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0 || isImageUploading) {
      setImageUploadError("Please make changes or wait for image upload.");
      setUpdateUserSuccess(null); // Clear success message
      return;
    }

    try {
      dispatch(updateStart());
      const res = await fetch(
        `/api/v1/user/update/${CurrentUser._id || CurrentUser.user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserSuccess(null); // Clear success message on failure
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User profile updated successfully.");
        setImageUploadError(null); // Clear error message on success
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserSuccess(null); // Clear success message on failure
    }
  };

  const handleUserDelete = async () => {
    setShowModel(false);
    try {
      dispatch(deleteStart());

      const res = await fetch(
        `/api/v1/user/delete/${CurrentUser._id || CurrentUser.user._id}`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Delete failed:", data.message); // Log the error for debugging
        dispatch(deleteFailure(data.message));
      } else {
        dispatch(deleteSuccess(data));
        console.log("User deleted successfully:", data); // Log success for debugging
        // Optionally, you could redirect the user or sign them out after account deletion
        setShowModel(false); // Hide modal after success
      }
    } catch (error) {
      console.error("Delete request error:", error.message); // Log error for debugging
      dispatch(deleteFailure(error.message));
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">DashProfile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          onChange={handleImageChange}
          type="file"
          accept="image/*"
          ref={filePickerRef}
          hidden
        />
        <div
          onClick={() => filePickerRef.current.click()}
          className={`w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full relative ${
            isImageUploading && imageUploadProgress < 100 ? `opacity-60` : ``
          }`}
        >
          {isImageUploading && (
            <CircularProgressbar
              value={imageUploadProgress}
              text={`${imageUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                pathColor: `rgba(62, 152, 199, ${imageUploadProgress / 100})`,
              }}
            />
          )}
          <img
            src={imageFileUrl || CurrentUser?.profilePic}
            alt="profilepic"
            className="w-full h-full rounded-full object-cover"
          />
        </div>

        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {updateUserSuccess && (
          <Alert color="success" className="mt-5">
            {updateUserSuccess}
          </Alert>
        )}
        {error && (
          <Alert color="failure" className="mt-5">
            {error}
          </Alert>
        )}

        <TextInput
          type="text"
          id="username"
          placeholder="Username"
          onChange={handleChange}
          defaultValue={CurrentUser?.username}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          onChange={handleChange}
          defaultValue={CurrentUser?.email}
        />
        <TextInput
          onChange={handleChange}
          type="password"
          id="password"
          placeholder="Password"
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={isImageUploading}
        >
          {isImageUploading ? "Uploading..." : "Update"}
        </Button>
      </form>
      {CurrentUser.isAdmin && (
        <Link to="/create-post">
          <Button
            type="button"
            gradientDuoTone="purpleToPink"
            className="w-full mt-3"
            outline
            disabled={isImageUploading}
          >
            Create a Post
          </Button>
        </Link>
      )}
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer" onClick={() => setShowModel(true)}>
          Delete account
        </span>
        <span onClick={handleSignOut} className="cursor-pointer">
          Sign out
        </span>
      </div>
      <Modal
        show={showModel}
        onClose={() => setShowModel(false)}
        popup
        size={"md"}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <AiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:to-green-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account
            </h3>
            <div className="flex justify-center gap-4">
              <Button color={"failure"} onClick={handleUserDelete}>
                Yes! im sure
              </Button>
              <Button color="gray" onClick={() => setShowModel(false)}>
                NO, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashProfile;
