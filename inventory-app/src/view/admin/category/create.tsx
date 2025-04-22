import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { FaSave } from "react-icons/fa";
import Notification from "@/components/ui/notification";
import fetchWithAuth from "@/utils/fetchInterceptor";
import Swal from "sweetalert2";

interface Category {
  id: string;
  code: string;
  name: string;
}

interface CreateCategoryModalProps {
  onClose: () => void;
  onSuccess: () => void;
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



  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = modalType === "edit" ? "PATCH" : "POST";
      const url = modalType === "edit" ? `/categories/${formData.id}` : "/categories";

      const result = await fetchWithAuth(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!result.ok && !result.data) {
        throw new Error(result.message || "Gagal menyimpan kategori");
      }

      setMessage(modalType === "edit" ? "Kategori berhasil diperbarui!" : "Kategori berhasil dibuat!");
      setTimeout(() => setMessage(""), 2000);

      setTimeout(() => {
        onSuccess();
      }, 500);
    } catch (error: any) {
      const msg = error.message || "Terjadi kesalahan";

      const isDuplicate =
        msg.toLowerCase().includes("duplicate") ||
        msg.toLowerCase().includes("unique") ||
        msg.toLowerCase().includes("sudah ada") ||
        msg.toLowerCase().includes("exists") ||
        msg.includes("409");   
  
      if (isDuplicate) {
        await Swal.fire({
          title: "Kode Kategori Duplikat",
          text: "Kode kategori sudah digunakan. Gunakan kode lain.",
          icon: "error",
          confirmButtonColor: "#d33",
          confirmButtonText: "OK",
        });
      } else {
        await Swal.fire({
          title: "Terjadi Kesalahan",
          text: msg,
          icon: "error",
          confirmButtonColor: "#d33",
          confirmButtonText: "OK",
        });
      }
  
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      

      <div
        className={`fixed inset-0 flex justify-center items-center bg-black/20 backdrop-blur-sm transition-opacity duration-200 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className={`bg-white rounded-2xl shadow-lg p-6 max-w-md w-full transform transition-all duration-200 ${
            isVisible ? "scale-100" : "scale-95"
          }`}
        >
          <h2 className="text-xl font-semibold mb-4">
            {modalType === "create" ? "Buat Kategori Baru" : "Edit Kategori"}
          </h2>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nama Kategori
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Nama Kategori"
                value={formData.name}
                onChange={handleChange}
                className="border p-2 rounded-lg w-full"
                required
              />
            </div>
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-700"
              >
                Kode Kategori
              </label>
              <input
                type="text"
                id="code"
                name="code"
                maxLength={3}
                placeholder="Kode"
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
                Batal
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600 disabled:opacity-50"
                disabled={loading}
              >
                <FaSave />
                <span>
                  {loading
                    ? "Menyimpan..."
                    : modalType === "create"
                    ? "Simpan Kategori"
                    : "Perbarui Kategori"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateCategoryModal;
