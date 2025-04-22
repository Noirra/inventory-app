import axios, { AxiosError } from "axios";

const API_URL = (`${import.meta.env.VITE_BASE_URL}/auth`); 

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

interface LoginResponse {
    success: boolean;
    message: string;
    data?: {
        token: string;
        roles: string[];
        userId: number;
    };
}
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
        const response = await api.post<LoginResponse>("/login", { email, password });

        if (response.data.success && response.data.data) {
            localStorage.setItem("token", response.data.data.token);
            localStorage.setItem("roles", JSON.stringify(response.data.data.roles));
            localStorage.setItem("userId", response.data.data.userId.toString());
        }

        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        return { success: false, message: axiosError.response?.data?.message || "Login failed" };
    }
};

export const logout = (): { success: boolean; message: string } => {
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
    localStorage.removeItem("userId");
    return { success: true, message: "Logged out successfully" };
};

export default api;