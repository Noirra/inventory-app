import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { FaArrowLeft, FaSave, FaTrash } from "react-icons/fa";
import Sidebar from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import fetchWithAuth from "@/utils/fetchInterceptor";

export default function CreateItem() {
  const navigate = useNavigate();
  const [items, setItems] = useState([
    {
      categoryId: "",
      areaId: "",
      name: "",
      price: "",
      code: "",
      examinationPeriod: "",
      photo: null as File | null,
      receipt: null as File | null,
    },
  ]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [areas, setAreas] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await fetchWithAuth("/categories");
        setCategories(categoriesData.data || []);

        const areasData = await fetchWithAuth("/areas");
        setAreas(areasData.data || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type, value, files } = e.target as HTMLInputElement;
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [name]: type === "file" && files ? files[0] : value,
    };
    setItems(updatedItems);
  };



  const handleDeleteItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      for (const item of items) {
        const formData = new FormData();
        Object.entries(item).forEach(([key, value]) => {
          if (value instanceof File || typeof value === "string") {
            formData.append(key, value);
          }
        });

        await fetchWithAuth("/items", {
          method: "POST",
          body: formData,
        });
      }
      // navigate("/admin-dashboard/items?success=created");
    } catch (error) {
      console.error("Error submitting item:", error);
      alert("Terjadi kesalahan");
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
</div>

          <h2 className="text-xl font-semibold mb-4">Create New Item</h2>

          <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
            {items.map((item, index) => (
              <div key={index} className="border p-4 rounded-lg shadow bg-gray-50 relative">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                )}

                <div className="mb-4">
                  <label className="block font-semibold">Item Name</label>
                  <input
                    type="text"
                    name="name"
                    value={item.name}
                    onChange={(e) => handleChange(index, e)}
                    className="border p-2 rounded-lg w-full"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold">Category</label>
                    <select
                      name="categoryId"
                      value={item.categoryId}
                      onChange={(e) => handleChange(index, e)}
                      className="border p-2 rounded-lg w-full"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold">Area</label>
                    <select
                      name="areaId"
                      value={item.areaId}
                      onChange={(e) => handleChange(index, e)}
                      className="border p-2 rounded-lg w-full"
                      required
                    >
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
                      onChange={(e) => handleChange(index, e)}
                      className="border p-2 rounded-lg w-full"
                    />
                  </div>
                  <div>
                  <label className="block font-semibold">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={item.price}
                    onChange={(e) => handleChange(index, e)}
                    className="border p-2 rounded-lg w-full"
                    required
                  />
                </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block font-semibold">Photo</label>
                    <input type="file" name="photo" accept="image/*" onChange={(e) => handleChange(index, e)} className="border p-2 rounded-lg w-full" />
                  </div>
                  <div>
                    <label className="block font-semibold">Receipt</label>
                    <input type="file" name="receipt" accept="image/*" onChange={(e) => handleChange(index, e)} className="border p-2 rounded-lg w-full" />
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-end space-x-4">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600">
                <FaSave /> <span>Save Item</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
