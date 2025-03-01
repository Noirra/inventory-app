import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { FaArrowLeft, FaSave, } from "react-icons/fa";
import Sidebar from "@/components/ui/sidebar";
import { useNavigate, useParams } from "react-router-dom";

export default function EditCategory() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  const [category, setCategory] = useState({
    name: "",
    code: "",
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/categories/${categoryId}`); // Ganti dengan URL API backend Laravel
        const data = await response.json();

        setCategory({
          code: data.data.code,
          name: data.data.name
        })
      } catch (error) {
        console.error("Failed to fetch category:", error);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    

    try {
      await fetch(`${import.meta.env.VITE_BASE_URL}/categories/${categoryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
      });
  
      navigate("/category");
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar /> 

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow border p-6">
          <button onClick={() => navigate("/category")} className="mb-4 flex items-center text-blue-500 hover:underline">
            <FaArrowLeft className="mr-2" /> Back
          </button>
          <h2 className="text-xl font-semibold mb-4">Edit Category</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <input type="text" name="name" value={category.name} placeholder="Category Name" onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <input type="text" name="code" value={category.code} placeholder="Category Code" onChange={handleChange} className="border p-2 rounded-lg w-full" required />

            <div className="col-span-1 flex justify-end">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600">
                <FaSave /> <span>Update Category</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
