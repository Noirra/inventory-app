import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  changePage: (newPage: number) => void;
}

const Pagination = ({ currentPage, totalPages, changePage }: PaginationProps) => {
  return (
    <motion.div 
      className="flex justify-end mt-4 pr-4"
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }}
    >
      <div className="flex space-x-2 items-center bg-white p-2 rounded-lg shadow-lg">
        <button 
          onClick={() => changePage(currentPage - 1)} 
          disabled={currentPage === 1} 
          className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
        >
          <FaChevronLeft />
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button 
            key={index + 1} 
            onClick={() => changePage(index + 1)} 
            className={`px-3 py-2 rounded-lg transition ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button 
          onClick={() => changePage(currentPage + 1)} 
          disabled={currentPage === totalPages} 
          className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
        >
          <FaChevronRight />
        </button>
      </div>
    </motion.div>
  );
};

export default Pagination;
