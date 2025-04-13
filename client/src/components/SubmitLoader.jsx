import React from "react";
import { FaSpinner } from "react-icons/fa"; // Import the spinner icon from React Icons

const SubmitLoader = ({ isLoading }) => {
  return (
    isLoading && (
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div className="flex flex-col items-center">
          {/* <FaSpinner className="animate-spin text-white text-4xl" /> */}
          <span className="loader-random-spin"></span>
        </div>
      </div>
    )
  );
};

export default SubmitLoader;
