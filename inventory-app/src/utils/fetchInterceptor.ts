const API_BASE_URL: string = import.meta.env.VITE_BASE_URL; // Change this to your API base URL

type FetchOptions = RequestInit & { headers?: HeadersInit };

const getAuthToken = (): string | null => {
    return localStorage.getItem("token"); // Adjust as needed (e.g., sessionStorage, cookies)
};

const fetchWithAuth = async (endpoint: string, options: FetchOptions = {}): Promise<any> => {
    const token = getAuthToken();
    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response: Response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
};

export default fetchWithAuth;
