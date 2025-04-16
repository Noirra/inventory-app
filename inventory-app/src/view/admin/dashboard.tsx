// Import tetap
import { useEffect, useState } from "react";
import Sidebar from "@/components/ui/sidebar";
import {
  FaSearch,
  FaBox,
  FaBoxOpen,
  FaThLarge,
  FaUsers,
} from "react-icons/fa";
import fetchWithAuth from "@/utils/fetchInterceptor";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Tipe data Product ditambahkan properti lain
type Product = {
  id: string;
  name: string;
  price: number;
  status: "USED" | "UNUSED";
  photo?: string;
  code: string;
  receipt?: string;
  examinationPeriodDate: string;
  examinationPeriodMonth: number;
};

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [userCount, setUserCount] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [itemrequestCount, setItemRequestCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [items, setItems] = useState<Product[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [userData, itemData, itemrequestData, categoryData] =
          await Promise.all([
            fetchWithAuth("/users"),
            fetchWithAuth("/items"),
            fetchWithAuth("/item-request"),
            fetchWithAuth("/categories"),
          ]);

        if (userData.success && Array.isArray(userData.users)) {
          setUserCount(userData.users.length);
        }

        if (itemData.success && Array.isArray(itemData.data)) {
          setItemCount(itemData.data.length);
          setItems(itemData.data);
        }

        if (itemrequestData.success && Array.isArray(itemrequestData.data)) {
          setItemRequestCount(itemrequestData.data.length);
        }

        if (categoryData.success && Array.isArray(categoryData.data)) {
          setCategoryCount(categoryData.data.length);
        }

        setLoadingItems(false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchCounts();
  }, []);

  const filteredProducts = items
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) => {
      if (statusFilter === "all") return true;
      if (statusFilter === "used") return product.status === "USED";
      if (statusFilter === "unused") return product.status === "UNUSED";
      return true;
    });

  const summaryCards = [
    {
      title: "Total Users",
      value: userCount,
      icon: <FaUsers className="text-green-500" />,
      borderColor: "border-green-500",
    },
    {
      title: "Items",
      value: itemCount,
      icon: <FaBox className="text-blue-500" />,
      borderColor: "border-blue-500",
    },
    {
      title: "Item Request",
      value: itemrequestCount,
      icon: <FaBoxOpen className="text-purple-500" />,
      borderColor: "border-purple-500",
    },
    {
      title: "Category",
      value: categoryCount,
      icon: <FaThLarge className="text-red-500" />,
      borderColor: "border-red-500",
    },
  ];

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="bg-gray-100 text-gray-800 flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Admin Inventory</h1>
            <p className="text-sm text-gray-600">
              Welcome Admin! Manage your data effectively.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center border rounded-full px-4 py-2 shadow-sm bg-white">
              <FaSearch className="text-gray-400" />
              <input
                type="text"
                placeholder="Search product..."
                className="ml-2 outline-none bg-transparent w-32 focus:w-48 transition-all text-sm text-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {summaryCards.map((card, index) => (
            <div
              key={index}
              className={`bg-white p-4 rounded-2xl shadow hover:shadow-xl transition transform hover:-translate-y-1 border-t-4 ${card.borderColor}`}
            >
              <div className="flex items-center space-x-4 mb-2">
                {card.icon}
                <p className="text-sm text-gray-600">{card.title}</p>
              </div>
              <p className="text-3xl font-bold">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow mb-6">
          <h2 className="text-lg font-semibold">All Products</h2>
          <div className="flex items-center space-x-2">
            <label htmlFor="statusFilter" className="text-sm font-medium">
              Filter:
            </label>
            <select
              id="statusFilter"
              className="border rounded px-3 py-1 text-sm bg-gray-200 text-gray-800"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="used">Used</option>
              <option value="unused">Unused</option>
            </select>
          </div>
        </div>

        {/* Product Slider */}
        {loadingItems ? (
          <p className="text-gray-500 text-center py-10">Loading products...</p>
        ) : filteredProducts.length > 0 ? (
          <Slider {...sliderSettings}>
            {filteredProducts.map((product, index) => (
              <div key={index} className="p-4">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={`https://inventory.bariqfirjatullah.my.id/${product.photo}`}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <span
                      className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full shadow ${
                        product.status === "USED"
                          ? "bg-red-200 text-red-800"
                          : "bg-green-200 text-green-800"
                      }`}
                    >
                      {product.status}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-1 truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Price:{" "}
                      <span className="font-bold text-gray-800">
                        Rp {product.price.toLocaleString("id-ID")}
                      </span>
                    </p>
                    <button
                      className="w-full py-2 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsModalOpen(true);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        ) : (
          <p className="text-gray-500 text-center py-10">No products found.</p>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedProduct && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
    <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg p-6">

      {/* Gambar utama produk */}
      <img
        src={`https://inventory.bariqfirjatullah.my.id/${selectedProduct.photo}`}
        alt={selectedProduct.name}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />

      {/* Nama produk */}
      <h2 className="text-xl font-bold mb-2">{selectedProduct.name}</h2>

      {/* Detail harga */}
      <p className="text-sm text-gray-700 mb-1">
        <strong>Price:</strong> Rp{" "}
        {selectedProduct.price.toLocaleString("id-ID")}
      </p>

      {/* Status */}
      <p className="text-sm text-gray-700 mb-1">
        <strong>Status:</strong> {selectedProduct.status}
      </p>

      {/* Examination Period Month */}
      <p className="text-sm text-gray-700 mb-1">
        <strong>Examination Month:</strong>{" "}
        {selectedProduct.examinationPeriodMonth}
      </p>

      {/* Examination Period Date */}
      <p className="text-sm text-gray-700 mb-4">
        <strong>Examination Date:</strong>{" "}
        {new Date(selectedProduct.examinationPeriodDate).toLocaleDateString(
          "id-ID"
        )}
      </p>

      {/* Gambar bukti (receipt) */}
      <img
        src={`https://inventory.bariqfirjatullah.my.id/${selectedProduct.receipt}`}
        alt="Receipt"
        className="w-full h-40 object-contain bg-gray-100 rounded-lg"
      />

      {/* Tombol Close di bagian bawah */}
      <button
        className="mt-6 w-full py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        onClick={() => setIsModalOpen(false)}
      >
        Close
      </button>
    </div>
  </div>
)}
    </div>
  );
}
