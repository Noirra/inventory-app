import { useState, useEffect } from "react";
import { FaBars, FaChartBar, FaBoxOpen } from "react-icons/fa";
import { Link } from "react-router-dom";
import LogoutButton from "@/components/ui/logoutbutton";

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [employeeInfo, setEmployeeInfo] = useState<string | null>(null);

  const menuItems = [
    { name: "Dashboard", icon: <FaChartBar />, path: "/employee-dashboard" },
    { name: "Item Request", icon: <FaBoxOpen />, path: "/employee-dashboard/item-request" },
  ];

  useEffect(() => {
    const employee = JSON.parse(localStorage.getItem("employee") || "{}");
    setEmployeeInfo(employee?.name || "User");
  }, []);  

  return (
    <div className={`transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"} bg-[#0A2342] text-white flex flex-col`}>
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/20">
  {sidebarOpen && <h2 className="text-lg font-semibold">User Panel</h2>}
  <button
    onClick={() => setSidebarOpen(!sidebarOpen)}
    className={`text-white text-lg ${sidebarOpen ? "" : "mx-auto block"}`}
  >
    <FaBars />
  </button>
</div>

      {/* Menampilkan nama karyawan yang login */}
      {employeeInfo && sidebarOpen && (
        <div className="px-4 py-2 text-left text-gray-300 mt-auto">
          {sidebarOpen ? (
            <span>Welcome, {employeeInfo}</span>
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
