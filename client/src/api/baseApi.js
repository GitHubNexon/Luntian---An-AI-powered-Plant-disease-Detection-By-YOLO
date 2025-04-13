// src/api/authApi.js
import axios from 'axios';
import { API_BASE_URL } from './config.js';

const baseApi = {

  // Fetch base data
  getBaseData: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/base/get`, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error("Error fetching base data:", error);
      throw error;
    }
  },

  // Create a new user type
  createUserType: async (userType) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/base/user`, userType, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error("Error creating user type:", error);
      throw error;
    }
  },

  // Update a user type by ID
  updateUserType: async (id, userType) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/base/user/${id}`, userType, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error("Error updating user type:", error);
      throw error;
    }
  },

  // Delete a user type by ID
  deleteUserType: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/base/user/${id}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error("Error deleting user type:", error);
      throw error;
    }
  }
};

export default baseApi;
