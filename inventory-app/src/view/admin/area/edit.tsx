import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { FaSave } from "react-icons/fa";
import { useParams } from "react-router-dom";
import fetchWithAuth from "@/utils/fetchInterceptor";
import Notification from "@/components/ui/notification";
import Swal from "sweetalert2";


interface EditAreaProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditArea({ onClose, onSuccess }: EditAreaProps) {
  const { areaId } = useParams<{ areaId: string }>();

  const [area, setArea] = useState({ name: "", code: "" });
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
    fetchArea();
  }, []);

  const fetchArea = async () => {
    try {
      const data = await fetchWithAuth(`/areas/${areaId}`);
      if (data?.data) {
        setArea({ name: data.data.name, code: data.data.code });
      } else {
        setMessage("Data area tidak ditemukan");
      }
    } catch (error) {
      console.error("Failed to fetch area:", error);
      setMessage("Gagal mengambil data area");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setArea({ ...area, [e.target.name]: e.target.value });
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

    try {
      const data = await fetchWithAuth(`/areas/${areaId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(area),
      });

      if (!data.success) {
        throw new Error(data.message || "Gagal memperbarui area");
      }

      setMessage("Area berhasil diperbarui!");
      onSuccess();

      setTimeout(() => setMessage(""), 3000);
      setIsVisible(false);
      setTimeout(() => {
        onClose();
        location.reload();
      }, 250);
    } catch (error: any) {
      console.error("Update error:", error);
      const msg = error.message || "Terjadi kesalahan saat update";
  
      const isDuplicate =
        msg.toLowerCase().includes("duplicate") ||
        msg.toLowerCase().includes("unique") ||
        msg.toLowerCase().includes("sudah ada") ||
        msg.toLowerCase().includes("exists") ||
        msg.includes("409");
  
      if (isDuplicate) {
        await Swal.fire({
          title: "Kode Area Duplikat",
          text: "Kode area sudah digunakan. Gunakan kode lain.",
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
    }
  };
  return (
    <>
      <Notification message={message} onClose={handleCloseNotification} />

      <div className={`fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center transition-opacity duration-200 ${isVisible ? "opacity-100" : "opacity-0"}`}>
        <div className={`bg-white rounded-2xl shadow-lg p-6 w-full max-w-md transform transition-all duration-200 ${isVisible ? "scale-100" : "scale-95"}`}>
          <h2 className="text-xl font-semibold mb-4">Edit Area</h2>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Area Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={area.name}
                onChange={handleChange}
                placeholder="Area Name"
                className="border p-2 rounded-lg w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">Area Code</label>
              <input
                id="code"
                type="text"
                name="code"
                value={area.code}
                onChange={handleChange}
                maxLength={3}
                placeholder="Area Code"
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
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center space-x-2"
              >
                <FaSave /> <span>Update Area</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
