import { useState, useEffect } from "react";
import Sidebar from "@/components/ui/sidebar";
import {
  FaPlus,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

interface Categories {
  id: string
  code: string
  name: string
}

export default function AdminCategory() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Categories[]>([]);

  const fetchData = async () => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/categories`);
    const responseToJson = await response.json();
    const categoriesData = responseToJson.data
    setCategories(categoriesData)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const deleteCategory = async (id: string) => {
    await fetch(`${import.meta.env.VITE_BASE_URL}/categories/${id}`, { method: "DELETE" })
    fetchData();
  };


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar handleLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-6">Category Management</h1>
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h2 className="text-lg font-semibold mb-4">Category List</h2>
          <div className="flex justify-between mb-4">
            <input type="text" placeholder="Search" className="border p-2 rounded-lg w-64 shadow-sm" />
            <button
              onClick={() => navigate("/category/create")}
              className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600"
            >
              <FaPlus /> <span>Add Category</span>
            </button>
          </div>
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border">No</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Code</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border">
                  <td className="p-3 border text-center">1</td>
                  <td className="p-3 border text-center">{category.name}</td>
                  <td className="p-3 border text-center">{category.code}</td>
                  <td className="p-3 border text-center space-x-2">
                    <Link to={`/category/edit/${category.id}`} title="Edit Category">
                      <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                        <FaEdit />
                      </button>
                    </Link>
                    <button onClick={() => deleteCategory(category.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div >
  );
}
