import axios from "axios";
import { API_BASE_URL } from "./config.js";

const detectApi = {
  getAllDetections: async (
    page = 1,
    limit = 10,
    keyword = "",
    sortBy = "",
    sortOrder = "asc",
    date = "",
    status = ""
  ) => {
    const response = await axios.get(
      `${API_BASE_URL}/detect/get-all/detection`,
      {
        params: { page, limit, keyword, sortBy, sortOrder, date, status },
        withCredentials: true,
      }
    );
    console.log(response);
    return response.data;
  },

  //reserve for create detection

  createDetections: async (detectionData) => {
    return axios.post(
      `${API_BASE_URL}/detect/create/detection`,
      detectionData,
      {
        withCredentials: true,
      }
    );
  },

  updateDetections: async (id, detectionData) => {
    return axios.patch(
      `${API_BASE_URL}/detect/update/detection/${id}`,
      detectionData,
      {
        withCredentials: true,
      }
    );
  },

  permanentDeleteDetection: async (id) => {
    return axios.delete(
      `${API_BASE_URL}/detect/permanent-delete/detection/${id}`,
      {
        withCredentials: true,
      }
    );
  },

  softDeleteDetection: async (id) => {
    return axios.post(
      `${API_BASE_URL}/detect/soft-delete/detection/${id}`,
      {},
      {
        withCredentials: true,
      }
    );
  },

  softArchiveDetection: async (id) => {
    return axios.post(
      `${API_BASE_URL}/detect/soft-archive/detection/${id}`,
      {},
      {
        withCredentials: true,
      }
    );
  },

  undoDeleteDetection: async (id) => {
    return axios.post(
      `${API_BASE_URL}/detect/undo-delete/detection/${id}`,
      {},
      {
        withCredentials: true,
      }
    );
  },

  undoArchiveDetection: async (id) => {
    return axios.post(
      `${API_BASE_URL}/detect/undo-archive/detection/${id}`,
      {},
      {
        withCredentials: true,
      }
    );
  },
};
export default detectApi;
