import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import Sidebar from "@/components/ui/sidebar";
import { useNavigate, useParams } from "react-router-dom";
import fetchWithAuth from "@/utils/fetchInterceptor";

export default function EditUserItem() {
  const navigate = useNavigate();
  const { userId, userItemId } = useParams();
  const [selectedItemId, setSelectedItemId] = useState(userItemId || "");
  const [items, setItems] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const itemsData = await fetchWithAuth("/items");
        setItems(Array.isArray(itemsData.data) ? itemsData.data : []);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      }
    };

    fetchItems();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedItemId(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    if (!userId || !selectedItemId) {
      console.error("Error: userId or selectedItemId is undefined");
      return;
    }
  
    const payload = { itemId: selectedItemId, userId };
    console.log("Submitting payload:", payload);
  
    try {
      setLoading(true);
      await fetchWithAuth(`/user-items/${userItemId}`, { 
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      console.log("Success");
  
      setTimeout(() => {
        navigate(`/admin-dashboard/users/useritem/${userId}?success=updated`, { replace: true });
      }, 500);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow border p-6">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => navigate(`/admin-dashboard/users/useritem/${userId}`)}
              className="flex items-center text-blue-500 hover:underline"
            >
              <FaArrowLeft className="mr-2" /> Back
            </button>
          </div>

          <h2 className="text-xl font-semibold mb-4">Edit Item</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border p-4 rounded-lg shadow bg-gray-50">
              <div className="mb-4">
                <label className="block font-semibold">Item ID</label>
                <select
                  name="itemId"
                  value={selectedItemId}
                  onChange={handleChange}
                  className="border p-2 rounded-lg w-full"
                  required
                >
                  <option value="">Select Item</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600 disabled:opacity-50"
                disabled={loading}
              >
                <FaSave /> <span>{loading ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
