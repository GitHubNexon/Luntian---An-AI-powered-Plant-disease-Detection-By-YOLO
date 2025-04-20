import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaCog,
  FaUserShield,
  FaCogs,
  FaBars,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useAuth } from "../contexts/AuthContext";
import { showToast } from "../utils/toastNotifications";
import { useLoading } from "../contexts/LoadingContext";
import { MdDashboard } from "react-icons/md";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { showLoading, hideLoading, setRefresh } = useLoading();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasAccess = (requiredRole) => {
    return user?.access?.includes(requiredRole);
  };

  const handleLogout = async () => {
    try {
      showLoading(2000);
      await logout();
      setRefresh(true);
      hideLoading(2000);
      showToast("Logout successful!", "success");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  const menuItems = [
    {
      path: "/monitoring",
      icon: <FaMagnifyingGlass />,
      label: "Monitoring",
      role: "mr",
    },
    { path: "/admin", icon: <FaUserShield />, label: "Admin", role: "ad" },
    { path: "/settings", icon: <FaCog />, label: "Settings", role: "ss" },
  ];

  return (
    <div
      className={`flex ${
        isOpen ? "w-64" : "w-20"
      } h-full transition-all duration-300`}
    >
      <div
        ref={sidebarRef}
        className="bg-[#005a32] text-white p-5 space-y-6 shadow-lg flex flex-col w-full"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white text-2xl mb-6"
        >
          {isOpen ? (
            <div className="flex justify-end cursor-grab">
              <FaTimes />
            </div>
          ) : (
            <div className="flex justify-center cursor-grab">
              <FaBars />
            </div>
          )}
        </button>

        <div className="mb-4">
          <Link
            to="/"
            className={`flex items-center space-x-3 p-2 rounded-md hover:bg-[#74c476] ${
              location.pathname === "/" ? "bg-green-300 text-gray-800" : ""
            } ${isOpen ? "pl-5" : "justify-center"}`}
          >
            <div
              className={`flex items-center justify-center ${
                isOpen ? "mr-3" : ""
              }`}
            >
              <MdDashboard />
            </div>
            {isOpen && <span>Dashboard</span>}
          </Link>
        </div>

        <div className="space-y-4">
          {menuItems.map(
            ({ path, icon, label, role }) =>
              hasAccess(role) && (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-3 p-2 rounded-md hover:bg-[#74c476] ${
                    location.pathname === path
                      ? "bg-green-300 text-gray-800"
                      : ""
                  } ${isOpen ? "pl-5" : "justify-center"}`}
                >
                  <div
                    className={`flex items-center justify-center ${
                      isOpen ? "mr-3" : ""
                    }`}
                  >
                    {icon}
                  </div>
                  {isOpen && <span>{label}</span>}
                </Link>
              )
          )}
        </div>

        <button
          onClick={handleLogout}
          className={`flex items-center space-x-3 p-2 rounded-md hover:bg-green-600 mt-auto bg-green-500 text-white ${
            isOpen ? "pl-5" : "justify-center"
          }`}
        >
          <div
            className={`flex items-center justify-center ${
              isOpen ? "mr-3" : ""
            }`}
          >
            <FaSignOutAlt />
          </div>
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
