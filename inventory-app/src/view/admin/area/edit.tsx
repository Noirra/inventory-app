import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { FaArrowLeft, FaSave, } from "react-icons/fa";
import Sidebar from "@/components/ui/sidebar";
import { useNavigate, useParams } from "react-router-dom";
import fetchWithAuth from "@/utils/fetchInterceptor";

export default function EditArea() {
  const { areaId } = useParams<{ areaId: string }>();
  const navigate = useNavigate();

  const [area, setArea] = useState({
    name: "",
    code: "",
  });

  useEffect(() => {
    const fetchArea = async () => {
      try {
        const data = await fetchWithAuth(`/areas/${areaId}`);
  
        if (data && data.data) {
          setArea({
            name: data.data.name,
            code: data.data.code,
          });
        } else {
          console.warn("Area data is missing or malformed:", data);
        }
      } catch (error) {
        console.error("Failed to fetch area:", error);
      }
    };
  
    fetchArea();
  }, [areaId]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setArea({ ...area, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    try {
      const data = await fetchWithAuth(`/areas/${areaId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(area),
      });
  
      if (!data.success) {
        throw new Error(data.message || "Failed to update area");
      }
  
      navigate("/admin-dashboard/area?success=updated");
    } catch (error) {
      console.error("Failed to update area:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow border p-6">
          <button onClick={() => navigate("/admin-dashboard/area")} className="mb-4 flex items-center text-blue-500 hover:underline">
            <FaArrowLeft className="mr-2" /> Back
          </button>
          <h2 className="text-xl font-semibold mb-4">Edit Area</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <input type="text" name="name" value={area.name} placeholder="Area Name" onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <input type="text" name="code" value={area.code} placeholder="Area Code" onChange={handleChange} className="border p-2 rounded-lg w-full" required />

            <div className="col-span-1 flex justify-end">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600">
                <FaSave /> <span>Update Area</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
