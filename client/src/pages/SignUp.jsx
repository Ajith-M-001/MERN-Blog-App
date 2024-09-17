import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigation = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      setIsLoading(true);
      const res = await fetch("/api/v1/auth/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false || !data.success) {
        setIsLoading(false); // Reset loading state
        return setErrorMessage(data.message);
      }
      if (data.success) {
        navigation("/sign-in");
        setIsLoading(false); // Reset loading state
        return;
      }

      console.log("data", data.message);
      setIsLoading(false);
      setErrorMessage("");
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
      setErrorMessage("An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex md:flex-row flex-col p-3 max-w-3xl mx-auto md:items-center gap-5">
        {/* Left side */}
        <div className="flex-1">
          <Link to={"/"} className="text-4xl font-bold dark:text-white">
            <span className="px-2">Ajith&apos;s</span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            This is a demo project. You can sign up with your email and password
            or with Google.
          </p>
        </div>

        {/* Right side */}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label value="Your username" />
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your email" />
              <TextInput
                type="email"
                placeholder="Email"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone={"purpleToPink"}
              type="submit"
              disabled={isLoading} // Corrected
            >
              {isLoading ? (
                <>
                  <Spinner size={"sm"} /> <span>Loading...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
            <OAuth />
          </form>
          <div>
            <span className="flex gap-2 text-sm mt-5">
              Have an account?{" "}
              <Link to={"/sign-in"} className="text-blue-500">
                Sign In
              </Link>
            </span>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color={"failure"}>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
