// LoadingContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [delay, setDelay] = useState(100);

  const showLoading = (customDelay) => {
    const finalDelay = customDelay !== undefined ? customDelay : delay;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (refresh) {
        setTimeout(() => {
          window.location.reload();
        }, 0);
      }
    }, finalDelay);
  };

  const hideLoading = (customDelay) => {
    const finalDelay = customDelay !== undefined ? customDelay : delay;
    setTimeout(() => {
      setIsLoading(false);
      if (refresh) {
        setTimeout(() => {
          window.location.reload();
        }, 0);
      }
    }, finalDelay);
  };

  useEffect(() => {
    if (!isLoading) {
      setRefresh(false);
    }
  }, [isLoading]);

  return (
    <LoadingContext.Provider
      value={{ showLoading, hideLoading, setRefresh }}
    >
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black opacity-80 z-50">
          <div className="loader1"></div>
        </div>
      )}
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
