import { Alert, Button, TextInput } from "flowbite-react";
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
} from "../redux/features/user/userSlice";

const DashProfile = () => {
  const currentUser = useSelector((state) => state.user.CurrentUser);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const filePickerRef = useRef();
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();

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
      const res = await fetch(`/api/v1/user/update/${currentUser._id || currentUser.user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
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
            src={imageFileUrl || currentUser?.profilePic}
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

        <TextInput
          type="text"
          id="username"
          placeholder="Username"
          onChange={handleChange}
          defaultValue={currentUser?.username}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          onChange={handleChange}
          defaultValue={currentUser?.email}
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
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer">Delete account</span>
        <span className="cursor-pointer">Sign out</span>
      </div>
    </div>
  );
};

export default DashProfile;
