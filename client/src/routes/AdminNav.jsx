import React, { useState } from "react";
import UserType from "../sub-pages/UserType";
import UsersTable from "../sub-pages/UsersTable";
const AdminNav = () => {
  const [activeTab, setActiveTab] = useState("UserType");

  return (
    <div>
      <div className="border-b overflow-auto">
        <ul className="flex text-[0.9em] pt-4 mb-2">
          {[
            { name: "UserType", label: "User Type" },
            { name: "Users", label: "Users" },
          ].map((tab) => (
            <li
              key={tab.name}
              className={`py-1 px-4 border-b-[5px] whitespace-nowrap cursor-pointer ${
                activeTab === tab.name ? "border-[#74c476] font-bold" : "border-transparent"
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
        {activeTab === "UserType" && <UserType />}
        {activeTab === "Users" && <UsersTable />}
      </div>
    </div>
  );
};

export default AdminNav;
