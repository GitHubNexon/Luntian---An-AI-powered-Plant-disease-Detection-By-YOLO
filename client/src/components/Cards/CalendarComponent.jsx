import React, { useState } from "react";
import Calendar from "react-calendar";
import moment from "moment";
import "react-calendar/dist/Calendar.css";
import "./calendar.css";

const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());
  const [calendarKey, setCalendarKey] = useState(Date.now()); // Force re-render

  const resetDate = () => {
    const today = new Date();
    setDate(today);
    setCalendarKey(Date.now()); 
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center w-full max-w-fit m-2">
      <Calendar
        key={calendarKey} 
        onChange={setDate}
        value={date}
      />
      <p className="mt-4 text-center text-lg font-semibold">
        Selected Date: {moment(date).format("MMMM Do YYYY")}
      </p>
      <button
        onClick={resetDate}
        className="mt-3 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
      >
        Today
      </button>
    </div>
  );
};

export default CalendarComponent;
