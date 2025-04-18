import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserShield, FaCog, FaSignOutAlt } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";
import { useAuth } from "../contexts/AuthContext";
import { showToast } from "../utils/toastNotifications";
import { useLoading } from "../contexts/LoadingContext";

const FloatingBar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { showLoading, hideLoading, setRefresh } = useLoading();
  const [tooltip, setTooltip] = useState(null);

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

  const hasAccess = (requiredRole) => {
    return user?.access?.includes(requiredRole);
  };

  const menuItems = [
    {
      path: "/",
      icon: <MdDashboard />,
      label: "Dashboard",
      role: null, // No role required for Dashboard
    },
    {
      path: "/monitoring",
      icon: <FaMagnifyingGlass />,
      label: "monitoring",
      role: "mr",
    },
    { path: "/admin", icon: <FaUserShield />, label: "Admin", role: "ad" },
    { path: "/settings", icon: <FaCog />, label: "Settings", role: "ss" },
  ];

  const handleTouchStart = (label) => {
    setTooltip(label);
  };

  const handleTouchEnd = () => {
    setTooltip(null);
  };

  return (
    <div className="fixed bottom-4 left-0 right-0 mx-auto w-fit bg-[#005a32] text-white p-3 rounded-full shadow-lg flex space-x-6 md:hidden z-50">
      {menuItems.map(
        ({ path, icon, label, role }) =>
          (!role || hasAccess(role)) && (
            <div key={path} className="relative">
              <Link
                to={path}
                className={`flex items-center p-2 rounded-full hover:bg-[#74c476] ${
                  location.pathname === path ? "bg-green-300 text-gray-800" : ""
                }`}
                onTouchStart={() => handleTouchStart(label)}
                onTouchEnd={handleTouchEnd}
                onMouseEnter={() => setTooltip(label)}
                onMouseLeave={() => setTooltip(null)}
              >
                {icon}
              </Link>
              {tooltip === label && (
                <span className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                  {label}
                </span>
              )}
            </div>
          )
      )}
      <button
        className={`flex items-center p-2 rounded-full hover:bg-green-600 bg-green-500 text-white`}
        onClick={handleLogout}
        onTouchStart={() => handleTouchStart("Logout")}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setTooltip("Logout")}
        onMouseLeave={() => setTooltip(null)}
      >
        <FaSignOutAlt />
        {tooltip === "Logout" && (
          <span className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
            Logout
          </span>
        )}
      </button>
    </div>
  );
};

export default FloatingBar;
