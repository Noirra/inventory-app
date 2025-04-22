import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar/owner";
import Pagination from "@/components/ui/pagination";
import fetchWithAuth from "@/utils/fetchInterceptor";

interface Areas {
  id: string;
  code: string;
  name: string;
}

export default function OwnerArea() {
  const [areas, setAreas] = useState<Areas[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const responseToJson = await fetchWithAuth("/areas");
      if (Array.isArray(responseToJson.data)) {
        setAreas(responseToJson.data);
      } else {
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
    setTimeout(() => setIsVisible(true), 10);
  }, []);

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
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">View Areas</h1>
        </div>

        <div className={`bg-white p-6 rounded-2xl shadow border transition-all duration-200 ${isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
          <h2 className="text-lg font-semibold mb-4">Area List</h2>

          <div className="flex justify-between mb-4">
            <input
              type="text"
              placeholder="Search area..."
              className="border p-2 rounded-lg w-full max-w-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border">No</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Code</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="p-3 text-center text-gray-500">
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-3 text-center text-gray-500">
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
      </div>
    </div>
  );
}
