import { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import app from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useSelector } from "react-redux";

const UpdatePost = () => {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const { postId } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    category: "uncategorized",
    content: "",
    image: "",
  });
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();
  const { CurrentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchPostId = async (postId) => {
      try {
        setLoading(true); // Start loading
        const res = await fetch(`/api/v1/post/posts?postId=${postId}`);
        const data = await res.json();
        if (!res.ok) {
          setPublishError(data.message);
          return;
        }
        setPublishError(null);
        setFormData(data.posts[0]); // Populate form data
      } catch (error) {
        console.log("error", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchPostId(postId);
  }, [postId]);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        return setImageUploadError("Please select an image");
      }
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!CurrentUser) {
      setPublishError("User is not authenticated");
      return;
    }
    try {
      const res = await fetch(
        `/api/v1/post/update/${postId}/${CurrentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (data) {
        // Reset form after successful post
        setFormData({
          title: "",
          category: "uncategorized",
          content: "",
          image: "",
        });
        setFile(null); // Clear file input
      }
      setPublishError(null);
      navigate(`/post/${data.slug}`);
    } catch (error) {
      setPublishError(error.message);
      console.log("Error", error);
    }
  };

  if (loading) {
    return <div>Loading post data...</div>;
  }

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update Post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row justify-between">
          <TextInput
            className="flex-1"
            type="text"
            placeholder="Title"
            required
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
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
            disabled={imageUploadProgress !== null}
          >
            {imageUploadProgress ? (
              <CircularProgressbar
                className="w-[50px] h-[50px]"
                value={imageUploadProgress}
                text={`${imageUploadProgress || 0}%`}
              />
            ) : (
              "Upload image"
            )}
          </Button>
        </div>
        {imageUploadError && (
          <Alert color={"failure"}>{imageUploadError}</Alert>
        )}
        {formData.image && <img src={formData.image} alt="Uploaded" />}
        <ReactQuill
          value={formData.content}
          onChange={(value) => setFormData({ ...formData, content: value })}
          theme="snow"
          placeholder="Write something..."
          className="h-72 mb-12"
          required
        />
        <Button type="submit" gradientDuoTone={"purpleToPink"}>
          Update Post
        </Button>
        {publishError && (
          <Alert color={"failure"} className="mt-5">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
};

export default UpdatePost;
