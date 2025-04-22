import { useState, useEffect } from "react";
import Sidebar from "@/components/ui/sidebar";
import { FaPlus, FaTrash } from "react-icons/fa";
import Pagination from "@/components/ui/pagination";
import Notification from "@/components/ui/notification";
import {useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import fetchWithAuth from "@/utils/fetchInterceptor";

interface GroupCode {
  id: string;
  code: string;
  name: string;
}

export default function AdminGroupCode() {
  const navigate = useNavigate();
  const [groupCodes, setGroupCodes] = useState<GroupCode[]>([]);
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
      const responseToJson = await fetchWithAuth("/item-group");
      console.log("Fetched group codes:", responseToJson);

      if (Array.isArray(responseToJson.data)) {
        setGroupCodes(responseToJson.data);
      } else {
        console.error("Unexpected response format:", responseToJson);
        setGroupCodes([]);
      }
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
      const message =
        successMessage === "created"
          ? "Group code added successfully!"
          : successMessage === "updated"
          ? "Group code updated successfully!"
          : "";

      if (message) {
        setMessage(message);
        setTimeout(() => setMessage(""), 3000);
        navigate("/admin-dashboard/groupcode", { replace: true });
      }
    }
  }, []);

  const deleteGroupCode = async (id: string) => {
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
        await fetchWithAuth(`/item-group/${id}`, { method: "DELETE" });
        fetchData();
        Swal.fire("Deleted!", "Group code has been deleted.", "success");
      } catch (error) {
        console.error("Failed to delete group code:", error);
        Swal.fire("Error", "Failed to delete group code.", "error");
      }
    }
  };

  const filteredGroupCodes = groupCodes.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) 
  );

  const displayedGroupCodes = (filteredGroupCodes || groupCodes).slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil((filteredGroupCodes || groupCodes).length / itemsPerPage);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Group Code Management</h1>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow border">
          <h2 className="text-lg font-semibold mb-4">Group Code List</h2>
          <Notification message={message} onClose={handleCloseNotification} />
          <div className="flex justify-between mb-4">
            <input
              type="text"
              placeholder="Search group code..."
              className="border p-2 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <button
              onClick={() => navigate("/admin-dashboard/groupcode/create")}
              className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600"
            >
              <FaPlus /> <span>Add Group Code</span>
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
                  <td colSpan={4} className="p-3 text-center text-gray-500">
                    Loading data...
                  </td>
                </tr>
              ) : displayedGroupCodes.length > 0 ? (
                displayedGroupCodes.map((group, index) => (
                  <tr key={group.id} className="border">
                    <td className="p-3 border text-center">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="p-3 border text-center cursor-pointer hover:underline" onClick={() => navigate(`/admin-dashboard/groupcode/groupitem/${group.id}`)}><span className="text-blue-600">{group.name}</span></td>
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
                  <td colSpan={4} className="p-3 text-center text-gray-500">
                    No group codes found.
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
