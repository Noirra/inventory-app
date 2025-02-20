import { useState, ChangeEvent, FormEvent } from "react";
import { FaArrowLeft, FaSave, FaSignOutAlt, FaChartBar, FaUsers, FaBox, FaThLarge, FaMapMarkedAlt, FaCog } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";

export default function CreateItem() {
  const navigate = useNavigate();
  const [item, setItem] = useState({
    categoryId: "",
    areaId: "",
    name: "",
    price: "",
    receipt: "",
    status: "UNUSED",
    code: "",
    examinationPeriod: "",
    groupCode: "",
  });
  const [photo, setPhoto] = useState<File | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(item).forEach(([key, value]) => formData.append(key, value));
    if (photo) formData.append("photo", photo);

    // Simulasi submit - di sini Anda bisa melakukan POST request ke backend menggunakan fetch atau axios
    console.log("Item Created:", { ...item, photo });

    navigate("/items");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-[#0A2342] text-white flex flex-col p-4">
        <h2 className="text-lg font-semibold">Admin Panel</h2>
        <nav className="flex-1 py-4 space-y-2">
          <Link to="/admindashboard" className="flex items-center px-4 py-2 hover:bg-[#173E67] rounded-lg space-x-4"><FaChartBar /><span>Dashboard</span></Link>
          <Link to="/users" className="flex items-center px-4 py-2 hover:bg-[#173E67] rounded-lg space-x-4"><FaUsers /><span>Users</span></Link>
          <Link to="/item" className="flex items-center px-4 py-2 hover:bg-[#173E67] rounded-lg space-x-4"><FaBox /><span>Inventory</span></Link>
          <Link to="/category" className="flex items-center px-4 py-2 hover:bg-[#173E67] rounded-lg space-x-4"><FaThLarge /><span>Category</span></Link>
          <Link to="/area" className="flex items-center px-4 py-2 hover:bg-[#173E67] rounded-lg space-x-4"><FaMapMarkedAlt /><span>Area</span></Link>
          <Link to="/settings" className="flex items-center px-4 py-2 hover:bg-[#173E67] rounded-lg space-x-4"><FaCog /><span>Settings</span></Link>
        </nav>
        <button onClick={() => navigate("/login")} className="w-full flex items-center justify-center py-2 rounded-2xl bg-red-500 hover:bg-red-600 space-x-2">
          <FaSignOutAlt /><span>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow border p-6">
          <button onClick={() => navigate("/items")} className="mb-4 flex items-center text-blue-500 hover:underline">
            <FaArrowLeft className="mr-2" /> Back
          </button>
          <h2 className="text-xl font-semibold mb-4">Create New Item</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4" encType="multipart/form-data">
            <input type="text" name="name" placeholder="Item Name" onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <input type="text" name="categoryId" placeholder="Category ID" onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <input type="text" name="areaId" placeholder="Area ID" onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <input type="number" name="price" placeholder="Price" onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <input type="file" name="photo" accept="image/*" onChange={handleFileChange} className="border p-2 rounded-lg w-full" required />
            <input type="text" name="receipt" placeholder="Receipt URL" onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <input type="text" name="code" placeholder="Item Code" onChange={handleChange} className="border p-2 rounded-lg w-full" required />
            <select name="status" onChange={handleChange} className="border p-2 rounded-lg w-full">
              <option value="UNUSED">UNUSED</option>
              <option value="USED">USED</option>
              <option value="BROKEN">BROKEN</option>
              <option value="REPAIRED">REPAIRED</option>
            </select>
            <input type="text" name="examinationPeriod" placeholder="Examination Period" onChange={handleChange} className="border p-2 rounded-lg w-full" />
            <input type="text" name="groupCode" placeholder="Group Code" onChange={handleChange} className="border p-2 rounded-lg w-full" />

            <div className="col-span-2 flex justify-end">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600">
                <FaSave /> <span>Save Item</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}