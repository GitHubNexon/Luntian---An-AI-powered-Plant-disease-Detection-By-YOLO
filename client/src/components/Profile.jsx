import React, { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import userApi from "../api/userApi";
import TextInput from "../components/TextInput";
import { useLoading } from "../contexts/LoadingContext";
import { showToast } from "../utils/toastNotifications";
import { FaCamera } from "react-icons/fa"; // Camera icon

const Profile = () => {
  const { showLoading, hideLoading } = useLoading();
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    profileImage: "",
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const fileInputRef = useRef();
  const maxFileSizeMB = 5;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        showToast("Please upload a valid image file.", "error");
        return;
      }

      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxFileSizeMB) {
        showToast(
          "File size exceeds 5MB. Please upload a smaller file.",
          "warning"
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Image = event.target.result; // includes 'data:image/jpeg;base64,...'
        setFormData((prev) => ({
          ...prev,
          profileImage: base64Image,
        }));
        showToast("Image uploaded successfully!", "success");
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        showToast("Failed to read the file. Please try again.", "error");
      };
      reader.readAsDataURL(file);
    } else {
      showToast("No file selected. Please choose an image file.", "error");
    }
  };

  const fetchUserDetails = useCallback(async () => {
    try {
      setLoading(true);
      if (user && user._id) {
        const data = await userApi.getUserById(user._id);
        setUserData(data);
        setFormData({
          username: data.username || "",
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          profileImage: data.profileImage || "",
        });
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      showLoading(3000);
      await userApi.updateUser(user._id, formData);
      await fetchUserDetails();
      hideLoading(3000);
      showToast("Profile Updated", "success");
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update user:", error);
      showToast("Failed to update profile", "error");
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (!user) return <div>User not logged in</div>;
  if (!userData) return <div>No user data found.</div>;

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">
        Welcome, {userData.firstName} {userData.lastName}
      </h2>

      <div className="text-center mb-6">
        <div
          className="relative inline-block w-36 h-36 rounded-full overflow-hidden cursor-pointer border border-gray-300"
          onClick={() => isEditing && fileInputRef.current.click()}
        >
          <img
            src={formData.profileImage || userData.profileImage}
            alt="Profile"
            className="w-full h-full object-cover hover:scale-110 hover:border-green-500 transition-all"
          />
          {isEditing && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-3xl opacity-0 hover:opacity-100 transition-opacity duration-300">
                <FaCamera />
              </div>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <>
          <TextInput
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <TextInput
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          <TextInput
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          <button
            onClick={handleSave}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </>
      ) : (
        <>
          <p>
            <strong>Username:</strong> {userData.username}
          </p>
          <p>
            <strong>First Name:</strong> {userData.firstName}
          </p>
          <p>
            <strong>Last Name:</strong> {userData.lastName}
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Edit
          </button>
        </>
      )}
    </div>
  );
};

export default Profile;
