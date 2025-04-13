import React, { useState, useEffect } from "react";
import moment from "moment";
import { FiClock } from "react-icons/fi";

const Clock = () => {
  const [time, setTime] = useState(moment());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(moment());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <FiClock className="text-gray-500 text-3xl flex-shrink-0" />
      <div className="w-full sm:w-auto flex-1 break-words">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-gray-800 ">
            {time.format("hh:mm:ss")}
          </span>
          <span className="text-sm text-gray-500 ">{time.format("A")}</span>
        </div>
        <div className="text-sm text-gray-600 ">
          {time.format("dddd, MMMM DD, YYYY")}
        </div>
      </div>
    </div>
  );
};

export default Clock;
