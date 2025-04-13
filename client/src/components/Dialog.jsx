import React from 'react';
import { IoWarningOutline } from "react-icons/io5";

const Dialog = ({
  icon = <IoWarningOutline className="w-8 h-8 text-yellow-500" />,
  title = "Are you sure?",
  description = "This action cannot be undone. Please confirm to proceed.",
  isProceed = "Yes, Proceed",
  isCanceled = "Cancel",
  onConfirm,
  onCancel,
  isOpen = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50/15 drop-shadow-2xl z-50 ">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 border-2"
      data-aos="zoom-in"
      data-aos-duration="100"
      >
        <div className="flex flex-col items-center gap-4">
          <div>{icon}</div>
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <p className="text-gray-600 text-center">{description}</p>
          
          <div className="flex gap-4 mt-4 w-full">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              {isCanceled}
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {isProceed}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Dialog;