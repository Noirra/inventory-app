import { useState, useEffect } from "react";
import {
  FaBars,
  FaChartBar,
  FaUsers,
  FaBox,
  FaThLarge,
  FaMapMarkedAlt,
  FaBoxOpen,
  FaTags,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import LogoutButton from "@/components/ui/logoutbutton";

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminInfo, setAdminInfo] = useState<string | null>(null);

  const menuItems = [
    { name: "Dashboard", icon: <FaChartBar />, path: "/admin-dashboard" },
    { name: "Users", icon: <FaUsers />, path: "/admin-dashboard/users" },
    { name: "Inventory", icon: <FaBox />, path: "/admin-dashboard/items" },
    {
      name: "Group Code",
      icon: <FaTags />,
      path: "/admin-dashboard/groupcode",
    },
    {
      name: "Category",
      icon: <FaThLarge />,
      path: "/admin-dashboard/category",
    },
    { name: "Area", icon: <FaMapMarkedAlt />, path: "/admin-dashboard/area" },
    {
      name: "Item Request",
      icon: <FaBoxOpen />,
      path: "/admin-dashboard/item-request",
    },
  ];

  useEffect(() => {
    // Fetch admin username/role from localStorage (or context)
    const admin = JSON.parse(localStorage.getItem("admin") || "{}");
    setAdminInfo(admin?.name || "Admin");
  }, []);

  return (
    <div
      className={`transition-all duration-300 ${
        sidebarOpen ? "w-64" : "w-20"
      } bg-[#0A2342] text-white flex flex-col`}
    >
      <div
        className={`flex items-center py-4 border-b border-white/20 ${
          sidebarOpen ? "justify-between px-4" : "justify-center"
        }`}
      >
        {sidebarOpen && <h2 className="text-lg font-semibold">Admin Panel</h2>}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white text-lg"
        >
          <FaBars />
        </button>
      </div>

      {/* Menampilkan nama admin di bawah menu */}
      {adminInfo && sidebarOpen && (
        <div className="px-4 py-2 text-left text-gray-300 mt-auto">
          {sidebarOpen ? (
            <span>Welcome, {adminInfo}</span>
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
            className={`flex items-center px-4 py-2 hover:bg-[#173E67] rounded-lg space-x-4 ${
              sidebarOpen ? "justify-start" : "justify-center"
            }`}
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
