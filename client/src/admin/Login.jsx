import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useAuth } from "../contexts/AuthContext";
import { useSplash } from "../contexts/SplashContext";
import { useLoader } from "../contexts/useLoader"; // Import the LoaderContext
import { showToast } from "../utils/toastNotifications"; // Import the toast utility
import LoginImage from "../assets/Images/landing-img.jpg";
import "./Login.css";
import { useLoading } from "../contexts/LoadingContext";

const Login = () => {
  const [email, setEmail] = useState(""); // Changed from email to username
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { setShowSplash } = useSplash();
  const { showLoading, hideLoading, setRefresh } = useLoading();

  useEffect(() => {
    setShowSplash(false);
  }, [setShowSplash]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      showLoading(3000);
      await login(email, password);
      hideLoading(3000);
      setRefresh(true);
      navigate("/");
      setTimeout(() => window.location.reload(), 3000);
    } catch (error) {
      hideLoading();
      console.error("Login failed:", error);

      if (error.status === 403) {
        showToast("Account is locked. Try again later.", "warning");
      } else {
        showToast(
          "Login failed. Please check your credentials and try again.",
          "error"
        );
      }
    }
  };

  return (
    <>
      <div className="flex m-10 items-center justify-center flex-col relative">
        <div
          className="container flex items-center justify-center m-4 flex-col md:flex-row md:justify-center md:m-10 z-10"
          data-aos="fade-up"
        >
          {/* Left Side: Login Form */}
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <div className="w-full max-w-md px-6">
              <div className="flex items-center justify-center flex-col">
                <h1 className="text-gray-700 text-[1rem] md:text-[1.2rem]">
                  Welcome Back
                </h1>
                <p className="text-gray-900 text-2xl font-normal mb-6">
                  Log In
                </p>
                <form className="form w-full" onSubmit={handleSubmit}>
                  <div className="input-field relative mb-4">
                    <input
                      required
                      autoComplete="off"
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      id="email"
                      className="w-full p-2 border rounded"
                    />
                    <label
                      htmlFor="email"
                      className="absolute top-[-8px] left-2 text-gray-600"
                    >
                      Email
                    </label>
                  </div>
                  <div className="input-field relative mb-4">
                    <input
                      required
                      autoComplete="off"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      id="password"
                      className="w-full p-2 border rounded"
                    />
                    <span
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer "
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <AiFillEyeInvisible className="text-gray-500" />
                      ) : (
                        <AiFillEye className="text-gray-500" />
                      )}
                    </span>
                    <label
                      htmlFor="password"
                      className="absolute top-[-8px] left-2 text-gray-600"
                    >
                      Password
                    </label>
                  </div>

                  {/* <div className="flex items-center justify-between mb-6">
                    <Link
                      to="#"
                      className="text-blue-500 hover:underline text-sm"
                    >
                      Forgot Password?
                    </Link>
                  </div> */}
                  <button
                    type="submit"
                    className="bg-black text-white text-sm p-2 rounded-lg mb-4 w-full"
                  >
                    Continue
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right Side: Image with Same Style as the Form */}
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <div className="w-full flex items-center justify-center">
              <img
                src={LoginImage} // Your image URL
                alt="Login Illustration"
                className="object-cover w-[30vw] h-[60vh] rounded-lg max-sm:w-[60vw] max-sm:h-[40vh]"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
