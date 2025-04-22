import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar/owner";
import { FaInfoCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
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
}

export default function OwnerItem() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showModal, setShowModal] = useState(false);
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

  const fetchData = async () => {
    setLoading(true);
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
    fetchData();
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
        navigate("/owner-dashboard/items", { replace: true });
      }
    }
  }, []);



  const filteredItems = items.filter((item) =>
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
          <div className="flex justify-between mb-4">
            <input
              type="text"
              placeholder="Search item..."
              className="border p-2 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
                    <td className="p-3 border text-center">{item.name}</td>
                    <td className="p-3 border text-center">
                      Rp {item.price.toLocaleString("id-ID")}
                    </td>
                    <td className="p-3 border text-center">{item.status}</td>
                    <td className="p-3 border text-center space-x-2">
                      <button
                        onClick={() => handleDetail(item)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        <FaInfoCircle />
                      </button>
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

      {/* Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Item Detail</h2>
            <div className="space-y-2">
              <p><strong>Name:</strong> {selectedItem.name}</p>
              <p><strong>Code:</strong> {selectedItem.code}</p>
              <p><strong>Price:</strong> Rp {selectedItem.price.toLocaleString("id-ID")}</p>
              <p><strong>Status:</strong> {selectedItem.status}</p>
              <p><strong>Examination Period:</strong> {new Date(selectedItem.examinationPeriodDate).toLocaleDateString("id-ID")}</p>
              <p><strong>Examination Month:</strong> {selectedItem.examinationPeriodMonth}</p>
              <p>
                <strong>Category:</strong>{" "}
                {(() => {
                  const index = categories.findIndex((cat) => cat.id === selectedItem.categoryId);
                  return index !== -1 ? `${index + 1}` : "Unknown";
                })()}
              </p>
              <p>
                <strong>Area:</strong>{" "}
                {(() => {
                  const index = areas.findIndex((area) => area.id === selectedItem.areaId)
                  return index !== -1 ? `${index + 1}` : "Unknown";
                })()}
              </p>
              <p><strong>Receipt:</strong>
                <img
                  src={`https://inventory.bariqfirjatullah.my.id/${selectedItem.photo}`}
                  alt="Item Photo"
                  className="w-20 h-20 mt-2"
                />
              </p>
              <p><strong>Photo:</strong>
                <img
                  src={`https://inventory.bariqfirjatullah.my.id/${selectedItem.receipt}`}
                  alt="Item Photo"
                  className="w-20 h-20 mt-2"
                />
              </p>
            </div>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
