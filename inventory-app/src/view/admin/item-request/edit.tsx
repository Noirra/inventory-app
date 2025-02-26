import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "@/components/ui/sidebar";
import { FaArrowLeft, FaSave } from "react-icons/fa";

export default function EditItemRequest() {
  const navigate = useNavigate();
  const { id } = useParams(); // Ambil ID item dari URL

  // State untuk menyimpan data form
  const [formData, setFormData] = useState({
    name: "",
    desc: "",
    priceRange: "",
    referenceLink: "",
    code: "",
    status: "PENDING",
  });

  // Simulasi pengambilan data item berdasarkan ID (dapat diganti dengan API call)
  useEffect(() => {
    // Fetch data dari API (contoh data statis untuk sementara)
    const fetchData = async () => {
      const itemData = {
        name: "Laptop Dell XPS",
        desc: "High-performance laptop for development",
        priceRange: "$1000 - $1500",
        referenceLink: "https://example.com/laptop",
        code: "ITM-001",
        status: "PENDING",
      };
      setFormData(itemData);
    };
    fetchData();
  }, [id]);

  // Fungsi untuk menangani perubahan input dalam form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fungsi untuk menangani submit form
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Mencegah reload halaman saat submit
    console.log("Item Request Updated:", formData);
    navigate("/items"); // Redirect ke halaman daftar item setelah update
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar navigasi */}
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow border p-6">
          <button onClick={() => navigate("/items")} className="mb-4 flex items-center text-blue-500 hover:underline">
            <FaArrowLeft className="mr-2" /> Back
          </button>
          <h2 className="text-xl font-semibold mb-4">Edit Item Request</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <textarea name="desc" value={formData.desc} onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <input type="text" name="priceRange" value={formData.priceRange} onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <input type="url" name="referenceLink" value={formData.referenceLink} onChange={handleChange} className="border p-2 rounded-lg w-full" />
            <input type="text" name="code" value={formData.code} onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <select name="status" value={formData.status} onChange={handleChange} className="border p-2 rounded-lg w-full">
              <option value="PENDING">PENDING</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
            <div className="col-span-2 flex justify-end">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600">
                <FaSave /> <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
