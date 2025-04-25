import { useState, useEffect } from "react";
import Sidebar from "@/components/ui/sidebar";
import { FaPlus, FaEdit, FaInfoCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "@/components/ui/pagination";
import Notification from "@/components/ui/notification";
import fetchWithAuth from "@/utils/fetchInterceptor";

interface Item {
  id: string;
  categoryId: string;
  areaId: string;
  name: string;
  price: number;
  photo: string;
  receipt: string;
  status: string;
  code: string;
  examinationPeriodDate: string;
  examinationPeriodMonth: number;
  groupCode: string;
}

export default function AdminItem() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [areas, setAreas] = useState<{ id: string; name: string }[]>([]);

  const fetchCategories = async () => {
    try {
      const response = await fetchWithAuth("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchAreas = async () => {
    try {
      const response = await fetchWithAuth("/areas");
      setAreas(response.data);
    } catch (error) {
      console.error("Error fetching areas:", error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await fetchWithAuth("/items");
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchItems();
    fetchCategories();
    fetchAreas();

    const params = new URLSearchParams(window.location.search);
    const successMessage = params.get("success");
    if (successMessage) {
      const message =
        successMessage === "created"
          ? "Item added successfully!"
          : successMessage === "updated"
          ? "Item updated successfully!"
          : "";

      if (message) {
        setMessage(message);
        setTimeout(() => setMessage(""), 3000);
        navigate("/admin-dashboard/items", { replace: true });
      }
    }
  }, []);

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handleDetail = (item: Item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-6">Item Management</h1>
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h2 className="text-lg font-semibold mb-4">Item List</h2>
          <Notification message={message} onClose={() => setMessage("")} />

          <div className="flex justify-between flex-wrap gap-4 mb-4">
            <input
              type="text"
              placeholder="Search item..."
              className="border p-2 rounded-lg w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <button
              onClick={() => navigate("/admin-dashboard/items/create")}
              className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600"
            >
              <FaPlus /> <span>Add Item</span>
            </button>
          </div>

          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border">No</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Price</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-3 text-center text-gray-500">
                    Loading data...
                  </td>
                </tr>
              ) : displayedItems.length > 0 ? (
                displayedItems.map((item, index) => (
                  <tr key={item.id} className="border">
                    <td className="p-3 border text-center">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="p-3 border text-center">
                      <span
                        className="text-blue-600 cursor-pointer hover:underline"
                        onClick={() =>
                          navigate(`/admin-dashboard/items/komponen/${item.id}`)
                        }
                      >
                        {item.name}
                      </span>
                    </td>
                    <td className="p-3 border text-center">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(item.price)}
                    </td>
                    <td className="p-3 border text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.status === "UNUSED"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 border text-center space-x-2">
                      <button
                        onClick={() => handleDetail(item)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        <FaInfoCircle />
                      </button>
                      <Link to={`/admin-dashboard/items/edit/${item.id}`}>
                        <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                          <FaEdit />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-3 text-center text-gray-500">
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            changePage={setCurrentPage}
          />
        </div>
      </div>

      {showModal && selectedItem && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Item Detail</h2>
        <button
          onClick={() => setShowModal(false)}
          className="text-gray-500 hover:text-red-500 text-xl"
        >
          &times;
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
        <div className="space-y-2">
          <div><strong>Name:</strong> {selectedItem.name}</div>
          <div><strong>Category:</strong> {
            (() => {
              const index = categories.findIndex((cat) => cat.id === selectedItem.categoryId);
              return index !== -1 ? `${index + 1}` : "Unknown";
            })()}
          </div>
          <div><strong>Area:</strong> {
            (() => {
              const index = areas.findIndex((area) => area.id === selectedItem.areaId);
              return index !== -1 ? `${index + 1}` : "Unknown";
            })()}
          </div>
          <div><strong>Examination Period:</strong> {new Date(selectedItem.examinationPeriodDate).toLocaleDateString("id-ID")}</div>
          <div>
            <strong>Receipt:</strong>
            <img
              src={`https://inventory.bariqfirjatullah.my.id/${selectedItem.receipt}`}
              alt="Item Receipt"
              className="w-24 h-24 object-cover mt-2 rounded"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div><strong>Code:</strong> {selectedItem.code}</div>
          <div><strong>Price:</strong> Rp {selectedItem.price.toLocaleString("id-ID")}</div>
          <div><strong>Status:</strong> {selectedItem.status}</div>
          <div><strong>Examination Month:</strong> {selectedItem.examinationPeriodMonth}</div>
          <div>
            <strong>Photo:</strong>
            <img
              src={`https://inventory.bariqfirjatullah.my.id/${selectedItem.photo}`}
              alt="Item Photo"
              className="w-24 h-24 object-cover mt-2 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
