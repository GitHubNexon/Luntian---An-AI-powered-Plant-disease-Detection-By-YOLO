// components/TextInput.jsx
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const TextInput = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  required = false,
  error = "",
  showToggle = false,
  isArea = false, // new prop with default false
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex flex-col">
      <label className="block mb-1 text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {isArea ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            className="border p-1 rounded w-full min-h-[100px]"
            required={required}
          />
        ) : (
          <>
            <input
              type={showToggle && showPassword ? "text" : type}
              name={name}
              value={value}
              onChange={onChange}
              className={`w-full p-2 border rounded ${
                error ? "border-red-500" : "border-gray-300"
              } ${showToggle ? "pr-10" : ""}`}
              required={required}
            />
            {showToggle && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            )}
          </>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default TextInput;
