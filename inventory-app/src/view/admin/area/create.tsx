import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Notification from "@/components/ui/notification";
import fetchWithAuth from "@/utils/fetchInterceptor";

interface CreateAreaProps {
  area: { id?: string; name: string; code: string } | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateArea({ area, onClose, onSuccess }: CreateAreaProps) {
  const [formData, setFormData] = useState({ name: "", code: "" });
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Tambahkan state loading
  const navigate = useNavigate();

  useEffect(() => {
    if (area) {
      setFormData({ name: area.name, code: area.code });
    } else {
      setFormData({ name: "", code: "" });
    }
    setTimeout(() => setIsVisible(true), 10);
  }, [area]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 200);
  };

  const handleCloseNotification = () => {
    setMessage("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading true ketika submit

    try {
      let result;
      if (area && area.id) {
        result = await fetchWithAuth(`/areas/${area.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        result = await fetchWithAuth("/areas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      if (!result.ok) {
        throw new Error(result.message || "Gagal menyimpan area");
      }

      setMessage(area ? "Area berhasil diperbarui!" : "Area berhasil dibuat!");
      onSuccess();

      setTimeout(() => setMessage(""), 3000);

      setIsVisible(false);
      setTimeout(() => {
        onClose();
        navigate('/admin-dashboard/area', { replace: true });
        window.location.reload();
      }, 250);

    } catch (error: any) {
      setMessage(error.message || "Terjadi kesalahan");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false); // Set loading false setelah proses selesai
    }
  };

  return (
    <>
      <Notification message={message} onClose={handleCloseNotification} />

      <div className={`fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center transition-opacity duration-200 ${isVisible ? "opacity-100" : "opacity-0"}`}>
        <div className={`bg-white rounded-2xl shadow-lg p-6 w-full max-w-md transform transition-all duration-200 ${isVisible ? "scale-100" : "scale-95"}`}>
          <h2 className="text-xl font-semibold mb-4">{area ? "Edit Area" : "Create New Area"}</h2>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Area Name</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Area Name"
                value={formData.name}
                onChange={handleChange}
                className="border p-2 rounded-lg w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">Area Code (Max 3)</label>
              <input
                id="code"
                type="text"
                name="code"
                maxLength={3}
                placeholder="Area Code"
                value={formData.code}
                onChange={handleChange}
                className="border p-2 rounded-lg w-full"
                required
              />
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleClose}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600 disabled:opacity-50"
                disabled={loading} 
              >
                <FaSave /> 
                <span>{loading ? "Saving..." : area ? "Update Area" : "Save Area"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
