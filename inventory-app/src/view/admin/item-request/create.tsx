import { useState } from "react";
import Sidebar from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";

export default function CreateItemRequest() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    desc: "",
    priceRange: "",
    referenceLink: "",
    code: "",
    status: "PENDING",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    console.log("Item Request Created:", formData);
    navigate("/items"); 
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar navigasi */}
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow border p-6">
          <button onClick={() => navigate("/item-request")} className="mb-4 flex items-center text-blue-500 hover:underline">
            <FaArrowLeft className="mr-2" /> Back
          </button>
          <h2 className="text-xl font-semibold mb-4">Create New Item</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input type="text" name="name" placeholder="Item Name" onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <textarea name="desc" placeholder="Description" onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <input type="text" name="priceRange" placeholder="Price Range" onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <input type="url" name="referenceLink" placeholder="Reference Link" onChange={handleChange} className="border p-2 rounded-lg w-full" />
            <input type="text" name="code" placeholder="Item Code" onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <select name="status" onChange={handleChange} className="border p-2 rounded-lg w-full">
              <option value="PENDING">PENDING</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
            <div className="col-span-2 flex justify-end">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600">
                <FaSave /> <span>Save Item</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
