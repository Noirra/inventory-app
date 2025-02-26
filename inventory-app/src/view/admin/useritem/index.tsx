import { useState, useCallback } from "react";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/ui/sidebar";

export default function AdminUserItem() {
  const navigate = useNavigate();
  const [userItems, setUserItems] = useState([
    {
      id: "1",
      userId: "USER001",
      items: [{ name: "Laptop Dell XPS", code: "ITM-001" }],
      createdAt: "2024-01-01",
    },
    {
      id: "2",
      userId: "USER002",
      items: [{ name: "Office Chair", code: "ITM-002" }],
      createdAt: "2024-02-01",
    },
  ]);

  const handleLogout = useCallback(() => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  const deleteUserItem = (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setUserItems(userItems.filter((userItem) => userItem.id !== id));
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar handleLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-6">User Items Management</h1>
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h2 className="text-lg font-semibold mb-4">User Item List</h2>
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border text-left">ID</th>
                <th className="p-3 border text-left">User ID</th>
                <th className="p-3 border text-left">Items</th>
                <th className="p-3 border text-left">Created At</th>
                <th className="p-3 border text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userItems.map((userItem) => (
                <tr key={userItem.id} className="border">
                  <td className="p-3 border">{userItem.id}</td>
                  <td className="p-3 border">{userItem.userId}</td>
                  <td className="p-3 border">
                    {userItem.items.map((item, index) => (
                      <span key={index} className="block">{item.name} ({item.code})</span>
                    ))}
                  </td>
                  <td className="p-3 border">{userItem.createdAt}</td>
                  <td className="p-3 border">
                    <button onClick={() => deleteUserItem(userItem.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
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
