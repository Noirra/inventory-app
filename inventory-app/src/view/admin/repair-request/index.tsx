import { useState } from "react";
import Sidebar from "@/components/ui/sidebar";
import { FaPlus, FaEdit } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export default function RepairRequest() {
  const navigate = useNavigate();
  const [repairs] = useState([
    {
      id: "1",
      itemId: "ITM-001",
      repairReason: "Battery replacement",
      estimatedPrice: "$150",
      status: "PENDING",
      code: "REP-001",
      timestampStatus: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
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
        <h1 className="text-2xl font-semibold mb-6">Repair Request Management</h1>
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h2 className="text-lg font-semibold mb-4">Repair Request List</h2>
          <div className="flex justify-between mb-4">
            <input type="text" placeholder="Search" className="border p-2 rounded-lg w-64 shadow-sm" />
            <button
              onClick={() => navigate("/repair-request/create")}
              className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600"
            >
              <FaPlus /> <span>Add Repair Request</span>
            </button>
          </div>
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border">Code</th>
                <th className="p-3 border">Item ID</th>
                <th className="p-3 border">Repair Reason</th>
                <th className="p-3 border">Estimated Price</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {repairs.map((repair) => (
                <tr key={repair.id} className="border">
                  <td className="p-3 border text-center">{repair.code}</td>
                  <td className="p-3 border text-center">{repair.itemId}</td>
                  <td className="p-3 border text-center">{repair.repairReason}</td>
                  <td className="p-3 border text-center">{repair.estimatedPrice}</td>
                  <td className="p-3 border text-center">{repair.status}</td>
                  <td className="p-3 border text-center space-x-2">
                    <Link to={`/repair-request/edit/${repair.id}`} title="Edit Repair Request">
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
