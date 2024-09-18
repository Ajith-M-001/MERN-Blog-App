import { Alert, Button, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import app from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const DashProfile = () => {
  const currentUser = useSelector((state) => state.user.CurrentUser);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const filePickerRef = useRef();
  const [imageFileUploadingProgresss, setImageFileUploadingProgresss] =
    useState(0);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Revoke the previous URL to avoid memory leaks
      if (imageFileUrl) {
        URL.revokeObjectURL(imageFileUrl);
      }
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageUploadError(null);
    const Storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(Storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progess = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadingProgresss(progess.toFixed(0));
      },
      (error) => {
        setImageUploadError(
          "could not upload image file must be  less then 2MB"
        );
        setImageFileUploadingProgresss(null);
        setImageFile(null);
        setImageFileUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
        });
      }
    );
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">DashProfile</h1>
      <form className="flex flex-col gap-3">
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
            imageFileUploadingProgresss &&
            imageFileUploadingProgresss < 100 &&
            `opacity-60`
          }`}
        >
          {imageFileUploadingProgresss && (
            <CircularProgressbar
              value={imageFileUploadingProgresss}
              text={`${imageFileUploadingProgresss}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                pathColor: `rgba(62, 152, 199, ${
                  imageFileUploadingProgresss / 100
                })`,
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

        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
        />
        <TextInput type="password" id="password" placeholder="password" />
        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Update
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
