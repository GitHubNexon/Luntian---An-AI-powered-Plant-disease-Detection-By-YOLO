import React, { useState } from "react";
// import UserType from "../sub-pages/UserType";
import System from "../sub-pages/System";

const SettingsNav = () => {
  const [activeTab, setActiveTab] = useState("System");

  return (
    <div>
      <div className="border-b overflow-auto">
        <ul className="flex text-[0.9em] pt-4 mb-2">
          {[
            // { name: "UserType", label: "User Type" },
            { name: "System", label: "System" },
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
        {/* {activeTab === "UserType" && <UserType />} */}
        {activeTab === "System" && <System />}
      </div>
    </div>
  );
};

export default SettingsNav;
