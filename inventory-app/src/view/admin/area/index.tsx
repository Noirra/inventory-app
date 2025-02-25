import { useState } from "react";
import Sidebar from "@/components/ui/sidebar";
import {
  FaPlus,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export default function AdminArea() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([
    { id: "1", name: "Malang", code: "CAT-001" },
    { id: "2", name: "Jakarta", code: "CAT-002" },
  ]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const deleteArea = (id:string) => {
    setCategories(categories.filter((area) => area.id !== id));
  };


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar handleLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-6">Area Management</h1>
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h2 className="text-lg font-semibold mb-4">Area List</h2>
          <div className="flex justify-between mb-4">
            <input type="text" placeholder="Search" className="border p-2 rounded-lg w-64 shadow-sm" />
            <button
              onClick={() => navigate("/area/create")}
              className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600"
            >
              <FaPlus /> <span>Add Area</span>
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
              {categories.map((area) => (
                <tr key={area.id} className="border">
                  <td className="p-3 border text-center">{area.id}</td>
                  <td className="p-3 border text-center">{area.name}</td>
                  <td className="p-3 border text-center">{area.code}</td>
                  <td className="p-3 border text-center space-x-2">
                    <Link to={`/area/edit/${area.id}`} title="Edit Area">
                      <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                        <FaEdit />
                      </button>
                    </Link>
                    <button onClick={() => deleteArea(area.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
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
