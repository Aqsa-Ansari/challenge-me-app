const localhosts = ["localhost", "127.0.0.1", "0.0.0.0"]

const isLocalhost = localhosts.includes(window?.location?.hostname);

export const ENV = isLocalhost ? "dev" : "prod";

export const API_BASE_URL =
  ENV === "dev"
    ? "http://localhost:5000"
    : "https://5d246004-b1bf-465c-ae23-5042ca5144a9-00-3vjhokw1r7ke6.pike.replit.dev:5000";