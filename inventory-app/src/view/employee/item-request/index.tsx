import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar/employee";
import { FaPlus } from "react-icons/fa";
import Pagination from "@/components/ui/pagination";
import Notification from "@/components/ui/notification";
import { useNavigate } from "react-router-dom";
import fetchWithAuth from "@/utils/fetchInterceptor";


interface Item {
  id: string;
  userId: string;
  name: string;
  desc: string;
  priceRange: string;
  referenceLink: string;
  code: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function ItemRequestEmployee() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchQuery, setSearchQuery] = useState("");

  const handleCloseNotification = () => {
    setMessage("");
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth("/item-request");
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching item requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-6">Item Request Management</h1>
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h2 className="text-lg font-semibold mb-4">Item Request List</h2>
          <Notification message={message} onClose={handleCloseNotification} />
          <div className="flex justify-between mb-4">
            <input
              type="text"
              placeholder="Search item request..."
              className="border p-2 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <button
              onClick={() => navigate("/employee-dashboard/item-request/create")}
              className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600"
            >
              <FaPlus /> <span>Add Item Request</span>
            </button>
          </div>
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border">Code</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Description</th>
                <th className="p-3 border">Price Range</th>
                <th className="p-3 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-3 text-center text-gray-500">
                    Loading data...
                  </td>
                </tr>
              ) : displayedItems.length > 0 ? (
                displayedItems.map((item) => (
                  <tr key={item.id} className="border">
                    <td className="p-3 border text-center">{item.code}</td>
                    <td className="p-3 border text-center">
                      {item.name}
                    </td>
                    <td className="p-3 border text-center">{item.desc}</td>
                    <td className="p-3 border text-center">{item.priceRange}</td>
                    <td className="p-3 border text-center">{item.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-3 text-center text-gray-500">
                    No item requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="mt-4">
            <Pagination currentPage={currentPage} totalPages={totalPages} changePage={setCurrentPage} />
          </div>
        </div>
      </div>
    </div>
  );
}
