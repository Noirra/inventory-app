import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "@/components/ui/sidebar";
import { FaArrowLeft, FaSave } from "react-icons/fa";

export default function EditRepairRequest() {
  const navigate = useNavigate();
  const { id } = useParams(); 

  const [formData, setFormData] = useState({
    itemId: "",
    repairReason: "",
    estimatedPrice: "",
    status: "PENDING",
    code: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const repairData = {
        itemId: "ITM-001",
        repairReason: "Battery replacement",
        estimatedPrice: "$150",
        status: "PENDING",
        code: "REP-001",
      };
      setFormData(repairData);
    };
    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    console.log("Item Request Updated:", formData);
    navigate("/items"); 
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow border p-6">
          <button onClick={() => navigate("/repair-request")} className="mb-4 flex items-center text-blue-500 hover:underline">
            <FaArrowLeft className="mr-2" /> Back
          </button>
          <h2 className="text-xl font-semibold mb-4">Edit Repair Request</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input type="text" name="itemId" value={formData.itemId} onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <textarea name="repairReason" value={formData.repairReason} onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <input type="text" name="estimatedPrice" value={formData.estimatedPrice} onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <input type="text" name="code" value={formData.code} onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <select name="status" value={formData.status} onChange={handleChange} className="border p-2 rounded-lg w-full">
              <option value="PENDING">PENDING</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REJECTED">REJECTED</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
            <div className="col-span-2 flex justify-end">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600">
                <FaSave /> <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
