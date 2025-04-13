import axios from "axios";
import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../api/config";

const useBase = () => {
  const [base, setBase] = useState({
    userTypes: [],
    accessTypes: [],
  });

  useEffect(() => {
    fetchBase();
  }, []);

  const fetchBase = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/base/get`, {
        withCredentials: true,
      });
      const base = response.data;
      setBase(base);
    } catch (error) {
      console.error("Error fetching base data: ", error);
    }
  };

  return {
    base,
    setBase,
    fetchBase,
  };
};

export default useBase;
