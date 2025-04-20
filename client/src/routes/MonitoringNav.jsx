import React, { useState } from "react";
import Detections from "../pages/Detections";
import Sensors from "../pages/Sensors"

const MonitoringNav = () => {
  const [activeTab, setActiveTab] = useState("Detections");

  return (
    <div>
      <div className="border-b overflow-auto">
        <ul className="flex text-[0.9em] pt-4 mb-2">
          {[
            { name: "Detections", label: "Detections" },
            { name: "Sensors", label: "Sensors" },
          ].map((tab) => (
            <li
              key={tab.name}
              className={`py-1 px-4 border-b-[5px] whitespace-nowrap cursor-pointer ${
                activeTab === tab.name
                  ? "border-[#74c476] font-bold"
                  : "border-transparent"
              }`}
              onClick={() => setActiveTab(tab.name)}
            >
              {tab.label}
            </li>
          ))}
        </ul>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === "Sensors" && <Sensors />}
        {activeTab === "Detections" && <Detections />}
      </div>
    </div>
  );
};

export default MonitoringNav;
