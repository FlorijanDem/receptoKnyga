import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function logPageView(pathname) {
    try {
        await axios.post(
            `${API_URL}/logs/pageview`,
            { pathname },
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true, // Send JWT cookie
            }
        );
        console.log("Page view logged:", pathname);
    } catch (error) {
        console.error("Failed to log page view:", error.message);
    }
}