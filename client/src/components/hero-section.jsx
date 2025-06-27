import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Users, Zap } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-16 overflow-hidden">
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 blur-xl"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full opacity-15 blur-2xl"
          animate={{
            y: [0, 30, 0],
            x: [0, -15, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute bottom-40 left-1/4 w-16 h-16 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-25 blur-lg"
          animate={{
            y: [0, -25, 0],
            x: [0, 20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6"
          >
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-blue-200">
              <Sparkles className="w-4 h-4 mr-2" />
              New: Real-time collaboration is here!
            </Badge>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Create & Collaborate on an{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              Infinite Canvas
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform ideas into reality with real-time collaborative whiteboarding. 
            Design, brainstorm, and innovate together from anywhere in the world.
          </p>

          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6 mb-8 text-sm text-gray-600"
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span>Real-time collaboration</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-500" />
              <span>Lightning fast</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-500" />
              <span>AI-powered tools</span>
            </div>
          </motion.div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
            >
              Start Creating Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 backdrop-blur-sm"
            >
              Watch Demo
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