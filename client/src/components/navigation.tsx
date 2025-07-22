import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useLocation } from "wouter";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [, navigate] = useLocation();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="relative z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden bg-white">
              <img
                src="/scribbleBoard_icon.png"
                alt="Scribble Board Logo"
                className="w-12 h-12 object-contain"
              />
            </div>
            <span className="text-2xl font-bold text-gray-900">Scribble Board</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                className="px-4 py-2 bg-[#7760f4] hover:bg-[#5f4acb] text-white rounded"
                onClick={() => navigate('/sboard')}
              >
                Start Scribbling
              </Button>
            </motion.div>
          </div>

          <button
            type="button"
            className="md:hidden text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            title={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white border-t border-gray-200 py-4"
        >
          <div className="max-w-7xl mx-auto px-4 space-y-4">
            <Button
              className="px-4 py-2 rounded bg-[#7760f4] hover:bg-[#5f4acb] text-white"
              onClick={() => navigate('/sboard')}
            >
              Start Scribbling
            </Button>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
