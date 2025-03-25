import { useState, ChangeEvent, FormEvent } from "react";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import Sidebar from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import fetchWithAuth from "@/utils/fetchInterceptor";

export default function CreateGroupCode() {
  const navigate = useNavigate();
  const [groupCode, setGroupCode] = useState({ name: "" });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGroupCode({ ...groupCode, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  try {
    const response = await fetchWithAuth("/item-group", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(groupCode),
    });

    navigate("/admin-dashboard/groupcode?success=created");
  } catch (error: any) {
    alert(error.message || "An error occurred");
  }
};

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow border p-6">
          <button onClick={() => navigate("/admin-dashboard/groupcode")} className="mb-4 flex items-center text-blue-500 hover:underline">
            <FaArrowLeft className="mr-2" /> Back
          </button>

          <h2 className="text-xl font-semibold mb-4">Create New Group Code</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="name" className="block font-medium mb-1">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter Group Code Name"
                onChange={handleChange}
                className="border p-2 rounded-lg w-full"
                required
              />
            </div>

            <div className="flex justify-end">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600">
                <FaSave /> Save Group Code
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
