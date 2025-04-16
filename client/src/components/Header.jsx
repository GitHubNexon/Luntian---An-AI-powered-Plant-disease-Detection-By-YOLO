import React, { useState, useEffect, useRef } from "react";
import Clock from "../components/Clock";
import { FaBell } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import userApi from "../api/userApi";
import Profile from "../components/Profile";

const Header = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const profileRef = useRef(null); // Ref to the profile modal

  useEffect(() => {
    const fetchData = async () => {
      if (user && user._id) {
        const data = await userApi.getUserById(user._id);
        setUserData(data);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    // Function to handle clicks outside the profile modal
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    // Add event listener for clicks outside
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="dark:bg-[#c7e9c0] text-gray-800 p-2 flex justify-between items-center rounded-t-2xl mb-2">
        {/* Left - Clock */}
        <div className="flex items-center">
          <Clock />
        </div>

        {/* Right - Icons */}
        <div className="flex items-center space-x-4">
          {userData?.profileImage ? (
            <img
              src={userData.profileImage}
              alt="Profile"
              onClick={() => setShowProfile(true)}
              className="w-8 h-8 rounded-full object-cover border-2 border-green-800 cursor-pointer  hover:scale-110 hover:border-green-500 transition-all"
            />
          ) : (
            <div
              onClick={() => setShowProfile(true)}
              className="w-8 h-8 rounded-full bg-gray-400 cursor-pointer"
            />
          )}
          <FaBell className="text-gray-600 w-6 h-6" />
        </div>
      </div>

      {/* 💥 Centered Floating Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            ref={profileRef} // Assign the ref to the profile modal
            className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-md relative"
          >
            <Profile />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
