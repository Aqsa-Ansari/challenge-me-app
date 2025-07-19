const hostname = window.location.hostname;

export const ENV =
  hostname === "localhost" || hostname === "127.0.0.1"
    ? "dev"
    : "prod";

export const API_BASE_URL =
  ENV === "dev"
    ? "http://localhost:3000"
    : "https://your-api.onrender.com";