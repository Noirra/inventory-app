import { useState, ChangeEvent, FormEvent } from "react";
import { FaArrowLeft, FaSave, } from "react-icons/fa";
import Sidebar from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";

export default function CreateItem() {
  const navigate = useNavigate();
  const [item, setItem] = useState({
    categoryId: "",
    areaId: "",
    name: "",
    price: "",
    receipt: "",
    status: "UNUSED",
    code: "",
    examinationPeriod: "",
    groupCode: "",
  });
  const [photo, setPhoto] = useState<File | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(item).forEach(([key, value]) => formData.append(key, value));
    if (photo) formData.append("photo", photo);

    // Simulasi submit - di sini Anda bisa melakukan POST request ke backend menggunakan fetch atau axios
    console.log("Item Created:", { ...item, photo });

    navigate("/items");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar /> 

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow border p-6">
          <button onClick={() => navigate("/item")} className="mb-4 flex items-center text-blue-500 hover:underline">
            <FaArrowLeft className="mr-2" /> Back
          </button>
          <h2 className="text-xl font-semibold mb-4">Create New Item</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4" encType="multipart/form-data">
            <input type="text" name="name" placeholder="Item Name" onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <input type="text" name="categoryId" placeholder="Category ID" onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <input type="text" name="areaId" placeholder="Area ID" onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <input type="number" name="price" placeholder="Price" onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <input type="file" name="photo" accept="image/*" onChange={handleFileChange} className="border p-2 rounded-lg w-full" required />
            <input type="text" name="receipt" placeholder="Receipt URL" onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <input type="text" name="code" placeholder="Item Code" onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <select name="status" onChange={handleChange} className="border p-2 rounded-lg w-full">
              <option value="UNUSED">UNUSED</option>
              <option value="USED">USED</option>
              <option value="BROKEN">BROKEN</option>
              <option value="REPAIRED">REPAIRED</option>
            </select>
            <input type="text" name="examinationPeriod" placeholder="Examination Period" onChange={handleChange} className="border p-2 rounded-lg w-full" />
            <input type="text" name="groupCode" placeholder="Group Code" onChange={handleChange} className="border p-2 rounded-lg w-full" />

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