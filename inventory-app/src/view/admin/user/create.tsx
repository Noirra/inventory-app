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
      const result = await fetchWithAuth("/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
  
      if (!result.success) {
        throw new Error(result.message || "Gagal menambahkan user");
      }
  
      navigate("/admin-dashboard/users?success=created");
    } catch (error: any) {
      const msg = error.message || "Terjadi kesalahan";
  
      if (msg.toLowerCase().includes("duplicate")) {
        alert("User dengan email ini sudah terdaftar.");
      } else {
        alert(msg);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow border p-6">
          <button onClick={() => navigate("/admin-dashboard/users")} className="mb-4 flex items-center text-blue-500 hover:underline">
            <FaArrowLeft className="mr-2" /> Back
          </button>
          <h2 className="text-xl font-semibold mb-4">Create New User</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label htmlFor="name" className="mb-1 font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Full Name"
                  onChange={handleChange}
                  className="border p-2 rounded-lg w-full"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="email" className="mb-1 font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email Address"
                  onChange={handleChange}
                  className="border p-2 rounded-lg w-full"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="password" className="mb-1 font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  className="border p-2 rounded-lg w-full"
                  required
                />
              </div>
            </div>            <div className="flex justify-end">
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
