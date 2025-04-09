import { useState, ChangeEvent, FormEvent } from "react";
import { FaArrowLeft, FaSave, } from "react-icons/fa";
import Sidebar from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import fetchWithAuth from "@/utils/fetchInterceptor";

export default function CreateUser() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetchWithAuth("/users", {
        method: "POST",
        body: JSON.stringify(user),
      });
  
      const result = await response;
      console.log(result)
  
      if (!response.ok) {
        throw new Error(result.message || "Gagal menambahkan user");
      }
      navigate("/user?success=created");
    } catch (error: any) {
      alert(error.message || "Terjadi kesalahan");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow border p-6">
          <button onClick={() => navigate("/users")} className="mb-4 flex items-center text-blue-500 hover:underline">
            <FaArrowLeft className="mr-2" /> Back
          </button>
          <h2 className="text-xl font-semibold mb-4">Create New User</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <input type="text" name="name" placeholder="Full Name" onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <input type="email" name="email" placeholder="Email Address" onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <div className="flex justify-end">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600">
                <FaSave /> <span>Save User</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
