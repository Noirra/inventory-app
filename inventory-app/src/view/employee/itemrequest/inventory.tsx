import { useState } from "react";
import {
  FaBars,
  FaSignOutAlt,
  FaSearch,
  FaChartBar,
  FaCog,
  FaEdit,
  FaPlus,
  FaBox,
} from "react-icons/fa";

interface ItemRequest {
  id: string;
  userId: string;
  name: string;
  desc: string;
  priceRange: string;
  referenceLink: string;
  code: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
}

const initialRequests: ItemRequest[] = [
  {
    id: "1",
    userId: "user1",
    name: "Laptop Dell XPS",
    desc: "High-performance laptop for development",
    priceRange: "$1000 - $1500",
    referenceLink: "https://example.com/laptop",
    code: "ITM-001",
    status: "PENDING",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    userId: "user2",
    name: "Office Chair",
    desc: "Ergonomic chair with lumbar support",
    priceRange: "$150 - $300",
    referenceLink: "https://example.com/chair",
    code: "ITM-002",
    status: "APPROVED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function Inventory() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [requests, setRequests] = useState<ItemRequest[]>(initialRequests);
  const [newRequest, setNewRequest] = useState<Omit<ItemRequest, "id" | "createdAt" | "updatedAt" | "status">>({
    userId: "",
    name: "",
    desc: "",
    priceRange: "",
    referenceLink: "",
    code: "",
  });

  const handleCreate = () => {
    const newId = (requests.length + 1).toString();
    const newItem: ItemRequest = {
      ...newRequest,
      id: newId,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setRequests([...requests, newItem]);
    setNewRequest({ userId: "", name: "", desc: "", priceRange: "", referenceLink: "", code: "" });
  };

  const handleEdit = (id: string) => {
    const itemToEdit = requests.find((req) => req.id === id);
    if (!itemToEdit) return;

    const updatedName = prompt("Enter new item name:", itemToEdit.name);
    if (updatedName && updatedName.trim()) {
      setRequests(
        requests.map((req) =>
          req.id === id ? { ...req, name: updatedName, updatedAt: new Date().toISOString() } : req
        )
      );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"} bg-[#0A2342] text-white flex flex-col`}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/20">
          {sidebarOpen && (
            <div className="flex items-center space-x-3">
              <img src="https://via.placeholder.com/40" alt="Profile" className="rounded-full w-10 h-10" />
              <div>
                <p className="font-semibold">User Name</p>
                <p className="text-sm text-gray-300">user@example.com</p>
              </div>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white text-lg">
            <FaBars />
          </button>
        </div>

        <nav className="flex-1 py-4 space-y-2">
          {[
            { name: "Dashboard", icon: <FaChartBar />, link: "/dashboard" },
            { name: "Inventory", icon: <FaBox />, link: "/inventory" },
            { name: "Settings", icon: <FaCog /> },
          ].map((item, index) => (
            <a key={index} href={item.link || "#"} className="flex items-center px-4 py-2 hover:bg-[#173E67] rounded-lg space-x-4">
              {item.icon}
              {sidebarOpen && <span>{item.name}</span>}
            </a>
          ))}
        </nav>

        <div className="p-4">
          <button className="w-full flex items-center justify-center py-2 rounded-2xl bg-red-500 hover:bg-red-600 text-white space-x-2">
            <FaSignOutAlt />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Item Request Management</h1>
          <div className="flex items-center border rounded-full px-4 py-2 shadow-sm bg-white">
            <FaSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              className="ml-2 outline-none bg-transparent w-32 focus:w-48 transition-all"
            />
          </div>
        </div>

        {/* Item Request Table */}
        <div className="bg-white p-6 rounded-2xl shadow border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Item Request List</h2>
            <button
              onClick={handleCreate}
              className="flex items-center px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 space-x-2"
            >
              <FaPlus />
              <span>Add Request</span>
            </button>
          </div>
          <table className="w-full table-auto border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Description</th>
                <th className="px-4 py-2 border">Price Range</th>
                <th className="px-4 py-2 border">Code</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{req.id}</td>
                  <td className="px-4 py-2 border">{req.name}</td>
                  <td className="px-4 py-2 border">{req.desc}</td>
                  <td className="px-4 py-2 border">{req.priceRange}</td>
                  <td className="px-4 py-2 border">{req.code}</td>
                  <td className="px-4 py-2 border">{req.status}</td>
                  <td className="px-4 py-2 border space-x-2">
                    <button
                      onClick={() => handleEdit(req.id)}
                      className="px-3 py-1 rounded bg-yellow-400 text-white hover:bg-yellow-500"
                    >
                      <FaEdit />
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
