import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import FloatingBar from "./FloatingBar";

const Layout = ({ children }) => {
  return (
    <>
      <div className="flex h-[100vh]">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="overflow-y-hidden flex flex-1 flex-col">
          <div className="flex-1 overflow-y-scroll bg-gray-200 p-2">
            <Header />
            <div className="bg-white rounded">{children}</div>
            <span className="self-end text-end m-2 block text-[0.6em] text-gray-400">
              v0.1 03/29/2025
            </span>
            <span className="self-end text-end m-2 block text-[0.6em] text-gray-400">
              Powered by:{" "}
              <a
                href="https://HyperCoreSolution.com/HyperVault/"
                className="text-blue-500 italic"
                target="_blank"
                rel="noopener noreferrer"
              >
                HyperCoreSolution.com/HyperVault/
              </a>
            </span>
          </div>
        </div>
      </div>
      <FloatingBar />
    </>
  );
};

export default Layout;
