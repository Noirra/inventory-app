import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { FaSave } from "react-icons/fa";
import Notification from "@/components/ui/notification";
import fetchWithAuth from "@/utils/fetchInterceptor";

interface Category {
  id: string;
  code: string;
  name: string;
}

interface CreateCategoryModalProps {
  onClose: () => void;
  onSuccess: () => Promise<void>;
  category: Category | null;
  modalType: "create" | "edit";
}

const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
  onClose,
  onSuccess,
  category,
  modalType,
}) => {
  const [formData, setFormData] = useState<Category>({
    id: "",
    code: "",
    name: "",
  });
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (modalType === "edit" && category) {
      setFormData(category);
    } else {
      setFormData({ id: "", code: "", name: "" });
    }
    setTimeout(() => setIsVisible(true), 10);
  }, [category, modalType]);

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
      let result;
      const method = modalType === "edit" ? "PATCH" : "POST";
      const url = modalType === "edit" ? `/categories/${formData.id}` : "/categories";
  
      result = await fetchWithAuth(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      if (!result.ok) {
        throw new Error(result.message || "Gagal menyimpan kategori");
      }
  
      setMessage(modalType === "edit" ? "Category berhasil diperbarui!" : "Category berhasil dibuat!");
      await onSuccess();
  
      setTimeout(() => setMessage(""), 3000);
  
      setIsVisible(false);
      setTimeout(() => {
        onClose();
      }, 250);
  
    } catch (error: any) {
      setMessage(error.message || "Terjadi kesalahan");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Notification message={message} onClose={handleCloseNotification} />

      <div className={`fixed inset-0 flex justify-center items-center bg-black/20 backdrop-blur-sm transition-opacity duration-200 ${isVisible ? "opacity-100" : "opacity-0"}`}>
        <div className={`bg-white rounded-2xl shadow-lg p-6 max-w-md w-full transform transition-all duration-200 ${isVisible ? "scale-100" : "scale-95"}`}>
          <h2 className="text-xl font-semibold mb-4">{modalType === "create" ? "Create New Category" : "Edit Category"}</h2>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Category Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Category Name"
                value={formData.name}
                onChange={handleChange}
                className="border p-2 rounded-lg w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">Category Code</label>
              <input
                type="text"
                id="code"
                name="code"
                placeholder="Category Code"
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
                <span>{loading ? "Saving..." : modalType === "create" ? "Save Category" : "Update Category"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateCategoryModal;
