import { useState, useEffect } from "react";
import { FaBars, FaChartBar, FaUsers, FaBox, FaBoxOpen,FaTags, FaThLarge, FaMapMarkedAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import LogoutButton from "@/components/ui/logoutbutton";

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [ownerInfo, setOwnerInfo] = useState<string | null>(null);

  const menuItems = [
    { name: "Dashboard", icon: <FaChartBar />, path: "/owner-dashboard" },
    { name: "Users", icon: <FaUsers />, path: "/owner-dashboard/users" },
    { name: "Inventory", icon: <FaBox />, path: "/owner-dashboard/items" },
    { name: "Item Request", icon: <FaBoxOpen />, path: "/owner-dashboard/item-request" },
    { name: "Group Code", icon: <FaTags />, path: "/owner-dashboard/groupcode" },
    { name: "Category", icon: <FaThLarge />, path: "/owner-dashboard/category" },
    { name: "Area", icon: <FaMapMarkedAlt />, path: "/owner-dashboard/area" },

  ];

  useEffect(() => {
    // Mengambil info owner dari localStorage
    const owner = JSON.parse(localStorage.getItem("owner") || "{}");
    setOwnerInfo(owner?.name || "Owner");
  }, []);

  return (
    <div className={`transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"} bg-[#0A2342] text-white flex flex-col`}>
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/20">
        {sidebarOpen && <h2 className="text-lg font-semibold">Owner Panel</h2>}
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white text-lg">
          <FaBars />
        </button>
      </div>

      {/* Menampilkan nama owner di bawah menu */}
      {ownerInfo && sidebarOpen && (
        <div className="px-4 py-2 text-left text-gray-300 mt-auto">
          {sidebarOpen ? (
            <span>Welcome, {ownerInfo}</span>
          ) : (
            <span>Welcome</span>
          )}
        </div>
      )}

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

      <div className="p-4 w-full">
      <LogoutButton sidebarOpen={sidebarOpen} />
      </div>
    </div>
  );
}