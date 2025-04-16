// src/Pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import NOT_FOUND from "../assets/Images/not_found.png";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-gray-100">
      <img src={NOT_FOUND} alt="Not Found" className="w-80 md:w-96 lg:w-[400px] mb-6" />
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h1>
      <p className="text-gray-600 mb-6">The page you are looking for does not exist or has been moved.</p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 text-white font-medium text-lg rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
      >
        Return to Homepage
      </Link>
    </div>
  );
};

export default NotFound;