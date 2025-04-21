// owner/grupcode/index.tsx

import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar/owner"; 
import Pagination from "@/components/ui/pagination";
import fetchWithAuth from "@/utils/fetchInterceptor";
import { useNavigate } from "react-router-dom";

interface GroupCode {
  id: string;
  code: string;
  name: string;
}

export default function OwnerGroupCode() {
  const navigate = useNavigate();
  const [groupCodes, setGroupCodes] = useState<GroupCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const responseToJson = await fetchWithAuth("/item-group");

      if (Array.isArray(responseToJson.data)) {
        setGroupCodes(responseToJson.data);
      } else {
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
  }, []);

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
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Group Code List</h1>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow border">
          <div className="flex justify-between mb-4">
            <input
              type="text"
              placeholder="Search group code..."
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
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="p-3 text-center text-gray-500">
                    Loading data...
                  </td>
                </tr>
              ) : displayedGroupCodes.length > 0 ? (
                displayedGroupCodes.map((group, index) => (
                  <tr key={group.id} className="border">
                    <td className="p-3 border text-center">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td
                      className="p-3 border text-center cursor-pointer hover:underline"
                      onClick={() =>
                        navigate(`/owner-dashboard/groupcode/groupitem/${group.id}`)
                      }
                    >
                      <span className="text-blue-600">{group.name}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-3 text-center text-gray-500">
                    No group codes found.
                  </td>
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
