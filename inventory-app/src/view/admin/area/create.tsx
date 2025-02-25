import { useState, ChangeEvent, FormEvent } from "react";
import { FaArrowLeft, FaSave, } from "react-icons/fa";
import Sidebar from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";

export default function CreateArea() {
  const navigate = useNavigate();
  const [area, setArea] = useState({
    name: "",
    code: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setArea({ ...area, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Simulasi submit - di sini Anda bisa melakukan POST request ke backend menggunakan fetch atau axios
    console.log("Area Created:", area);

    navigate("/area");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow border p-6">
          <button onClick={() => navigate("/area")} className="mb-4 flex items-center text-blue-500 hover:underline">
            <FaArrowLeft className="mr-2" /> Back
          </button>
          <h2 className="text-xl font-semibold mb-4">Create New Area</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <input type="text" name="name" placeholder="area Name" onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <input type="text" name="code" placeholder="area Code" onChange={handleChange} className="border p-2 rounded-lg w-full" required />

            <div className="flex justify-end">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600">
                <FaSave /> <span>Save Area</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}