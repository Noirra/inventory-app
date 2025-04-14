import { useState, useEffect } from "react";
import Sidebar from "@/components/ui/sidebar";
import Pagination from "@/components/ui/pagination";
import Notification from "@/components/ui/notification";
import Swal from "sweetalert2";
import fetchWithAuth from "@/utils/fetchInterceptor";

interface Item {
  id: string;
  name: string;
  desc: string;
  priceRange: string;
  status: string;
}

export default function ItemRequestAdmin() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`/item-request`);
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching item requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const approveItem = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Approve this request?",
      text: "You are about to approve this item request.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve it!",
    });

    if (confirm.isConfirmed) {
      try {
        await fetchWithAuth(`/item-request/${id}/approve-admin`, { method: "PATCH" });
        setMessage("Item request approved successfully!");
        await fetchData();
      } catch (error) {
        console.error("Failed to approve item request:", error);
        Swal.fire("Error", "Failed to approve item request.", "error");
      }
    }
  };

  const rejectItem = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Reject this request?",
      text: "You are about to reject this item request.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, reject it!",
    });

    if (confirm.isConfirmed) {
      try {
        await fetchWithAuth(`/item-request/${id}/reject`, { method: "PATCH" });
        setMessage("Item request rejected successfully!");
        await fetchData();
      } catch (error) {
        console.error("Failed to reject item request:", error);
        Swal.fire("Error", "Failed to reject item request.", "error");
      }
    }
  };

  const completeItem = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Complete this request?",
      text: "You are about to Complete this item request.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#ffc107",
      confirmButtonText: "Yes, Complete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await fetchWithAuth(`/item-request/${id}/complete`, { method: "PATCH" });
        setMessage("Item request complete successfully!");
        await fetchData();
      } catch (error) {
        console.error("Failed to complete item request:", error);
        Swal.fire("Error", "Failed to complete item request.", "error");
      }
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchQuery.toLowerCase())
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
        <h1 className="text-2xl font-semibold mb-6">Item Request Management</h1>
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h2 className="text-lg font-semibold mb-4">Item Request List</h2>
          <Notification message={message} onClose={() => setMessage("")} />
          <div className="flex justify-between mb-4">
            <input
              type="text"
              placeholder="Search item request..."
              className="border p-2 rounded-lg w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Description</th>
                <th className="p-3 border">Price Range</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-3 text-center text-gray-500">
                    Loading data...
                  </td>
                </tr>
              ) : displayedItems.length > 0 ? (
                displayedItems.map((item) => (
                  <tr key={item.id} className="border">
                    <td className="p-3 border text-center">{item.name}</td>
                    <td className="p-3 border text-center">{item.desc}</td>
                    <td className="p-3 border text-center">{item.priceRange}</td>
                    <td className="p-3 border text-center">
                      <span
                        className={`font-semibold ${item.status === "APPROVED"
                            ? "text-green-600"
                            : item.status === "REJECTED"
                              ? "text-red-600"
                              : "text-yellow-600"
                          }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 border text-center">
                      {item.status === "PENDING" ? (
                        <div className="flex justify-center gap-2">
                          <button
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700"
                            onClick={() => approveItem(item.id)}
                          >
                            Approve
                          </button>
                          <button
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                            onClick={() => rejectItem(item.id)}
                          >
                            Reject
                          </button>
                        </div>
                      ) : item.status === "APPROVED" ? (
                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
                          onClick={() => completeItem(item.id)}
                        >
                          Complete
                        </button>
                      ) : (
                        <span className="text-gray-400 italic">No actions</span>
                      )}
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-3 text-center text-gray-500">
                    No item requests found.
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
