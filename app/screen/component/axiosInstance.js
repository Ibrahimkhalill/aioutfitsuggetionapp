
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const axiosInstance = axios.create({
  baseURL: "https://cherryapi.pythonanywhere.com",
});
// http://24.144.85.64/fast/api/correct_grammar/

// ✅ Function to Refresh Token

// ✅ Attach Token to Requests
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
// Function to refresh access token using the refresh token
const refreshAccessToken = async () => {
  try {
    // Get the stored refresh token
    const refreshToken = await AsyncStorage.getItem("refreshToken");

    if (!refreshToken) {
      throw new Error("No refresh token found");
    }

    // Make a request to your backend to refresh the token
    const response = await axiosInstance.post("/auth/refresh-token", {
      token: refreshToken,
    });

    // Assuming the response contains the new access token
    const { accessToken } = response.data;

    // Save the new tokens to AsyncStorage
    await AsyncStorage.setItem("token", accessToken);
   

    return accessToken; // Return the new access token
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw new Error("Failed to refresh access token");
  }
};

// ✅ Handle 401 Errors (Expired Token)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const token = await AsyncStorage.getItem("token");
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      if (token) {
        
        const newToken = await refreshAccessToken();
        if (newToken) {
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }
      }

    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
