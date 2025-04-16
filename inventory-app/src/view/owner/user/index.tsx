import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar/owner";
import { FaPlus, FaUserShield, FaUser } from "react-icons/fa";
import Pagination from "@/components/ui/pagination";
import Notification from "@/components/ui/notification";
import { useNavigate } from "react-router-dom";
import fetchWithAuth from "@/utils/fetchInterceptor";
import Swal from "sweetalert2";

interface User {
    id: string;
    name: string;
    email: string;
    roles: {
      role: {
        name: string;
      };
    }[];
  }

export default function OwnerUser() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchQuery, setSearchQuery] = useState("");

  const handleCloseNotification = () => setMessage("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const responseToJson = await fetchWithAuth("/users");
      if (Array.isArray(responseToJson.users)) {
        setUsers(responseToJson.users);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleUserRole = async (user: User) => {
    const isCurrentlyAdmin = user.roles?.some(r => r.role.name === "admin");
    const url = isCurrentlyAdmin
      ? `/users/${user.id}/employee`
      : `/users/${user.id}/admin`; // gunakan route PATCH /users/:id untuk promote
  
    const confirmText = isCurrentlyAdmin
      ? "Do you want to demote this admin to user?"
      : "Do you want to promote this user to admin?";
  
    const successText = isCurrentlyAdmin
      ? "User has been demoted to regular user."
      : "User has been promoted to admin.";
  
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: confirmText,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#4CAF50",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, proceed!",
    });
  
    if (confirm.isConfirmed) {
      try {
        await fetchWithAuth(url, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}), // kirim JSON kosong
          });
  
        Swal.fire("Success", successText, "success");
        fetchData(); // refresh data setelah perubahan role
      } catch (error) {
        console.error("Failed to toggle role:", error);
        Swal.fire("Error", "Failed to change user role.", "error");
      }
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.roles.some(r => r.role.name.toLowerCase().includes(searchQuery.toLowerCase()))
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
          </div>
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border">No</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Role</th>
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
                    <td className="p-3 border text-center">{user.name}</td>
                    <td className="p-3 border text-center">{user.email}</td>
                    <td className="p-3 border text-center capitalize">
  {user.roles && user.roles.length > 0 ? user.roles[0].role.name : "No role"}
</td>
                    <td className="p-3 border text-center">
                      <button
                        onClick={() => toggleUserRole(user)}
                        className={`${
                            user.roles?.some(r => r.role.name === "admin")
                            ? "bg-blue-500 hover:bg-blue-600"
                            : "bg-gray-700 hover:bg-gray-800"
                        } text-white px-3 py-1 rounded flex items-center justify-center mx-auto`}
                        title={
                            user.roles?.some(r => r.role.name === "admin")
                            ? "Demote to User"
                            : "Promote to Admin"
                        }
                      >
                        {user.roles?.some(r => r.role.name === "admin") ? <FaUser /> : <FaUserShield />}
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
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              changePage={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
