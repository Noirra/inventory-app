import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaPlus, FaEdit } from "react-icons/fa";
import Sidebar from "@/components/ui/sidebar";
import Pagination from "@/components/ui/pagination";
import Notification from "@/components/ui/notification";
import fetchWithAuth from "@/utils/fetchInterceptor";

interface ComponentItem {
  id: string;
  name: string;
  photo?: string;
}

export default function AdminItems() {
  const navigate = useNavigate();
  const { itemId } = useParams();
  const [items, setItems] = useState<ComponentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (itemId) {
      fetchData();
    }
  }, [itemId]); // Memastikan fetchData dipanggil saat itemId berubah

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`/components/items/${itemId}/components`);
      if (response?.data && Array.isArray(response.data)) {
        setItems(response.data as ComponentItem[]);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      setMessage("Failed to load items.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-6">Components Management</h1>
        <nav className="flex items-center text-sm text-gray-500 mb-4 space-x-2">
          <Link to="/admin-dashboard" className="hover:text-blue-600 transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <Link to="/admin-dashboard/items" className="hover:text-blue-600 transition-colors">
            Items
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">Components</span>
        </nav>
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h2 className="text-lg font-semibold mb-4">Components List</h2>
          <Notification message={message} onClose={() => setMessage("")} />
          <div className="flex justify-between mb-4">
            <input
              type="text"
              placeholder="Search item..."
              className="border p-2 rounded-lg w-64 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={() => navigate(`/admin-dashboard/items/${itemId}/komponen/create`)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600"
            >
              <FaPlus /> <span>Add Item</span>
            </button>
          </div>
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border">ID</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Photo</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-3 text-center text-gray-500">Loading data...</td>
                </tr>
              ) : displayedItems.length > 0 ? (
                displayedItems.map((item, index) => (
                  <tr key={item.id} className="border">
                    <td className="p-3 border text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="p-3 border text-center">{item.name}</td>
                    <td className="p-3 border text-center">
                      {item?.photo && (
                        <img
                          src={`https://inventory.bariqfirjatullah.my.id/${item.photo}`}
                          alt="Component"
                          className="mx-auto h-16 w-16 object-cover rounded"
                        />
                      )}
                    </td>
                    <td className="p-3 border text-center space-x-2">
                      <Link to={`/admin-dashboard/items/${itemId}/komponen/edit/${item.id}`}>
                        <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                          <FaEdit />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-3 text-center text-gray-500">No items found.</td>
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
    </div>
  );
}
