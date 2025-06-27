import { motion } from "framer-motion";
import { useState } from "react";

export default function DemoSection() {
  const [activeTool, setActiveTool] = useState("pencil");

  return (
    <section id="demo" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Try it yourself
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the power of real-time collaboration with our interactive demo
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-primary to-secondary p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h3 className="text-white text-xl font-semibold">Live Demo Board</h3>
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-3 h-3 bg-green-400 rounded-full"
                  ></motion.div>
                  <span className="text-white/90 text-sm">Live</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {/* Mock user avatars */}
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  J
                </div>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  S
                </div>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  +3
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col lg:grid lg:grid-cols-4 min-h-96">
            {/* Whiteboard Canvas */}
            <div className="lg:col-span-3 drawing-canvas bg-white relative p-4 sm:p-6 min-h-80 sm:min-h-96 order-1 lg:order-none">
              {/* Drawing Tools */}
              <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white rounded-xl shadow-lg p-2 flex flex-wrap gap-1 sm:gap-2 max-w-48 sm:max-w-none">
                {[
                  { id: "pencil", icon: "fas fa-pencil-alt", active: activeTool === "pencil" },
                  { id: "eraser", icon: "fas fa-eraser", active: activeTool === "eraser" },
                  { id: "square", icon: "fas fa-square", active: activeTool === "square" },
                  { id: "circle", icon: "fas fa-circle", active: activeTool === "circle" }
                ].map((tool) => (
                  <motion.button
                    key={tool.id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTool(tool.id)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-colors ${
                      tool.active
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <i className={`${tool.icon} text-xs sm:text-sm`}></i>
                  </motion.button>
                ))}
              </div>
              
              {/* Mock drawing content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute top-16 sm:top-20 left-4 sm:left-16 lg:left-20 w-36 sm:w-48 h-28 sm:h-32 border-2 sm:border-3 border-primary rounded-lg p-2 sm:p-4 bg-white shadow-sm"
              >
                <h4 className="text-primary font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Project Goals</h4>
                <ul className="text-xs sm:text-sm text-gray-700 space-y-0.5 sm:space-y-1">
                  <li>• Improve user experience</li>
                  <li>• Increase engagement</li>
                  <li>• Launch by Q2</li>
                </ul>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="absolute top-28 sm:top-32 right-4 sm:right-12 lg:right-20 w-28 sm:w-32 lg:w-40 h-28 sm:h-32 lg:h-40 bg-accent/10 rounded-full flex flex-col items-center justify-center border-2 border-accent"
              >
                <i className="fas fa-target text-accent text-lg sm:text-xl lg:text-2xl mb-1 sm:mb-2"></i>
                <span className="text-accent font-medium text-xs sm:text-sm lg:text-base">Target</span>
                <span className="text-accent text-xs sm:text-sm">Audience</span>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                className="absolute bottom-12 sm:bottom-16 lg:bottom-20 left-4 sm:left-1/2 sm:transform sm:-translate-x-1/2 bg-success/10 rounded-xl p-3 sm:p-4 border-2 border-success w-40 sm:min-w-48 max-w-56"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <i className="fas fa-check-circle text-success text-sm sm:text-base"></i>
                  <span className="text-success font-semibold text-sm sm:text-base">Action Items</span>
                </div>
                <div className="text-xs sm:text-sm text-gray-700 space-y-1">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="text-success rounded w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Research competitors</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="text-success rounded w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Create wireframes</span>
                  </div>
                </div>
              </motion.div>
              
              {/* Animated cursor */}
              <motion.div
                animate={{ 
                  x: [20, 40, 20],
                  y: [20, 0, 20]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-32 sm:top-36 lg:top-40 left-32 sm:left-36 lg:left-40 w-3 h-3 sm:w-4 sm:h-4 hidden sm:block"
              >
                <i className="fas fa-mouse-pointer text-secondary text-sm sm:text-base"></i>
                <div className="absolute -top-5 sm:-top-6 left-1 sm:left-2 bg-secondary text-white text-xs rounded px-1 sm:px-2 py-1 whitespace-nowrap">
                  Sarah
                </div>
              </motion.div>
            </div>
            
            {/* Chat Panel */}
            <div className="bg-gray-50 border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col min-h-64 lg:min-h-full order-2 lg:order-none">
              <div className="p-3 sm:p-4 border-b border-gray-200">
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Team Chat</h4>
              </div>
              <div className="flex-1 p-3 sm:p-4 space-y-2 sm:space-y-3 overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="flex items-start space-x-2"
                >
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-medium">
                    J
                  </div>
                  <div className="bg-white rounded-lg p-2 shadow-sm max-w-xs">
                    <p className="text-xs text-gray-800">Added the project goals section</p>
                    <span className="text-xs text-gray-500">2m ago</span>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 }}
                  className="flex items-start space-x-2"
                >
                  <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-white text-xs font-medium">
                    S
                  </div>
                  <div className="bg-white rounded-lg p-2 shadow-sm max-w-xs">
                    <p className="text-xs text-gray-800">Great! Working on the target audience circle now</p>
                    <span className="text-xs text-gray-500">1m ago</span>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.9 }}
                  className="flex items-start space-x-2"
                >
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-white text-xs font-medium">
                    M
                  </div>
                  <div className="bg-white rounded-lg p-2 shadow-sm max-w-xs">
                    <p className="text-xs text-gray-800">Should we add a timeline? 📅</p>
                    <span className="text-xs text-gray-500">30s ago</span>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center space-x-1 text-xs text-gray-500">
                    <motion.div
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-1.5 h-1.5 bg-success rounded-full"
                    ></motion.div>
                    <span>Mike is typing...</span>
                  </div>
                </motion.div>
              </div>
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white"
                  >
                    <i className="fas fa-paper-plane text-xs"></i>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
