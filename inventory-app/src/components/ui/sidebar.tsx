import { useState } from "react";
import { FaBars, FaChartBar, FaUsers, FaBox, FaThLarge, FaMapMarkedAlt, FaBoxOpen, FaTools } from "react-icons/fa";
import { Link } from "react-router-dom";
import LogoutButton from "@/components/ui/logoutbutton";

export default function Sidebar() {  // ❌ Hapus handleLogout dari sini
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { name: "Dashboard", icon: <FaChartBar />, path: "/admindashboard" },
    { name: "Users", icon: <FaUsers />, path: "/users" },
    { name: "Inventory", icon: <FaBox />, path: "/item" },
    { name: "Category", icon: <FaThLarge />, path: "/category" },
    { name: "Area", icon: <FaMapMarkedAlt />, path: "/area" },
    { name: "Item Request", icon: <FaBoxOpen />, path: "/item-request" },
    { name: "Repair Request", icon: <FaTools />, path: "/repair-request" }, 
  ];

  return (
    <div className={`transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"} bg-[#0A2342] text-white flex flex-col`}>
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/20">
        {sidebarOpen && <h2 className="text-lg font-semibold">Admin Panel</h2>}
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white text-lg">
          <FaBars />
        </button>
      </div>

      <nav className="flex-1 py-4 space-y-2">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="flex items-center px-4 py-2 hover:bg-[#173E67] rounded-lg space-x-4"
          >
            {item.icon}
            {sidebarOpen && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>

      <LogoutButton />
    </div>
  );
}
