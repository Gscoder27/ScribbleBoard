import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Collaborate on a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Digital Canvas
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Real-time collaborative whiteboarding with integrated chat. 
            Brainstorm, design, and create together from anywhere in the world.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              Start Drawing Now
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-200"
            >
              Learn More
            </Button>
          </div>
          
          {/* Enhanced Demo Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 px-6 py-4 border-b border-gray-200/50 flex items-center space-x-2">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full shadow-sm"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-sm"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full shadow-sm"></div>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-sm text-gray-700 font-medium">Scribble Board - Collaborative Workspace</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full border-2 border-white shadow-sm"></div>
                    <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-2 border-white shadow-sm"></div>
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full border-2 border-white shadow-sm"></div>
                  </div>
                  <span className="text-xs text-gray-500">3 active</span>
                </div>
              </div>
              
              <div className="h-96 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 relative overflow-hidden">
                {/* Interactive canvas mockup */}
                <div className="absolute inset-0 p-8">
                  {/* Floating shapes and elements */}
                  <motion.div
                    className="absolute top-12 left-12 w-24 h-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg shadow-md opacity-80"
                    animate={{
                      y: [0, -5, 0],
                      rotate: [0, 2, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  
                  <motion.div
                    className="absolute top-20 right-20 w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full shadow-md opacity-75"
                    animate={{
                      scale: [1, 1.1, 1],
                      x: [0, 10, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5,
                    }}
                  />
                  
                  <motion.div
                    className="absolute bottom-16 left-1/3 w-32 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full shadow-md opacity-70"
                    animate={{
                      y: [0, -8, 0],
                      skewX: [0, 5, 0],
                    }}
                    transition={{
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                  />
                  
                  {/* Animated drawing paths */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <motion.path
                      d="M 50 200 Q 150 100 250 200 T 350 200"
                      fill="none"
                      stroke="url(#gradient1)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{
                        duration: 2,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "reverse",
                        repeatDelay: 1,
                      }}
                    />
                    <defs>
                      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                
                {/* Live collaboration indicators */}
                <motion.div
                  className="absolute top-8 left-8 flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-sm"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-600 font-medium">Alex is drawing</span>
                </motion.div>
                
                <motion.div
                  className="absolute bottom-8 right-8 flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-sm"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-600 font-medium">Sarah added text</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}