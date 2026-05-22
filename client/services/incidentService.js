import axios from "axios";
import API_URL from "./api";

export const createIncident = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/incidents/create`, data);

    return response.data;
  } catch (error) {
    console.log("API Error:", error.response?.data || error.message);
    throw error; // important
  }
};

export const getIncidents = async () => {
  try {
    const response = await axios.get(`${API_URL}/incidents/all`);

    return response.data;
  } catch (error) {
    console.log("API Error:", error.response?.data || error.message);
    throw error;
  }
};
