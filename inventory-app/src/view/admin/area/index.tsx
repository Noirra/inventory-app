import { useState, useEffect } from "react";
import Sidebar from "@/components/ui/sidebar";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Pagination from "@/components/ui/pagination";
import Notification from "@/components/ui/notification";
import fetchWithAuth from "@/utils/fetchInterceptor";


interface Area {
  id: string;
  code: string;
  name: string;
}

export default function AdminArea() {
  const navigate = useNavigate();
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchQuery, setSearchQuery] = useState("");

  const handleCloseNotification = () => setMessage("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const responseToJson = await fetchWithAuth("/areas"); // Sudah JSON
      console.log("Parsed JSON:", responseToJson);
  
      // Sesuaikan dengan struktur response API
      if (!responseToJson || !responseToJson.success) {
        throw new Error(`API error! Message: ${responseToJson?.message || "Unknown error"}`);
      }
  
      setAreas(responseToJson.data);
    } catch (error) {
      console.error("Error fetching areas:", error);
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
          ? "Area added successfully!"
          : successMessage === "updated"
          ? "Area updated successfully!"
          : "";

      if (message) {
        setMessage(message);
        setTimeout(() => setMessage(""), 3000);
        navigate("/area", { replace: true });
      }
    }
  }, []);


  const deleteArea = async (id: string) => {
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
        await fetchWithAuth(`/areas/${id}`, { method: "DELETE" });
        fetchData();
        Swal.fire("Deleted!", "Area has been deleted.", "success");
      } catch (error) {
        console.error("Failed to delete area:", error);
        Swal.fire("Error", "Failed to delete area.", "error");
      }
    }
  };

  const filteredAreas = areas.filter(area =>
    area.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    area.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedAreas = filteredAreas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredAreas.length / itemsPerPage);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-6">Area Management</h1>
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h2 className="text-lg font-semibold mb-4">Area List</h2>
          <Notification message={message} onClose={handleCloseNotification} />
          <div className="flex justify-between mb-4">
            <input
              type="text"
              placeholder="Search area..."
              className="border p-2 rounded-lg w-64 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={() => navigate("/area/create")}
              className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600"
            >
              <FaPlus /> <span>Add Area</span>
            </button>
          </div>
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border">No</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Code</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-3 text-center text-gray-500">Loading data...</td>
                </tr>
              ) : displayedAreas.length > 0 ? (
                displayedAreas.map((area, index) => (
                  <tr key={area.id} className="border">
                    <td className="p-3 border text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="p-3 border text-center">{area.name}</td>
                    <td className="p-3 border text-center">{area.code}</td>
                    <td className="p-3 border text-center space-x-2">
                      <Link to={`/area/edit/${area.id}`}>
                        <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                          <FaEdit />
                        </button>
                      </Link>
                      <button
                        onClick={() => deleteArea(area.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-3 text-center text-gray-500">No areas found.</td>
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