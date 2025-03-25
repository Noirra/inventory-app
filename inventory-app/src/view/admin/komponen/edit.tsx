import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import Sidebar from "@/components/ui/sidebar";
import { useNavigate, useParams } from "react-router-dom";
import fetchWithAuth from "@/utils/fetchInterceptor";

export default function EditComponent() {
  const navigate = useNavigate();
  const { itemId, componentId } = useParams();
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchComponent = async () => {
      try {
        const response = await fetchWithAuth(`/items/${itemId}/components/${componentId}`);
        const data = await response.json();
        setName(data.name);
      } catch (error) {
        console.error("Error fetching component:", error);
      }
    };

    fetchComponent();
  }, [itemId, componentId]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name) {
      alert("Name is required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    if (photo) formData.append("photo", photo);

    try {
      setLoading(true);
      await fetchWithAuth(`/components/items/${itemId}/components/${componentId}`, {
        method: "PATCH",
        body: formData,
      });
      navigate(`/admin-dashboard/items/komponen/${itemId}?success=updated`);
    } catch (error) {
      console.error("Error:", error);
      alert(`Error updating data: ${error.message}`);
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
              onClick={() => navigate(`/admin-dashboard/items/komponen/${itemId}`)}
              className="flex items-center text-blue-500 hover:underline"
            >
              <FaArrowLeft className="mr-2" /> Back
            </button>
          </div>

          <h2 className="text-xl font-semibold mb-4">Edit Component</h2>

          <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
            <div className="border p-4 rounded-lg shadow bg-gray-50">
              <div className="mb-4">
                <label className="block font-semibold">Component Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={handleChange}
                  className="border p-2 rounded-lg w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold">Upload New Photo (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="border p-2 rounded-lg w-full"
                />
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
