import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import app from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/features/user/userSlice";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      const res = await fetch("/api/v1/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          googlePhotoUrl: resultsFromGoogle.user.photoURL,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
      console.log(resultsFromGoogle);
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <Button
      onClick={handleGoogleClick}
      type="button"
      gradientDuoTone={"pinkToOrange"}
      outline
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      Continue with google
    </Button>
  );
};

export default OAuth;
