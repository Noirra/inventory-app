import { useState, useEffect } from "react";
import Sidebar from "@/components/ui/sidebar";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Pagination from "@/components/ui/pagination";
import Notification from "@/components/ui/notification";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import fetchWithAuth from "@/utils/fetchInterceptor";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminUser() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
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
        const responseToJson = await fetchWithAuth("/users");
        console.log("Fetched users:", responseToJson);

        if (Array.isArray(responseToJson.users)) {
            setUsers(responseToJson.users);
        } else {
            console.error("Unexpected response format:", responseToJson);
            setUsers([]);
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        setUsers([]);
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
          ? "User added successfully!"
          : successMessage === "updated"
            ? "User updated successfully!"
            : "";

      if (message) {
        setMessage(message);
        setTimeout(() => setMessage(""), 3000);
        navigate("/admin-dashboard/users", { replace: true });
      }
    }
  }, []);

  const deleteUser = async (id: string) => {
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
        await fetchWithAuth(`/users/${id}`, { method: "DELETE" });
        fetchData();
        Swal.fire("Deleted!", "User has been deleted.", "success");
      } catch (error) {
        console.error("Failed to delete user:", error);
        Swal.fire("Error", "Failed to delete user.", "error");
      }
    }
  };

  const filteredUsers = (users || []).filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchQuery.toLowerCase())
);

  const displayedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-6">User Management</h1>
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h2 className="text-lg font-semibold mb-4">User List</h2>
          <Notification message={message} onClose={handleCloseNotification} />
          <div className="flex justify-between mb-4">
            <input
              type="text"
              placeholder="Search user..."
              className="border p-2 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={() => navigate("/admin-dashboard/users/create")}
              className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600"
            >
              <FaPlus /> <span>Add User</span>
            </button>
          </div>
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border">No</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-3 text-center text-gray-500">Loading data...</td>
                </tr>
              ) : displayedUsers.length > 0 ? (
                displayedUsers.map((user, index) => (
                  <tr key={user.id} className="border">
                    <td className="p-3 border text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td
                      className="p-3 border text-center cursor-pointer hover:underline"
                      onClick={() => navigate(`/admin-dashboard/users/useritem/${user.id}`)}
                    ><span className="text-blue-600">
                      {user.name}
                    </span></td>
                    <td className="p-3 border text-center">{user.email}</td>
                    <td className="p-3 border text-center space-x-2">
                      <Link to={`/admin-dashboard/users/edit/${user.id}`} title="Edit User">
                        <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                          <FaEdit />
                        </button>
                      </Link>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-3 text-center text-gray-500">No users found.</td>
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
