import axios from "axios";
import { API_BASE_URL } from "./config.js";

const chatApi = {
  createConversation: async (conversationData) => {
    return axios.post(
      `${API_BASE_URL}/chat/create/conversation`,
      conversationData,
      {
        withCredentials: true,
      }
    );
  },

  getConversation: async (userId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/chat/get/conversation/${userId}`,
        { withCredentials: true }
      );

      return response.data; 
    } catch (error) {
      console.error("❌ Error fetching conversation:", error);
      throw error;
    }
  },
};

export default chatApi;
