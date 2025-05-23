import { useState, useEffect } from "react";
import Sidebar from "@/components/ui/sidebar";
import { FaPlus, FaTrash } from "react-icons/fa";
import Pagination from "@/components/ui/pagination";
import Notification from "@/components/ui/notification";
import { Link,useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import fetchWithAuth from "@/utils/fetchInterceptor";

interface GroupCode {
  id: string;
  code: string;
  name: string;
}

export default function AdminGroupItem() {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [groupCodes, setGroupCodes] = useState<GroupCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchQuery, setSearchQuery] = useState("");

  const handleCloseNotification = () => setMessage("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const responseToJson = await fetchWithAuth(`/item-group/${groupId}/items`);
      console.log("Fetched group codes:", responseToJson);
      setGroupCodes(Array.isArray(responseToJson.data) ? responseToJson.data : []);
    } catch (error) {
      console.error("Error fetching group codes:", error);
      setGroupCodes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const params = new URLSearchParams(window.location.search);
    const successMessage = params.get("success");

    if (successMessage) {
      const messages: Record<string, string> = {
        created: "Group code added successfully!",
        updated: "Group code updated successfully!"
      };
      
      if (messages[successMessage]) {
        setMessage(messages[successMessage]);
        setTimeout(() => setMessage(""), 3000);
        navigate(`/admin-dashboard/groupcode/groupitem/${groupId}`, { replace: true });
      }
    }
  }, [groupId]);

  const deleteGroupCode = async (itemId: string) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        await fetchWithAuth(`/item-group/${groupId}/items/${itemId}`, { method: "DELETE" });
        fetchData();
        Swal.fire("Deleted!", "Item has been deleted from group code.", "success");
      } catch (error) {
        console.error("Failed to delete item:", error);
        Swal.fire("Error", "Failed to delete item.", "error");
      }
    }
  };

  const filteredGroupCodes = groupCodes.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const displayedGroupCodes = filteredGroupCodes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredGroupCodes.length / itemsPerPage);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Group Item Management</h1>
        </div>
        <nav className="flex items-center text-sm text-gray-500 mb-4 space-x-2">
          <Link to="/admin-dashboard" className="hover:text-blue-600 transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <Link to="/admin-dashboard/groupcode" className="hover:text-blue-600 transition-colors">
            Group Code
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">Group Items</span>
        </nav>
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h2 className="text-lg font-semibold mb-4">Group Item List</h2>
          <Notification message={message} onClose={handleCloseNotification} />
          <div className="flex justify-between mb-4">
            <input
              type="text"
              placeholder="Search group Item..."
              className="border p-2 rounded-lg w-1/3"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <button
              onClick={() => navigate(`/admin-dashboard/groupcode/${groupId}/groupitem/create`)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600"
            >
              <FaPlus /> <span>Add Group Item</span>
            </button>
          </div>
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border">No</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="p-3 text-center text-gray-500">Loading data...</td>
                </tr>
              ) : displayedGroupCodes.length > 0 ? (
                displayedGroupCodes.map((group, index) => (
                  <tr key={group.id} className="border">
                    <td className="p-3 border text-center">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="p-3 border text-center">{group.name}</td>
                    <td className="p-3 border text-center space-x-2">
                      <button
                        onClick={() => deleteGroupCode(group.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-3 text-center text-gray-500">No items found.</td>
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
