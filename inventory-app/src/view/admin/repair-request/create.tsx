import { useState } from "react";
import Sidebar from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";

export default function CreateRepairRequest() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    itemId: "",
    repairReason: "",
    estimatedPrice: "",
    status: "PENDING",
    code: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar navigasi */}
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow border p-6">
          <button onClick={() => navigate("/repair-request")} className="mb-4 flex items-center text-blue-500 hover:underline">
            <FaArrowLeft className="mr-2" /> Back
          </button>
          <h2 className="text-xl font-semibold mb-4">Create Repair Request</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input type="text" name="itemId" placeholder="Item ID" onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <textarea name="repairReason" placeholder="Repair Reason" onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <input type="text" name="estimatedPrice" placeholder="Estimated Price" onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <input type="text" name="code" placeholder="Repair Code" onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <select name="status" onChange={handleChange} className="border p-2 rounded-lg w-full">
              <option value="PENDING">PENDING</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REJECTED">REJECTED</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
            <div className="col-span-2 flex justify-end">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600">
                <FaSave /> <span>Save Repair Request</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
