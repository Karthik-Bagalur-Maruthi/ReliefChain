import { Platform } from "react-native";

const API_URL =
  Platform.OS === "web"
    ? "http://localhost:5000/api"
    : "http://10.200.116.207:5000/api";

export default API_URL;
