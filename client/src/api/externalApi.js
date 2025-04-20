import axios from "axios";
import { API_BASE_URL } from "./config.js";

const externalApi = {
  getWeather: async (city) => {
    return axios.post(`${API_BASE_URL}/external-api/get/open-weather`, city, {
      withCredentials: true,
    });
  },
};

export default externalApi;
