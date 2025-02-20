import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { FaArrowLeft, FaSave, FaSignOutAlt, FaChartBar, FaUsers, FaBox, FaThLarge, FaMapMarkedAlt, FaCog } from "react-icons/fa";
import { useNavigate, useParams, Link } from "react-router-dom";

export default function EditCategory() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  const [category, setCategory] = useState({
    name: "",
    code: "",
  });

  useEffect(() => {
    // Simulasi fetch data kategori berdasarkan categoryId
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/categories/${categoryId}`); // Ganti dengan URL API backend Laravel
        const data = await response.json();

        setCategory({
          name: data.name || "",
          code: data.code || "",
        });
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
      await fetch(`/api/categories/${categoryId}`, {
        method: "PUT", // Gunakan PUT untuk update
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
      });

      console.log("Category updated successfully.");
      navigate("/categories");
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-[#0A2342] text-white flex flex-col p-4">
        <h2 className="text-lg font-semibold">Admin Panel</h2>
        <nav className="flex-1 py-4 space-y-2">
          <Link to="/admindashboard" className="flex items-center px-4 py-2 hover:bg-[#173E67] rounded-lg space-x-4"><FaChartBar /><span>Dashboard</span></Link>
          <Link to="/users" className="flex items-center px-4 py-2 hover:bg-[#173E67] rounded-lg space-x-4"><FaUsers /><span>Users</span></Link>
          <Link to="/categories" className="flex items-center px-4 py-2 hover:bg-[#173E67] rounded-lg space-x-4"><FaThLarge /><span>Categories</span></Link>
          <Link to="/settings" className="flex items-center px-4 py-2 hover:bg-[#173E67] rounded-lg space-x-4"><FaCog /><span>Settings</span></Link>
        </nav>
        <button onClick={() => navigate("/login")} className="w-full flex items-center justify-center py-2 rounded-2xl bg-red-500 hover:bg-red-600 space-x-2">
          <FaSignOutAlt /><span>Logout</span>
        </button>
      </div>

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
