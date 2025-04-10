import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/sidebar/owner";
import { FaSearch, FaBox, FaShoppingCart, FaExclamationCircle, FaUsers } from "react-icons/fa";

const products = [
  { name: "Product A", stock: 120, price: 25.0 },
  { name: "Product B", stock: 80, price: 40.0 },
  { name: "Product C", stock: 0, price: 15.0 },
  { name: "Product D", stock: 60, price: 30.0 },
  { name: "Product E", stock: 200, price: 20.0 },
];

export default function OwnerDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar  />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Welcome Admin!</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center border rounded-full px-4 py-2 shadow-sm bg-white">
              <FaSearch className="text-gray-500" />
              <input
                type="text"
                placeholder="Search"
                className="ml-2 outline-none bg-transparent w-32 focus:w-48 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { title: "Total Users", value: 120, icon: <FaUsers className="text-green-500" /> },
            { title: "Total Products", value: 5483, icon: <FaBox className="text-blue-500" /> },
            { title: "Orders", value: 2859, icon: <FaShoppingCart className="text-purple-500" /> },
            { title: "Out of Stock", value: 38, icon: <FaExclamationCircle className="text-red-500" /> },
          ].map((card, index) => (
            <div key={index} className="bg-white p-4 rounded-2xl shadow hover:shadow-xl transition transform hover:-translate-y-1 border-t-4 border-green-400">
              <div className="flex items-center space-x-4 mb-2">
                {card.icon}
                <p className="text-sm text-gray-500">{card.title}</p>
              </div>
              <p className="text-3xl font-bold">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow border">
          <h2 className="text-lg font-semibold mb-4">All Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <div key={index} className="p-5 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 bg-gradient-to-br from-white to-gray-100 relative overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
                  <span className={`px-3 py-1 text-xs rounded-full font-semibold shadow ${product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">Stock: {product.stock}</p>
                <p className="text-sm text-gray-600 mb-2">Price: ${product.price.toFixed(2)}</p>
                <div className="absolute -top-4 -right-4 text-gray-200 opacity-10 text-7xl pointer-events-none">
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
    </div>
  );
}
