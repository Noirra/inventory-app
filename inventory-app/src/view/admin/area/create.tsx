import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { FaSave } from "react-icons/fa";
import Notification from "@/components/ui/notification";
import fetchWithAuth from "@/utils/fetchInterceptor";

interface Area {
  id: string;
  code: string;
  name: string;
}

interface CreateAreaModalProps {
  onClose: () => void;
  onSuccess: () => void;
  area: Area | null;
  modalType: "create" | "edit";
}

const CreateAreaModal: React.FC<CreateAreaModalProps> = ({
  onClose,
  onSuccess,
  area,
  modalType,
}) => {
  const [formData, setFormData] = useState<Area>({
    id: "",
    code: "",
    name: "",
  });
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (modalType === "edit" && area) {
      setFormData(area);
    } else {
      setFormData({ id: "", code: "", name: "" });
    }
    setTimeout(() => setIsVisible(true), 10);
  }, [area, modalType]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
    setLoading(true);

    try {
      const method = modalType === "edit" ? "PATCH" : "POST";
      const url = modalType === "edit" ? `/areas/${formData.id}` : "/areas";

      const result = await fetchWithAuth(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!result.ok && !result.data) {
        throw new Error(result.message || "Gagal menyimpan area");
      }

      setMessage(modalType === "edit" ? "Area berhasil diperbarui!" : "Area berhasil dibuat!");
      setTimeout(() => setMessage(""), 2000);

      setTimeout(() => {
        onSuccess(); // refresh data dan tutup modal
      }, 500);
    } catch (error: any) {
      setMessage(error.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

      <div className={`fixed inset-0 flex justify-center items-center bg-black/20 backdrop-blur-sm transition-opacity duration-200 ${isVisible ? "opacity-100" : "opacity-0"}`}>
        <div className={`bg-white rounded-2xl shadow-lg p-6 max-w-md w-full transform transition-all duration-200 ${isVisible ? "scale-100" : "scale-95"}`}>
          <h2 className="text-xl font-semibold mb-4">{modalType === "create" ? "Create New Area" : "Edit Area"}</h2>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Area Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Area Name"
                value={formData.name}
                onChange={handleChange}
                className="border p-2 rounded-lg w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">Area Code</label>
              <input
                type="text"
                id="code"
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
                <span>{loading ? "Saving..." : modalType === "create" ? "Save Area" : "Update Area"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateAreaModal;
