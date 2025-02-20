import { useState, ChangeEvent, FormEvent } from "react";
import { FaArrowLeft, FaSave, FaSignOutAlt, FaChartBar, FaUsers, FaBox, FaThLarge, FaMapMarkedAlt, FaCog } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";

export default function CreateCategory() {
  const navigate = useNavigate();
  const [category, setCategory] = useState({
    name: "",
    code: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Simulasi submit - di sini Anda bisa melakukan POST request ke backend menggunakan fetch atau axios
    console.log("Category Created:", category);

    navigate("/category");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-[#0A2342] text-white flex flex-col p-4">
        <h2 className="text-lg font-semibold">Admin Panel</h2>
        <nav className="flex-1 py-4 space-y-2">
          <Link to="/admindashboard" className="flex items-center px-4 py-2 hover:bg-[#173E67] rounded-lg space-x-4"><FaChartBar /><span>Dashboard</span></Link>
          <Link to="/users" className="flex items-center px-4 py-2 hover:bg-[#173E67] rounded-lg space-x-4"><FaUsers /><span>Users</span></Link>
          <Link to="/items" className="flex items-center px-4 py-2 hover:bg-[#173E67] rounded-lg space-x-4"><FaBox /><span>Inventory</span></Link>
          <Link to="/category" className="flex items-center px-4 py-2 hover:bg-[#173E67] rounded-lg space-x-4"><FaThLarge /><span>Category</span></Link>
          <Link to="/area" className="flex items-center px-4 py-2 hover:bg-[#173E67] rounded-lg space-x-4"><FaMapMarkedAlt /><span>Area</span></Link>
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
          <h2 className="text-xl font-semibold mb-4">Create New Category</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <input type="text" name="name" placeholder="Category Name" onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <input type="text" name="code" placeholder="Category Code" onChange={handleChange} className="border p-2 rounded-lg w-full" required />

            <div className="flex justify-end">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600">
                <FaSave /> <span>Save Category</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}