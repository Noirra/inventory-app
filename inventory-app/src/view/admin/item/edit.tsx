import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { FaArrowLeft, FaSave, } from "react-icons/fa";
import Sidebar from "@/components/ui/sidebar";
import { useNavigate, useParams } from "react-router-dom";

export default function EditItem() {
  const { itemId } = useParams<{ itemId: string }>();
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

  useEffect(() => {
    // Simulasi fetch data item berdasarkan itemId
    const fetchItem = async () => {
      try {
        const response = await fetch(`/api/items/${itemId}`); // Ganti dengan URL API backend Laravel
        const data = await response.json();

        setItem({
          categoryId: data.categoryId || "",
          areaId: data.areaId || "",
          name: data.name || "",
          price: data.price || "",
          receipt: data.receipt || "",
          status: data.status || "UNUSED",
          code: data.code || "",
          examinationPeriod: data.examinationPeriod || "",
          groupCode: data.groupCode || "",
        });
      } catch (error) {
        console.error("Failed to fetch item:", error);
      }
    };

    fetchItem();
  }, [itemId]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(item).forEach(([key, value]) => formData.append(key, value));
    if (photo) formData.append("photo", photo);

    try {
      await fetch(`/api/items/${itemId}`, {
        method: "PUT", // Gunakan PUT untuk update
        body: formData,
      });

      console.log("Item updated successfully.");
      navigate("/items");
    } catch (error) {
      console.error("Failed to update item:", error);
    }
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
          <h2 className="text-xl font-semibold mb-4">Edit Item</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4" encType="multipart/form-data">
            <input type="text" name="name" value={item.name} placeholder="Item Name" onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <input type="text" name="categoryId" value={item.categoryId} placeholder="Category ID" onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <input type="text" name="areaId" value={item.areaId} placeholder="Area ID" onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <input type="number" name="price" value={item.price} placeholder="Price" onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <input type="file" name="photo" accept="image/*" onChange={handleFileChange} className="border p-2 rounded-lg w-full" />
            <input type="text" name="receipt" value={item.receipt} placeholder="Receipt URL" onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <input type="text" name="code" value={item.code} placeholder="Item Code" onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <select name="status" value={item.status} onChange={handleChange} className="border p-2 rounded-lg w-full">
              <option value="UNUSED">UNUSED</option>
              <option value="USED">USED</option>
              <option value="BROKEN">BROKEN</option>
              <option value="REPAIRED">REPAIRED</option>
            </select>
            <input type="text" name="examinationPeriod" value={item.examinationPeriod} placeholder="Examination Period" onChange={handleChange} className="border p-2 rounded-lg w-full" />
            <input type="text" name="groupCode" value={item.groupCode} placeholder="Group Code" onChange={handleChange} className="border p-2 rounded-lg w-full" />

            <div className="col-span-2 flex justify-end">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600">
                <FaSave /> <span>Update Item</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
