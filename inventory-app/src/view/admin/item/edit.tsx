import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import Sidebar from "@/components/ui/sidebar";
import { useNavigate, useParams } from "react-router-dom";
import fetchWithAuth from "@/utils/fetchInterceptor";

export default function EditItem() {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();

  const [item, setItem] = useState({
    categoryId: "",
    areaId: "",
    name: "",
    price: "",
    code: "",
    examinationPeriod: "",
    status: "UNUSED",
    groupCode: "",
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [photoBeforeUrl, setPhotoBeforeUrl] = useState<string | null>(null);
  const [receiptBeforeUrl, setReceiptBeforeUrl] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [areas, setAreas] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemData = await fetchWithAuth(`/items/${itemId}`);
        setItem({
          categoryId: itemData.data.categoryId || "",
          areaId: itemData.data.areaId || "",
          name: itemData.data.name || "",
          price: itemData.data.price || "",
          code: itemData.data.code || "",
          examinationPeriod: itemData.data.examinationPeriodMonth || "",
          status: itemData.data.status || "UNUSED",
          groupCode: itemData.data.groupCode || "",
        });

        // Set image preview
        setPhotoBeforeUrl(`https://inventory.bariqfirjatullah.my.id/${itemData.data.photo}`);
        setReceiptBeforeUrl(`https://inventory.bariqfirjatullah.my.id/${itemData.data.receipt}`);

        const categoriesData = await fetchWithAuth("/categories");
        setCategories(categoriesData.data || []);

        const areasData = await fetchWithAuth("/areas");
        setAreas(areasData.data || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [itemId]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: "photo" | "receipt") => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (type === "photo") {
        setPhoto(file);
        setPhotoBeforeUrl(URL.createObjectURL(file));
      } else {
        setReceipt(file);
        setReceiptBeforeUrl(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(item).forEach(([key, value]) => formData.append(key, value));
    if (photo) formData.append("photo", photo);
    if (receipt) formData.append("receipt", receipt);

    try {
      await fetchWithAuth(`/items/${itemId}`, {
        method: "PATCH",
        body: formData,
      });
      navigate("/admin-dashboard/items?success=updated");
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow border p-6 relative">
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => navigate("/admin-dashboard/items")} className="flex items-center text-blue-500 hover:underline">
              <FaArrowLeft className="mr-2" /> Back
            </button>
            <h2 className="text-xl font-semibold">Edit Item</h2>
          </div>
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
            <div className="border p-4 rounded-lg shadow bg-gray-50 relative">
              <div className="mb-4">
                <label className="block font-semibold">Item Name</label>
                <input type="text" name="name" value={item.name} onChange={handleChange} className="border p-2 rounded-lg w-full" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold">Category</label>
                  <select name="categoryId" value={item.categoryId} onChange={handleChange} className="border p-2 rounded-lg w-full" required>
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold">Area</label>
                  <select name="areaId" value={item.areaId} onChange={handleChange} className="border p-2 rounded-lg w-full" required>
                    <option value="">Select Area</option>
                    {areas.map((area) => (
                      <option key={area.id} value={area.id}>{area.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block font-semibold">Examination Period</label>
                  <input
                    type="number"
                    name="examinationPeriod"
                    value={item.examinationPeriod}
                    onChange={handleChange}
                    className="border p-2 rounded-lg w-full"
                  />
                </div>
                <div>
                  <label className="block font-semibold">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={item.price}
                    onChange={handleChange}
                    className="border p-2 rounded-lg w-full"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block font-semibold">Photo</label>
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "photo")}
                    className="border p-2 rounded-lg w-full"
                  />
                  {photoBeforeUrl && (
                    <img
                      src={photoBeforeUrl}
                      alt="Current Photo"
                      className="mt-2 rounded border h-40 object-contain"
                    />
                  )}
                </div>
                <div>
                  <label className="block font-semibold">Receipt</label>
                  <input
                    type="file"
                    name="receipt"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "receipt")}
                    className="border p-2 rounded-lg w-full"
                  />
                  {receiptBeforeUrl && (
                    <img
                      src={receiptBeforeUrl}
                      alt="Current Receipt"
                      className="mt-2 rounded border h-40 object-contain"
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end">
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