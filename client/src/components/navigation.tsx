import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <i className="fas fa-pencil-alt text-white text-lg"></i>
            </div>
            <span className="text-2xl font-bold text-gray-900">Scribble</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("features")}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("demo")}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Demo
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Contact
            </button>
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg hover:shadow-primary/30">
                Try Free
              </Button>
            </motion.div>
          </div>
          
          <button
            className="md:hidden text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
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
            <button
              onClick={() => scrollToSection("features")}
              className="block w-full text-left text-gray-600 hover:text-primary transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("demo")}
              className="block w-full text-left text-gray-600 hover:text-primary transition-colors"
            >
              Demo
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="block w-full text-left text-gray-600 hover:text-primary transition-colors"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="block w-full text-left text-gray-600 hover:text-primary transition-colors"
            >
              Contact
            </button>
            <Button className="w-full bg-primary text-white py-2 rounded-lg font-medium">
              Try Free
            </Button>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
