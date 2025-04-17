// view/owner/groupitem/index.tsx

import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Sidebar from "@/components/sidebar/owner";
import Pagination from "@/components/ui/pagination";
import fetchWithAuth from "@/utils/fetchInterceptor";

interface GroupItem {
  id: string;
  name: string;
}

export default function OwnerGroupItem() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [groupItems, setGroupItems] = useState<GroupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 5;

  const fetchData = async () => {
    setLoading(true);
    try {
      const responseToJson = await fetchWithAuth(`/item-group/${groupId}/items`);
      if (Array.isArray(responseToJson.data)) {
        setGroupItems(responseToJson.data);
      } else {
        setGroupItems([]);
      }
    } catch (error) {
      console.error("Error fetching group items:", error);
      setGroupItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [groupId]);

  const filteredItems = groupItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Group Item List</h1>
        </div>

        <nav className="flex items-center text-sm text-gray-500 mb-4 space-x-2">
          <Link to="/owner-dashboard" className="hover:text-blue-600 transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <Link to="/owner-dashboard/groupcode" className="hover:text-blue-600 transition-colors">
            Group Code
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">Group Items</span>
        </nav>

        <div className="bg-white p-6 rounded-2xl shadow border">
          <input
            type="text"
            placeholder="Search group item..."
            className="border p-2 rounded-lg mb-4 w-1/3"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border">No</th>
                <th className="p-3 border">Name</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={2} className="p-3 text-center text-gray-500">Loading data...</td>
                </tr>
              ) : displayedItems.length > 0 ? (
                displayedItems.map((item, index) => (
                  <tr key={item.id} className="border">
                    <td className="p-3 border text-center">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="p-3 border text-center">{item.name}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="p-3 text-center text-gray-500">No group items found.</td>
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
