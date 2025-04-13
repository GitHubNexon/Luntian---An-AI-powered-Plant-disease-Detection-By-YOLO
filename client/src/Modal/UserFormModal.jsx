// Modal/UserFormModal.jsx
import React, { useState, useEffect } from "react";
import Modal from "../components/Modal";
import { showToast } from "../utils/toastNotifications";
import userApi from "../api/userApi";
import useBase from "../hooks/useBase";
import TextInput from "../components/TextInput";
import Dialog from "../components/Dialog";

const validatePassword = (password) => {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    return "Password must be at least 8 characters long.";
  }
  if (!hasUppercase) {
    return "Password must contain at least 1 uppercase letter.";
  }
  if (!hasLowercase) {
    return "Password must contain at least 1 lowercase letter.";
  }
  if (!hasNumber) {
    return "Password must contain at least 1 number.";
  }
  if (!hasSpecial) {
    return "Password must contain at least 1 special character.";
  }

  return "";
};

const UserFormModal = ({
  open,
  close,
  onSuccess,
  initialData = null,
  mode = "add",
}) => {
  const { base } = useBase();
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    userType: "",
    status: {
      isDeleted: false,
      isArchived: false,
    },
  });
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [showCloseDialog, setShowCloseDialog] = useState(false);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        username: initialData.username || "",
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        email: initialData.email || "",
        password: "",
        userType: initialData.userType || "",
        status: {
          isDeleted: initialData.status?.isDeleted || false,
          isArchived: initialData.status?.isArchived || false,
        },
      });
    }
  }, [initialData, mode]);

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }
    return "";
  };
  const validateUsername = (username) => {
    if (!username.startsWith("@")) {
      return "Username must start with '@'.";
    }
    if (username.length < 5) {
      return "Username must be at least 5 characters long.";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "password") {
      const validationResult = validatePassword(value);
      setPasswordError(validationResult);
    }

    if (name === "email") {
      const emailValidationResult = validateEmail(value);
      setEmailError(emailValidationResult);
    }

    if (name === "username") {
      const usernameValidationResult = validateUsername(value);
      setUsernameError(usernameValidationResult);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === "add" || (mode === "edit" && formData.password)) {
      const passwordValidation = validatePassword(formData.password);
      if (passwordValidation) {
        setPasswordError(passwordValidation);
        showToast(passwordValidation, "error");
        return;
      }
    }

    try {
      if (mode === "edit" && initialData) {
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        await userApi.updateUser(initialData._id, updateData);
        showToast("User updated successfully", "success");
      } else {
        await userApi.createUser(formData);
        showToast("User created successfully", "success");
      }
      onSuccess();
      close();
      if (mode === "add") {
        setFormData({
          username: "",
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          userType: "",
          status: {
            isDeleted: false,
            isArchived: false,
          },
        });
      }
      setPasswordError("");
    } catch (error) {
      showToast(
        `Failed to ${mode === "edit" ? "update" : "create"} user`,
        "error"
      );
    }
  };

  const handleClose = () => {
    setShowCloseDialog(true); // Show the confirmation dialog
  };

  const confirmClose = () => {
    setShowCloseDialog(false);
    close(); // Proceed with closing the modal
  };

  return (
    <>
      <Modal
        open={open}
        close={handleClose}
        title={mode === "edit" ? "Edit User" : "Create User"}
      >
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              error={usernameError}
            />
            <TextInput
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <TextInput
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            <TextInput
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              error={emailError}
            />
            <div className="md:col-span-2">
              <TextInput
                label={`Password ${
                  mode === "edit" ? "(Leave blank to keep unchanged)" : ""
                }`}
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={mode === "add"}
                error={passwordError}
                showToggle={true}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 text-gray-700">
                User Type <span className="text-red-500">*</span>
              </label>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select User Type</option>
                {base.userTypes.map((item, index) => (
                  <option key={index} value={item.user}>
                    {item.user}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-gray-400"
              disabled={!!passwordError}
            >
              {mode === "edit" ? "Update User" : "Create User"}
            </button>
          </div>
        </form>
      </Modal>

      <Dialog
        isOpen={showCloseDialog}
        title="Are you sure?"
        description="Are you sure you want to close without saving?"
        isProceed="Yes, Close"
        isCanceled="Cancel"
        onConfirm={confirmClose}
        onCancel={() => setShowCloseDialog(false)}
      />
    </>
  );
};

export default UserFormModal;
