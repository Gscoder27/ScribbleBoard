import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative z-10 pt-20 pb-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Collaborate in{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Real-Time
            </span>
            <br />
            with Scribble Board
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            The ultimate collaborative whiteboard tool with integrated chat. Brainstorm, design, and communicate seamlessly with your team, anywhere in the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.div
              whileHover={{ y: -2, boxShadow: "0 10px 20px rgba(99, 102, 241, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Button className="bg-primary text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg">
                <i className="fas fa-rocket mr-2"></i>
                Start Collaborating
              </Button>
            </motion.div>

          </div>
        </motion.div>
        
        {/* Hero Demo Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="glass-effect rounded-2xl p-8 shadow-2xl">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Mock Whiteboard */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-gray-100 px-4 py-3 border-b flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">Team Brainstorm</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <motion.i
                        whileHover={{ scale: 1.1 }}
                        className="fas fa-pencil-alt text-primary cursor-pointer transition-transform"
                      ></motion.i>
                      <motion.i
                        whileHover={{ color: "rgb(75, 85, 99)" }}
                        className="fas fa-eraser text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                      ></motion.i>
                      <motion.i
                        whileHover={{ color: "rgb(75, 85, 99)" }}
                        className="fas fa-shapes text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                      ></motion.i>
                      <motion.i
                        whileHover={{ color: "rgb(75, 85, 99)" }}
                        className="fas fa-font text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                      ></motion.i>
                    </div>
                  </div>
                  <div className="drawing-canvas h-64 relative bg-white p-4">
                    {/* Mock drawing elements */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className="absolute top-8 left-8 w-32 h-20 border-2 border-primary rounded-lg flex items-center justify-center"
                    >
                      <span className="text-primary font-medium">Ideas</span>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 }}
                      className="absolute top-8 right-8 w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center"
                    >
                      <i className="fas fa-lightbulb text-accent text-xl"></i>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9 }}
                      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-40 h-16 bg-success/20 rounded-lg flex items-center justify-center"
                    >
                      <span className="text-success font-medium">Solution</span>
                    </motion.div>
                    {/* Animated drawing line */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <motion.path
                        d="M 80 120 Q 150 80 220 120"
                        stroke="hsl(249, 88%, 67%)"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        opacity="0.7"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, delay: 1.2 }}
                      />
                      <motion.path
                        d="M 220 120 Q 280 80 320 140"
                        stroke="hsl(249, 88%, 67%)"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        opacity="0.7"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, delay: 1.5 }}
                      />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Mock Chat */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gray-100 px-4 py-3 border-b">
                  <h3 className="font-medium text-gray-700">Team Chat</h3>
                </div>
                <div className="h-64 p-4 space-y-3 overflow-y-auto">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex items-start space-x-2"
                  >
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                      A
                    </div>
                    <div className="chat-bubble chat-bubble-left bg-gray-200 rounded-lg px-3 py-2 max-w-xs">
                      <p className="text-sm text-gray-800">Great ideas! Let's add more details to the solution box.</p>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 }}
                    className="flex items-start space-x-2 justify-end"
                  >
                    <div className="chat-bubble chat-bubble-right bg-primary rounded-lg px-3 py-2 max-w-xs">
                      <p className="text-sm text-white">I'll sketch out the user flow now</p>
                    </div>
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white text-sm font-medium">
                      B
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 }}
                    className="flex items-start space-x-2"
                  >
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-sm font-medium">
                      C
                    </div>
                    <div className="chat-bubble chat-bubble-left bg-gray-200 rounded-lg px-3 py-2 max-w-xs">
                      <p className="text-sm text-gray-800">Perfect! This is coming together nicely 🚀</p>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                    className="text-center"
                  >
                    <div className="inline-flex items-center space-x-1 text-xs text-gray-500">
                      <motion.div
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-2 h-2 bg-success rounded-full"
                      ></motion.div>
                      <span>3 people online</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
