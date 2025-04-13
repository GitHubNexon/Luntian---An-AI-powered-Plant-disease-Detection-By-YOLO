import React from "react";
import Clock from "../components/Clock";
import { FaBell, FaCircle } from "react-icons/fa";

const Header = () => {
  return (
    <div className="dark:bg-[#c7e9c0] text-gray-800 p-2 flex justify-between items-center rounded-t-2xl mb-2">
      {/* Left side - Clock */}
      <div className="flex items-center">
        <Clock />
      </div>

      {/* Right side - Icons */}
      <div className="flex items-center space-x-4">
        <FaCircle className="text-gray-600 w-6 h-6" />
        <FaBell className="text-gray-600 w-6 h-6" />
      </div>
    </div>
  );
};

export default Header;
