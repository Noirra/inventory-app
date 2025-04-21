import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { FaArrowLeft, FaSave, } from "react-icons/fa";
import Sidebar from "@/components/ui/sidebar";
import { useNavigate, useParams } from "react-router-dom";
import fetchWithAuth from "@/utils/fetchInterceptor";
import Swal from "sweetalert2";

export default function EditCategory() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  const [category, setCategory] = useState({
    name: "",
    code: "",
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await fetchWithAuth(`/categories/${categoryId}`);
  
        setCategory({
          code: data.data.code,
          name: data.data.name
        });
      } catch (error) {
        console.error("Failed to fetch category:", error);
      }
    };
  
    fetchCategory();
  }, [categoryId]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    try {
      const result = await fetchWithAuth(`/categories/${categoryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
      });
  
      if (!result.success) {
        throw new Error(result.message || "Failed to update category");
      }
  
      navigate("/admin-dashboard/category?success=updated");
    } catch (error: any) {
      const msg = error.message || "Terjadi kesalahan";

    const isDuplicate =
      msg.toLowerCase().includes("duplicate") ||
      msg.toLowerCase().includes("kode") && msg.toLowerCase().includes("sudah") ||
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
        title: "Gagal Memperbarui",
        text: msg,
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "OK",
      });
    }

    console.error("Failed to update category:", error);
  }
  };


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow border p-6">
          <button onClick={() => navigate("/admin-dashboard/category")} className="mb-4 flex items-center text-blue-500 hover:underline">
            <FaArrowLeft className="mr-2" /> Back
          </button>
          <h2 className="text-xl font-semibold mb-4">Edit Category</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label htmlFor="name" className="mb-1 font-medium text-gray-700">Category Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={category.name}
                  placeholder="Category Name"
                  onChange={handleChange}
                  className="border p-2 rounded-lg w-full"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="code" className="mb-1 font-medium text-gray-700">Category Code</label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={category.code}
                  placeholder="Category Code"
                  onChange={handleChange}
                  className="border p-2 rounded-lg w-full"
                  required
                />
              </div>
            </div>
            <div className="col-span-1 flex justify-end">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600">
                <FaSave /> <span>Update Category</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
