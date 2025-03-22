import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; // Replace with actual backend URL

export const uploadContent = async (data) => {
  return await axios.post(`${API_BASE_URL}/upload`, data);
};

export const retrieveContent = async (sessionId) => {
  return await axios.get(`${API_BASE_URL}/retrieve/${sessionId}`);
};
