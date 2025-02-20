import { useState } from "react";
import { FaBars, FaSignOutAlt, FaPlus, FaEdit, FaTrash, FaChartBar, FaUsers, FaBox, FaThLarge, FaMapMarkedAlt, FaCog } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export default function AdminCategory() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([
    { id: "1", name: "Electronics", code: "CAT-001" },
    { id: "2", name: "Furniture", code: "CAT-002" },
  ]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const deleteCategory = (id:string) => {
    setCategories(categories.filter((category) => category.id !== id));
  };

  const menuItems = [
    { name: "Dashboard", icon: <FaChartBar />, path: "/admindashboard" },
    { name: "Users", icon: <FaUsers />, path: "/users" },
    { name: "Inventory", icon: <FaBox />, path: "/item" },
    { name: "Category", icon: <FaThLarge />, path: "/category" },
    { name: "Area", icon: <FaMapMarkedAlt />, path: "/area" },
    { name: "Settings", icon: <FaCog />, path: "/settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"} bg-[#0A2342] text-white flex flex-col`}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/20">
          {sidebarOpen && <h2 className="text-lg font-semibold">Admin Panel</h2>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white text-lg">
            <FaBars />
          </button>
        </div>

        <nav className="flex-1 py-4 space-y-2">
          {menuItems.map((item, index) => (
            <Link key={index} to={item.path} className="flex items-center px-4 py-2 hover:bg-[#173E67] rounded-lg space-x-4">
              {item.icon}
              {sidebarOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4">
          <button onClick={handleLogout} className="w-full flex items-center justify-center py-2 rounded-2xl bg-red-500 hover:bg-red-600 text-white space-x-2">
            <FaSignOutAlt />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

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
                <th className="p-3 border">ID</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Code</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border">
                  <td className="p-3 border text-center">{category.id}</td>
                  <td className="p-3 border">{category.name}</td>
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
    </div>
  );
}
