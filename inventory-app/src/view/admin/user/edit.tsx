import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import Sidebar from "@/components/ui/sidebar";
import { useNavigate, useParams } from "react-router-dom";

export default function EditUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    // Simulasi mengambil data pengguna berdasarkan ID (di sini bisa pakai fetch atau axios dari backend)
    const fetchUser = async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "", // Kosongkan untuk keamanan
      };
      setUser(userData);
    };

    fetchUser();
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Simulasi update - di sini Anda bisa melakukan PUT/PATCH request ke backend
    console.log("User Updated:", user);

    navigate("/users");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow border p-6">
          <button onClick={() => navigate("/users")} className="mb-4 flex items-center text-blue-500 hover:underline">
            <FaArrowLeft className="mr-2" /> Back
          </button>
          <h2 className="text-xl font-semibold mb-4">Edit User</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <input type="text" name="name" value={user.name} onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <input type="email" name="email" value={user.email} onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <input type="password" name="password" placeholder="New Password (optional)" onChange={handleChange} className="border p-2 rounded-lg w-full" />
            <div className="flex justify-end">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600">
                <FaSave /> <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
