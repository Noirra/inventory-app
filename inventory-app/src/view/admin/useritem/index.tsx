import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import Sidebar from "@/components/ui/sidebar";
import Pagination from "@/components/ui/pagination";
import Notification from "@/components/ui/notification";
import Swal from "sweetalert2";
import fetchWithAuth from "@/utils/fetchInterceptor";

interface UserItem {
  id: string;
  userId: string;
  items: { name: string; code: string }[];
  createdAt: string;
}



export default function AdminUserItem() {
  const navigate = useNavigate();
  const [userItems, setUserItems] = useState<UserItem[]>([]);
  const { userId } = useParams<{ userId: string }>();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleCloseNotification = () => setMessage("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const responseToJson = await fetchWithAuth(`/user-items/user/${userId}`);
      setUserItems(responseToJson.data)
    } catch (error) {
      console.error("Error fetching user items:", error);
      setUserItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); 
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const successMessage = params.get("success");

    if (successMessage) {
      const message =
        successMessage === "created"
          ? "User item added successfully!"
          : successMessage === "updated"
          ? "User item updated successfully!"
          : "";

      if (message) {
        setMessage(message);
        setTimeout(() => {
          setMessage("");

          // Hapus query parameter 'success' setelah 3 detik
          params.delete("success");
          navigate(`${window.location.pathname}?${params.toString()}`, { replace: true });
        }, 3000);
      }
    }
  }, [navigate]);

  const deleteUserItem = async (id: string) => {
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
        await fetchWithAuth(`/user-items/${id}`, { method: "DELETE" });
        fetchData();
        Swal.fire("Deleted!", "User item has been deleted.", "success");
      } catch (error) {
        console.error("Failed to delete user item:", error);
        Swal.fire("Error", "Failed to delete user item.", "error");
      }
    }
  };


  
  const filteredUserItems = userItems.filter(
    (userItem) =>
      userItem.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userItem.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const displayedUserItems = filteredUserItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredUserItems.length / itemsPerPage);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">User Items Management</h1>
        </div>
        <nav className="flex items-center text-sm text-gray-500 mb-4 space-x-2">
          <Link to="/admin-dashboard" className="hover:text-blue-600 transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <Link to="/admin-dashboard/users" className="hover:text-blue-600 transition-colors">
          User
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">User Items</span>
        </nav>
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h2 className="text-lg font-semibold mb-4">User Item List</h2>
          <Notification message={message} onClose={handleCloseNotification} />
          <div className="flex justify-between mb-4">
            <input
              type="text"
              placeholder="Search user item..."
              className="border p-2 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={() => navigate(`/admin-dashboard/users/${userId}/useritem/create`)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600"
            >
              <FaPlus /> <span>Add User Item</span>
            </button>
          </div>
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border text-center">ID</th>
                <th className="p-3 border text-center">Items</th>
                <th className="p-3 border text-center">Created At</th>
                <th className="p-3 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-3 text-center text-gray-500">
                    Loading data...
                  </td>
                </tr>
              ) : displayedUserItems.length > 0 ? (
                displayedUserItems.map((userItem, index) => (
                  <tr key={userItem.id} className="border">
                    <td className="p-3 border text-center ">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="p-3 border text-center">
                      <span className="block">{userItem.item.name}</span>
                    </td>
                    <td className="p-3 border text-center">{userItem.createdAt}</td>
                    <td className="p-3 border text-center space-x-2">
                      <Link to={`/admin-dashboard/users/${userId}/useritem/edit/${userItem.id}`} title="Edit User Item">
                        <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                          <FaEdit />
                        </button>
                      </Link>
                      <button
                        onClick={() => deleteUserItem(userItem.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-3 text-center text-gray-500">
                    No user items found.
                  </td>
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
