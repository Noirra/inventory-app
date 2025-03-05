import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "@/components/sidebar/employee";
import {
  FaSearch,
  FaBox,
  FaShoppingCart,
  FaExclamationCircle,
  FaUsers,
  FaMoon,
  FaSun,
} from "react-icons/fa";

const initialProducts = [
  { name: "Product A", stock: 120, price: 25.0 },
  { name: "Product B", stock: 80, price: 40.0 },
  { name: "Product C", stock: 0, price: 15.0 },
  { name: "Product D", stock: 60, price: 30.0 },
  { name: "Product E", stock: 200, price: 20.0 },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("all"); // all, in-stock, out-of-stock
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Filter dan pencarian
  const filteredProducts = initialProducts
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) => {
      if (stockFilter === "all") return true;
      if (stockFilter === "in-stock") return product.stock > 0;
      if (stockFilter === "out-of-stock") return product.stock <= 0;
      return true;
    });

  const summaryCards = [
    {
      title: "Total Users",
      value: 120,
      icon: <FaUsers className="text-green-500" />,
      borderColor: "border-green-400",
    },
    {
      title: "Total Products",
      value: 5483,
      icon: <FaBox className="text-blue-500" />,
      borderColor: "border-blue-400",
    },
    {
      title: "Orders",
      value: 2859,
      icon: <FaShoppingCart className="text-purple-500" />,
      borderColor: "border-purple-400",
    },
    {
      title: "Out of Stock",
      value: 38,
      icon: <FaExclamationCircle className="text-red-500" />,
      borderColor: "border-red-400",
    },
  ];

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} flex h-screen transition-colors duration-300`}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Admin Inventory</h1>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Welcome Admin! Manage your data effectively.
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Toggle Dark Mode */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-white dark:bg-gray-800 shadow"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon />}
            </button>

            {/* Search Box */}
            <div className="flex items-center border rounded-full px-4 py-2 shadow-sm bg-white dark:bg-gray-800">
              <FaSearch className="text-gray-500" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search product..."
                className="ml-2 outline-none bg-transparent w-32 focus:w-48 transition-all text-sm dark:text-gray-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search products"
              />
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {summaryCards.map((card, index) => (
            <div
              key={index}
              className={`bg-white dark:bg-gray-800 p-4 rounded-2xl shadow hover:shadow-xl transition transform hover:-translate-y-1 border-t-4 ${card.borderColor}`}
            >
              <div className="flex items-center space-x-4 mb-2">
                {card.icon}
                <p className="text-sm text-gray-500 dark:text-gray-300">{card.title}</p>
              </div>
              <p className="text-3xl font-bold">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Contoh Chart / Visualisasi (Placeholder) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow hover:shadow-xl transition transform hover:-translate-y-1 border-t-4 border-indigo-400">
            <h2 className="text-lg font-semibold mb-2">Sales Overview</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Placeholder for chart or sales data visualization
            </p>
            {/* Di sini Anda bisa menambahkan komponen chart dari library seperti Recharts / Chart.js */}
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow hover:shadow-xl transition transform hover:-translate-y-1 border-t-4 border-indigo-400">
            <h2 className="text-lg font-semibold mb-2">Revenue Overview</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Placeholder for chart or revenue data visualization
            </p>
            {/* Tambahkan chart lain sesuai kebutuhan */}
          </div>
        </div>

        {/* Filter Section */}
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-2xl shadow mb-6">
          <h2 className="text-lg font-semibold">All Products</h2>
          <div className="flex items-center space-x-2">
            <label htmlFor="stockFilter" className="text-sm font-medium">
              Filter:
            </label>
            <select
              id="stockFilter"
              className="border rounded px-3 py-1 text-sm bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="in-stock">In Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <div
              key={index}
              className="p-5 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-700 relative overflow-hidden"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  {product.name}
                </h3>
                <span
                  className={`px-3 py-1 text-xs rounded-full font-semibold shadow ${
                    product.stock > 0
                      ? "bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100"
                      : "bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100"
                  }`}
                >
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-200 mb-1">
                Stock: {product.stock}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-200 mb-2">
                Price: ${product.price.toFixed(2)}
              </p>
              <div className="absolute -top-4 -right-4 text-gray-200 dark:text-gray-700 opacity-10 text-7xl pointer-events-none">
                <FaBox />
              </div>
              <button className="mt-4 w-full py-2 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
