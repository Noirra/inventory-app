import { useState, useEffect } from "react";
import Sidebar from "@/components/ui/sidebar";
import { FaPlus, FaEdit, FaTrash, FaSpinner } from "react-icons/fa";
import Pagination from "@/components/ui/pagination";
import Notification from "@/components/ui/notification";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import fetchWithAuth from "@/utils/fetchInterceptor";
import CreateAreaModal from "@/view/admin/area/create";

interface Areas {
  id: string;
  code: string;
  name: string;
}

export default function AdminArea() {
  const navigate = useNavigate();
  const [areas, setAreas] = useState<Areas[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"create" | "edit">("create");
  const [selectedArea, setSelectedArea] = useState<Areas | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);


  const handleCloseNotification = () => {
    setMessage("");
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const responseToJson = await fetchWithAuth("/areas");
      console.log("Fetched areas:", responseToJson);

      if (Array.isArray(responseToJson.data)) {
        setAreas(responseToJson.data);
      } else {
        console.error("Unexpected response format:", responseToJson);
        setAreas([]);
      }
    } catch (error) {
      console.error("Error fetching areas:", error);
      setAreas([]);
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
        navigate("/admin-dashboard/area", { replace: true });
      }
    }

    setTimeout(() => setIsVisible(true), 10);
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
      setIsProcessing(true);
      try {
        await fetchWithAuth(`/areas/${id}`, { method: "DELETE" });
        fetchData();
        Swal.fire("Deleted!", "Area has been deleted.", "success");
      } catch (error) {
        console.error("Failed to delete area:", error);
        Swal.fire("Error", "Failed to delete area.", "error");
      } finally {
        setIsProcessing(false); // <-- stop loading
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

  const handleAddArea = () => {
    setModalType("create");
    setSelectedArea(null);
    setShowModal(true);
  };

  const handleEditArea = (area: Areas) => {
    setModalType("edit");
    setSelectedArea(area);
    setShowModal(true);
  };

  const handleAreaSuccess = async () => {
    setIsProcessing(true);
    await fetchData();       
    setShowModal(false);    
    setMessage("Berhasil disimpan!");
    setTimeout(() => setMessage(""), 3000);
    setIsProcessing(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Area Management</h1>
        </div>

        <div className={`bg-white p-6 rounded-2xl shadow border transition-all duration-200 ${isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
          <h2 className="text-lg font-semibold mb-4">Area List</h2>
          <Notification message={message} onClose={handleCloseNotification} />
          <div className="flex justify-between mb-4">
            <input
              type="text"
              placeholder="Search area..."
              className="border p-2 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <button
              onClick={handleAddArea}
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
                  <td colSpan={4} className="p-3 text-center text-gray-500">
                    Loading data...
                  </td>
                </tr>
              ) : displayedAreas.length > 0 ? (
                displayedAreas.map((area, index) => (
                  <tr key={area.id} className="border">
                    <td className="p-3 border text-center">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="p-3 border text-center">{area.name}</td>
                    <td className="p-3 border text-center">{area.code}</td>
                    <td className="p-3 border text-center space-x-2">
                      <button
                        onClick={() => handleEditArea(area)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 disabled:opacity-50"
                        disabled={isProcessing}
                      >
                        {isProcessing ? <FaSpinner className="animate-spin" /> : <FaEdit />}
                      </button>

                      <button
                        onClick={() => deleteArea(area.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                        disabled={isProcessing}
                      >
                        {isProcessing ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-3 text-center text-gray-500">
                    No areas found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="mt-4">
            <Pagination currentPage={currentPage} totalPages={totalPages} changePage={setCurrentPage} />
          </div>
        </div>

        {showModal && (
          <CreateAreaModal
            onClose={() => setShowModal(false)}
            onSuccess={handleAreaSuccess}
            area={selectedArea}
            modalType={modalType}
          />
        )}
      </div>
    </div>
  );
}
