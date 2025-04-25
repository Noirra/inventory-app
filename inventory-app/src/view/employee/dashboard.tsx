import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar/employee";
import { FaSearch, FaBox, FaBoxOpen, FaThLarge, FaUsers } from "react-icons/fa";
import fetchWithAuth from "@/utils/fetchInterceptor";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

type Product = {
  id: string;
  name: string;
  price: number;
  status: "USED" | "UNUSED";
  photo?: string;
  code: string;
  receipt?: string;
  examinationPeriodDate: string;
  examinationPeriodMonth: number;
};

export default function EmployeeDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [userCount, setUserCount] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [itemrequestCount, setItemRequestCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [items, setItems] = useState<Product[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const fetchCounts = async () => {
      try {
        const [userData, itemData, itemrequestData, categoryData] =
          await Promise.all([
            fetchWithAuth("/users"),
            fetchWithAuth(`/user-items/user/${userId}`),
            fetchWithAuth("/item-request"),
            fetchWithAuth("/categories"),
          ]);

        if (userData.success && Array.isArray(userData.users)) {
          setUserCount(userData.users.length);
        }

        if (itemData.success && Array.isArray(itemData.data)) {
          const extractedItems = itemData.data
            .map((entry: any) => entry.item)
            .filter((item: any) => item !== null);
          setItemCount(extractedItems.length);
          setItems(extractedItems);
        }

        if (itemrequestData.success && Array.isArray(itemrequestData.data)) {
          setItemRequestCount(itemrequestData.data.length);
        }

        if (categoryData.success && Array.isArray(categoryData.data)) {
          setCategoryCount(categoryData.data.length);
        }

        setLoadingItems(false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setLoadingItems(false); // fix utama!
      }
    };

    fetchCounts();
  }, []);

  const filteredProducts = items.filter((product) =>
    (product.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log("Items:", items);
  console.log("Filtered:", filteredProducts);
  console.log("Loading:", loadingItems);

  const summaryCards = [
    {
      title: "Total Users",
      value: userCount,
      icon: <FaUsers className="text-green-500" />,
      borderColor: "border-green-500",
    },
    {
      title: "Items",
      value: itemCount,
      icon: <FaBox className="text-blue-500" />,
      borderColor: "border-blue-500",
    },
    {
      title: "Item Request",
      value: itemrequestCount,
      icon: <FaBoxOpen className="text-purple-500" />,
      borderColor: "border-purple-500",
    },
    {
      title: "Category",
      value: categoryCount,
      icon: <FaThLarge className="text-red-500" />,
      borderColor: "border-red-500",
    },
  ];

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="bg-gray-100 text-gray-800 flex h-screen">
  <Sidebar />
  <div className="flex-1 p-6 flex flex-col overflow-hidden">
    
    {/* Header: Banner dan Title */}
    <div className="flex-shrink-0">
      <div className="relative rounded-2xl mb-6 overflow-hidden shadow-lg">
        <img
          src="/banner-user.jpg"
          alt="Welcome Banner"
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent p-6 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-1 drop-shadow">
            Welcome back! 🎉
          </h1>
          <p className="text-gray-600 font-medium">
            Here's a summary of your inventory.
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">📦 Your Items</h2>
    </div>

    {/* Scrollable Items Section */}
    <div className="flex-1 overflow-y-auto pr-2">
      {loadingItems ? (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">Loading items...</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 hover:shadow-xl text-sm"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={
                    product.photo
                      ? `https://inventory.bariqfirjatullah.my.id/${product.photo}`
                      : "/default-image.png"
                  }
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="text-base font-semibold text-gray-800 truncate">
                  {product.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <img
            src="/no-data.svg"
            alt="No items"
            className="w-40 mx-auto mb-4"
          />
          <p className="text-gray-500">No items found.</p>
        </div>
      )}
    </div>

    {/* Tips Section - Fixed at bottom */}
    <div className="mt-6 p-6 bg-white rounded-2xl shadow text-center flex-shrink-0">
      <h3 className="text-lg font-semibold mb-2 text-blue-700">
        💡 Inventory Tips
      </h3>
      <p className="text-gray-600">
        Stay organized by regularly checking and updating your items. Happy
        managing!
      </p>
    </div>
  </div>
</div>
  );
}
