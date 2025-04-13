import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { showToast } from "../utils/toastNotifications";
import { useSplash } from "../contexts/SplashContext";
import { useLoading } from "../contexts/LoadingContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { setShowSplash } = useSplash();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="flex justify-center items-center bg-gray-200 rounded-lg">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <input
              type="email"
              id="email"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* Toggle Password Visibility */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? (
                <AiFillEyeInvisible size={24} />
              ) : (
                <AiFillEye size={24} />
              )}
            </button>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
