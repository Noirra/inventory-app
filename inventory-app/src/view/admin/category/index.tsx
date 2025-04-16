  import { useState, useEffect } from "react";
  import Sidebar from "@/components/ui/sidebar";
  import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
  import Pagination from "@/components/ui/pagination";
  import Notification from "@/components/ui/notification";
  import { useNavigate } from "react-router-dom";
  import Swal from "sweetalert2";
  import fetchWithAuth from "@/utils/fetchInterceptor";
  import CreateCategoryModal from "@/view/admin/category/create";

  interface Categories {
    id: string;
    code: string;
    name: string;
  }

  export default function AdminCategory() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Categories[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [searchQuery, setSearchQuery] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<"create" | "edit">("create");
    const [selectedCategory, setSelectedCategory] = useState<Categories | null>(null);

    const handleCloseNotification = () => {
      setMessage("");
    };

    const fetchData = async () => {
      setLoading(true);
      try {
        const responseToJson = await fetchWithAuth("/categories");
        console.log("Fetched categories:", responseToJson);

        if (Array.isArray(responseToJson.data)) {
          setCategories(responseToJson.data);
        } else {
          console.error("Unexpected response format:", responseToJson);
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchData();

      const params = new URLSearchParams(window.location.search);
      const successMessage = params.get("success");

      if (successMessage) {
        const message =
          successMessage === "created"
            ? "Category added successfully!"
            : successMessage === "updated"
            ? "Category updated successfully!"
            : "";

        if (message) {
          setMessage(message);
          setTimeout(() => setMessage(""), 3000);
          navigate("/admin-dashboard/category", { replace: true });
        }
      }

      setTimeout(() => setIsVisible(true), 10);
    }, []);

    const deleteCategory = async (id: string) => {
      const confirmDelete = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });

      if (confirmDelete.isConfirmed) {
        try {
          await fetchWithAuth(`/categories/${id}`, { method: "DELETE" });
          fetchData();
          Swal.fire("Deleted!", "Category has been deleted.", "success");
        } catch (error) {
          console.error("Failed to delete category:", error);
          Swal.fire("Error", "Failed to delete category.", "error");
        }
      }
    };

    const filteredCategories = categories.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const displayedCategories = (filteredCategories || categories).slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    const totalPages = Math.ceil((filteredCategories || categories).length / itemsPerPage);

    const handleAddCategory = () => {
      setModalType("create");
      setSelectedCategory(null);
      setShowModal(true);
    };

    const handleEditCategory = (category: Categories) => {
      setModalType("edit");
      setSelectedCategory(category);
      setShowModal(true);
    };

    const handleCategorySuccess = async () => {
      await fetchData();       
      setShowModal(false);    
      setMessage("Berhasil disimpan!");
      setTimeout(() => setMessage(""), 3000);
    };
    

    return (
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Category Management</h1>
          </div>

          <div className={`bg-white p-6 rounded-2xl shadow border transition-all duration-200 ${isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
            <h2 className="text-lg font-semibold mb-4">Category List</h2>
            <Notification message={message} onClose={handleCloseNotification} />
            <div className="flex justify-between mb-4">
              <input
                type="text"
                placeholder="Search category..."
                className="border p-2 rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <button
                onClick={handleAddCategory}
                className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600"
              >
                <FaPlus /> <span>Add Category</span>
              </button>
            </div>

            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3 border">No</th>
                  <th className="p-3 border">Name</th>
                  <th className="p-3 border">Code</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-3 text-center text-gray-500">
                      Loading data...
                    </td>
                  </tr>
                ) : displayedCategories.length > 0 ? (
                  displayedCategories.map((category, index) => (
                    <tr key={category.id} className="border">
                      <td className="p-3 border text-center">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="p-3 border text-center">{category.name}</td>
                      <td className="p-3 border text-center">{category.code}</td>
                      <td className="p-3 border text-center space-x-2">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => deleteCategory(category.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-3 text-center text-gray-500">
                      No categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="mt-4">
              <Pagination currentPage={currentPage} totalPages={totalPages} changePage={setCurrentPage} />
            </div>
          </div>

          {showModal && (
            <CreateCategoryModal
              onClose={() => setShowModal(false)}
              onSuccess={handleCategorySuccess}
              category={selectedCategory}
              modalType={modalType}
            />
          )}
        </div>
      </div>
    );
  }
