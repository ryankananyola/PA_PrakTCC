export const API_BASE_URL = "https://laundry-198-325333151890.us-central1.run.app/api";

// Helper untuk mengambil token JWT terbaru dari localStorage
export function getToken() {
    const authUser = JSON.parse(localStorage.getItem('authUser'));
    return authUser?.token || '';
}