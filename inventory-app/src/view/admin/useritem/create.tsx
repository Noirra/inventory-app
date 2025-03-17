import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import Sidebar from "@/components/ui/sidebar";
import { useNavigate, useParams } from "react-router-dom";
import fetchWithAuth from "@/utils/fetchInterceptor";

export default function CreateUserItem() {
  const navigate = useNavigate();
  const { userId } = useParams(); // Mengambil userId dari URL
  const [itemId, setItemId] = useState("");
  const [items, setItems] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false); // Tambahkan state loading

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
    setItemId(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      console.error("Error: userId is undefined");
      return;
    }
  
    const payload = { itemId, userId };
    console.log("Submitting payload:", payload);
  
    try {
      setLoading(true);
    
      // Langsung ambil data, karena Axios mengembalikan data langsung
      const responseData = await fetchWithAuth("/user-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    
      console.log("Response Data:", responseData); // ✅ Sudah dalam bentuk objek JS
    
      if (responseData.success) {
        navigate(`/admin-dashboard/users/useritem/${userId}?success=created`, { replace: true });
      } else {
        throw new Error(`Unexpected response status`);
      }
    
    } catch (error) {
      console.error("Error:", error);
      alert(`Error submitting data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }    

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

          <h2 className="text-xl font-semibold mb-4">Create New Item</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border p-4 rounded-lg shadow bg-gray-50">
              <div className="mb-4">
                <label className="block font-semibold">Item ID</label>
                <select
                  name="itemId"
                  value={itemId}
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
                <FaSave /> <span>{loading ? "Saving..." : "Save Item"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
