import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import Sidebar from "@/components/ui/sidebar";
import { useNavigate, useParams } from "react-router-dom";
import fetchWithAuth from "@/utils/fetchInterceptor";

export default function CreateGroupCode() {
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();
  const [itemId, setItemId] = useState("");
  const [items, setItems] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const itemsData = await fetchWithAuth("/items");
        setItems(Array.isArray(itemsData.data) ? itemsData.data : []);
      } catch (error) {
        console.error("Failed to fetch item-group:", error);
      }
    };

    fetchItems();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setItemId(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetchWithAuth(`/item-group/${groupId}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId, groupCodeId: groupId}),
      });

      if (!response.success) {
        alert(response.message || "Failed to add item to GroupCode.");
        return;
      }

      navigate(`/admin-dashboard/groupcode/${groupId}?success=created`);
    } catch (error: any) {
      alert(error.message || "An error occurred");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow border p-6">
          <button
            onClick={() => navigate(`/admin-dashboard/groupcode/groupitem/${groupId}`)}
            className="mb-4 flex items-center text-blue-500 hover:underline"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>

          <h2 className="text-xl font-semibold mb-4">Add Item to Group Code</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
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
                className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600"
              >
                <FaSave /> Save Item
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
