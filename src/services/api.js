import axios from "axios";

const API_BASE_URL = "swiftshare-backend-cydvavdbgkamdkg7.centralindia-01.azurewebsites.net"; // Replace with actual backend URL

export const uploadContent = async (data) => {
  return await axios.post(`${API_BASE_URL}/upload`, data);
};

export const retrieveContent = async (sessionId) => {
  return await axios.get(`${API_BASE_URL}/retrieve/${sessionId}`);
};
