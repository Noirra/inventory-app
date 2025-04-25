import { useState, FormEvent } from "react";
import Sidebar from "@/components/sidebar/employee";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";

export default function CreateItemRequest() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: "",
    desc: "",
    priceRange: "",
    referenceLink: "",
    code: "",
    status: "PENDING",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/item-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Gagal menambahkan item request");
      }
      navigate("/employee-dashboard/item-request?success=created");
    } catch (error: any) {
      alert(error.message || "Terjadi kesalahan");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow border p-6">
          <button
            onClick={() => navigate("/employee-dashboard/item-request")}
            className="mb-4 flex items-center text-blue-500 hover:underline"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
          <h2 className="text-xl font-semibold mb-4">Create New Item</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block mb-1 font-medium">
                Item Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter item name"
                onChange={handleChange}
                className="border p-2 rounded-lg w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="desc" className="block mb-1 font-medium">
                Description
              </label>
              <textarea
                name="desc"
                id="desc"
                placeholder="Enter item description"
                onChange={handleChange}
                className="border p-2 rounded-lg w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="priceRange" className="block mb-1 font-medium">
                Item Price
              </label>
              <input
                type="number"
                name="priceRange"
                id="priceRange"
                placeholder="Enter Item Price"
                onChange={handleChange}
                className="border p-2 rounded-lg w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="referenceLink" className="block mb-1 font-medium">
                Reference Link
              </label>
              <input
                type="url"
                name="referenceLink"
                id="referenceLink"
                placeholder="https://example.com/item"
                onChange={handleChange}
                className="border p-2 rounded-lg w-full"
              />
            </div>
            <div className="col-span-2 flex justify-end">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600"
              >
                <FaSave /> <span>Save Item</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
