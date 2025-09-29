import axios from "axios";

import {API_CONFIG} from "@/components/APIs/config.jsx";
const BASE_URL = API_CONFIG.baseUrl  // your FastAPI URL


export async function loginUser(username, password) {
  try {
    const response = await axios.post(`${BASE_URL}/auth/GetUserAccessToken`, {
      username,
      password,
    });
    return response.data; // returns {status, message, ApiKey, access_token}
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
}
