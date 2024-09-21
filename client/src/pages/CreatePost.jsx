import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import app from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CreatePost = () => {
  const [file, setFile] = useState(null);
  const [imageUploadProgess, setImageUploadprogress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setformData] = useState({});

  const handleUploadImage = async () => {
    try {
      if (!file) {
        return setImageUploadError("please select an image");
      }
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storeageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storeageRef, file);
      uploadTask.on(
        "state_changed",
        (snapchat) => {
          const progress =
            (snapchat.bytesTransferred / snapchat.totalBytes) * 100;
          setImageUploadprogress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image upload Failed");
          setImageUploadprogress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadprogress(null);
            setImageUploadError(null);
            setformData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("image upload faile");
      setImageUploadprogress(null);
    }
  };
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a Post</h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row justify-between">
          <TextInput
            className="flex-1"
            type="text"
            placeholder="title"
            required
            id="title"
          />
          <Select>
            <option value={"uncategorized"}>Select a Category</option>
            <option value={"javascript"}>JavaScript</option>
            <option value={"reactjs"}>React Js</option>
            <option value={"nextjs"}>Next Js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            accept="image/*"
          />

          <Button
            onClick={handleUploadImage}
            type="button"
            gradientDuoTone={"purpleToBlue"}
            size={"sm"}
            disabled={imageUploadProgess}
          >
            {imageUploadProgess ? (
              <>
                <div>
                  <CircularProgressbar
                    className="w-[112px] h-[32px] "
                    value={imageUploadProgess}
                    text={`${imageUploadProgess || 0}`}
                  />
                </div>
              </>
            ) : (
              "Upload image"
            )}
          </Button>
        </div>
        {imageUploadError && (
          <Alert color={"failure"}>{imageUploadError}</Alert>
        )}
        {formData.image && <img src={formData.image} alt="uploaded image" />}
        <ReactQuill
          theme="snow"
          placeholder="write soomething..."
          className="h-72 mb-12"
          required
        />
        <Button type="submit" gradientDuoTone={"purpleToPink"}>
          Publish
        </Button>
      </form>
    </div>
  );
};

export default CreatePost;
