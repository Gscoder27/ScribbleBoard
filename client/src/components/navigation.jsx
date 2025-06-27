import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Palette, ArrowRight } from "lucide-react";

export default function Navigation() {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/30 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18 py-3">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">Scribble</span>
              <Badge variant="secondary" className="ml-2 text-xs px-2 py-0.5 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-blue-200">
                Beta
              </Badge>
            </div>
          </motion.div>
          
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-6">
              <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">
                Features
              </a>
              <a href="#demo" className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">
                Demo
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">
                Pricing
              </a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">
                Contact
              </a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 font-medium"
            >
              Sign In
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group"
            >
              Try Free
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}