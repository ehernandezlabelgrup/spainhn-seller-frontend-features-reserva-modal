import axios from "axios";

export default axios.create({
  baseURL: process.env.VUE_APP_CLORIAN_API_URL,
  headers: {
    "Content-Type": "application/json",
  }
});