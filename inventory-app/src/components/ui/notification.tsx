import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaTimesCircle, FaTimes } from "react-icons/fa";

interface NotificationProps {
  message: string | null;
  type?: "success" | "error";
  duration?: number;
  onClose: () => void;
}

const Notification = ({ message, type = "success", duration = 4000, onClose }: NotificationProps) => {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        if (!hovered) {
          setVisible(false);
          onClose(); // Hanya menutup jika tidak sedang di-hover
        }
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setVisible(false); // Jika message kosong, pastikan notifikasi tersembunyi
    }
  }, [message, duration, hovered, onClose]);

  if (!visible || !message) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: 50, opacity: 0, scale: 0.9 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: 50, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`fixed top-5 right-5 flex items-center space-x-3 p-4 rounded-xl shadow-lg text-white 
            ${type === "success" ? "bg-green-500" : "bg-red-500"}
          `}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {type === "success" ? (
            <FaCheckCircle className="text-white text-lg" />
          ) : (
            <FaTimesCircle className="text-white text-lg" />
          )}
          <span className="font-medium">{message}</span>

          {/* Tombol Close */}
          <button
            onClick={() => {
              setVisible(false);
              onClose();
            }}
            className="ml-2 focus:outline-none"
          >
            <FaTimes className="text-white hover:text-gray-200 transition duration-200" />
          </button>

          {/* Progress Bar */}
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: duration / 1000, ease: "linear" }}
            className="absolute bottom-0 left-0 h-1 bg-white opacity-50 rounded-full"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
