import { useState, ChangeEvent, FormEvent } from "react";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import Sidebar from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import fetchWithAuth from "@/utils/fetchInterceptor";

export default function CreateCategory() {
  const navigate = useNavigate();
  const [category, setCategory] = useState({ name: "", code: "" });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    try {
      const result = await fetchWithAuth("/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
      });
  
      if (!result.success) {
        throw new Error(result.message || "Gagal menambahkan kategori");
      }
  
      navigate("/admin-dashboard/category?success=created");
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
          <button onClick={() => navigate("/admin-dashboard/category")} className="mb-4 flex items-center text-blue-500 hover:underline">
            <FaArrowLeft className="mr-2" /> Back
          </button>

          <h2 className="text-xl font-semibold mb-4">Create New Category</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <div className="flex flex-col">
              <label htmlFor="name" className="mb-1 font-medium text-gray-700">Category Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Category Name"
                onChange={handleChange}
                className="border p-2 rounded-lg w-full"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="code" className="mb-1 font-medium text-gray-700">Category Code</label>
              <input
                type="text"
                id="code"
                name="code"
                placeholder="Category Code"
                onChange={handleChange}
                className="border p-2 rounded-lg w-full"
                required
              />
            </div>

            <div className="flex justify-end">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600">
                <FaSave /> <span>Save Category</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
