import axios from "axios";

// Create an axios instance pointing to our local API (v1)
const api = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// SWR fetcher function using the axios instance
export const fetcher = (url) => api.get(url).then((res) => res.data);

export default api;
