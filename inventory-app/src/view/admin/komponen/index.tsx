import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";import Sidebar from "@/components/ui/sidebar";
import {
  FaPlus,
  FaEdit,
} from "react-icons/fa";

export default function AdminItems() {
  const navigate = useNavigate();
  const [items] = useState([
    { id: "1", name: "Laptop", code: "ITEM-001", category: "Electronics" },
    { id: "2", name: "Office Chair", code: "ITEM-002", category: "Furniture" },
  ]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar handleLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-6">Item Management</h1>
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h2 className="text-lg font-semibold mb-4">Item List</h2>
          <div className="flex justify-between mb-4">
            <input type="text" placeholder="Search" className="border p-2 rounded-lg w-64 shadow-sm" />
            <button
              onClick={() => navigate("/item/create")}
              className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600"
            >
              <FaPlus /> <span>Add Item</span>
            </button>
          </div>
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border">ID</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Code</th>
                <th className="p-3 border">Category</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border">
                  <td className="p-3 border text-center">{item.id}</td>
                  <td className="p-3 border text-center">{item.name}</td>
                  <td className="p-3 border text-center">{item.code}</td>
                  <td className="p-3 border text-center">{item.category}</td>
                  <td className="p-3 border text-center space-x-2">
                    <Link to={`/item/edit/${item.id}`} title="Edit Item">
                      <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                        <FaEdit />
                      </button>
                    </Link>
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
