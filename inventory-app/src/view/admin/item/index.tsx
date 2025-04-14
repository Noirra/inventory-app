import { useState, useEffect } from "react";
import Sidebar from "@/components/ui/sidebar";
import { FaPlus, FaEdit } from "react-icons/fa";
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
  examinationPeriod: string;
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
                  <td colSpan={6} className="p-3 text-center text-gray-500">Loading data...</td>
                </tr>
              ) : displayedItems.length > 0 ? (
                displayedItems.map((item, index) => (
                  <tr key={item.id} className="border">
                    <td className="p-3 border text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="p-3 border text-center cursor-pointer hover:underline" onClick={() => navigate(`/admin-dashboard/items/komponen/${item.id}`)}><span className="text-blue-600">{item.name}</span></td>
                    <td className="p-3 border text-center">${item.price}</td>
                    <td className="p-3 border text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status === "UNUSED" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 border text-center space-x-2">
                      <Link to={`/admin-dashboard/items/edit/${item.id}`}><button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"><FaEdit /></button></Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-3 text-center text-gray-500">No items found.</td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination currentPage={currentPage} totalPages={totalPages} changePage={setCurrentPage} />
        </div>
      </div>
    </div>
  );
}
