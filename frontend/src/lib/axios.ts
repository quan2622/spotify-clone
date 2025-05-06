
import axios from "axios";

export const axiosIntance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000/api/" : "/api/",
})