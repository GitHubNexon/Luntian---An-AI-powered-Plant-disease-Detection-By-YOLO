import axios from "axios";
import { API_BASE_URL } from "./configFlask.js";

axios.defaults.withCredentials = true;

const liveDetectApi = {
  startLiveDetection: async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/yolo_v8/start_live_detection`
      );
      return response.data;
    } catch (error) {
      console.error("Error starting live detection:", error);
      throw error;
    }
  },

  stopLiveDetection: async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/yolo_v8/stop_live_detection`
      );
      return response.data;
    } catch (error) {
      console.error("Error stopping live detection:", error);
      throw error;
    }
  },

  getVideoFeed: () => {
    return `${API_BASE_URL}/yolo_v8/video_feed`;
  },
};
export default liveDetectApi;
