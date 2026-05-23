import axios from "axios";
import API_URL from "./api";

export const assignTask = async (data) => {
  try {
    console.log("ASSIGN API URL:", `${API_URL}/tasks/assign`);
    console.log("ASSIGN DATA:", data);

    const response = await axios.post(`${API_URL}/tasks/assign`, data);
    return response.data;
  } catch (error) {
    console.log("Assign Task API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const getTasks = async () => {
  const response = await axios.get(`${API_URL}/tasks/all`);
  return response.data;
};

export const completeTask = async (taskId) => {
  const response = await axios.put(`${API_URL}/tasks/${taskId}/complete`);
  return response.data;
};