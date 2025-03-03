import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "@/api/api";
import { FiBox } from "react-icons/fi";

const Signin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await login(email, password);

        if (response.success) {
            const roles = JSON.parse(localStorage.getItem("roles") || "[]");
            if (roles.includes("admin")) {
                navigate("/admin-dashboard");
            } else if (roles.includes("owner")) {
                navigate("/owner-dashboard");
            } else {
                navigate("/employee-dashboard");
            }
        } else {
            setError(response.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-blue-700">
            <div className="bg-white shadow-lg rounded-lg p-8 w-96">
                <div className="flex flex-col items-center">
                    <FiBox className="text-blue-600 text-4xl" />
                    <h2 className="text-2xl font-semibold text-gray-700 mt-2">Inventory Login</h2>
                </div>
                {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
                <form onSubmit={handleLogin} className="mt-6">
                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm mb-2">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm mb-2">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signin;
