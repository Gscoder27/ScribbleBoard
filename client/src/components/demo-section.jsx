import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Users, MessageSquare, Zap, ArrowRight } from "lucide-react";

export default function DemoSection() {
  return (
    <section id="demo" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            See Scribble in{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Action
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Watch how teams collaborate in real-time, share ideas instantly, and create amazing things together.
          </p>
        </motion.div>

        {/* Main demo showcase */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-6xl mx-auto mb-16"
        >
          <Card className="overflow-hidden shadow-2xl border-2 border-gradient bg-white/80 backdrop-blur-sm">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                </div>
                <span className="text-gray-300 text-sm font-medium">Scribble Board - Live Collaboration</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-1">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full border-2 border-gray-800"></div>
                  <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-2 border-gray-800"></div>
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full border-2 border-gray-800"></div>
                </div>
                <span className="text-gray-400 text-xs">3 active</span>
              </div>
            </div>
            
            <CardContent className="p-0 relative">
              <div className="h-[500px] bg-gradient-to-br from-blue-50/80 via-white to-purple-50/80 relative overflow-hidden">
                {/* Enhanced interactive demo preview */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center relative z-10">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      animate={{
                        boxShadow: [
                          "0 10px 30px rgba(59, 130, 246, 0.3)",
                          "0 20px 40px rgba(147, 51, 234, 0.4)",
                          "0 10px 30px rgba(59, 130, 246, 0.3)"
                        ]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center cursor-pointer group"
                    >
                      <Play className="w-8 h-8 text-white group-hover:scale-110 transition-transform" fill="white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Try the Interactive Demo</h3>
                    <p className="text-gray-600 mb-8 max-w-md">Experience real-time collaboration in action. See how teams create, share, and innovate together.</p>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                      Launch Interactive Demo
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>

                {/* Enhanced collaboration indicators */}
                <motion.div
                  className="absolute top-6 left-6 flex items-center space-x-3 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-green-200"
                  animate={{
                    opacity: [0.8, 1, 0.8],
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <Users className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">5 users online</span>
                </motion.div>

                <motion.div
                  className="absolute top-6 right-6 flex items-center space-x-3 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-blue-200"
                  animate={{
                    opacity: [0.8, 1, 0.8],
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                >
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Live chat active</span>
                </motion.div>

                <motion.div
                  className="absolute bottom-6 left-6 flex items-center space-x-3 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-purple-200"
                  animate={{
                    opacity: [0.8, 1, 0.8],
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                >
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                  <Zap className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">Real-time sync</span>
                </motion.div>

                {/* Enhanced floating cursors */}
                <motion.div
                  className="absolute pointer-events-none"
                  animate={{
                    x: [120, 350, 280, 180],
                    y: [150, 200, 300, 180],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="relative">
                    <div className="w-5 h-5 bg-blue-500 rounded-full shadow-lg transform rotate-45 border-2 border-white"></div>
                    <div className="absolute -top-8 left-6 bg-blue-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      Alex
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute pointer-events-none"
                  animate={{
                    x: [250, 150, 300, 220],
                    y: [250, 150, 220, 180],
                  }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.5,
                  }}
                >
                  <div className="relative">
                    <div className="w-5 h-5 bg-green-500 rounded-full shadow-lg transform rotate-45 border-2 border-white"></div>
                    <div className="absolute -top-8 left-6 bg-green-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      Sarah
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute pointer-events-none"
                  animate={{
                    x: [180, 320, 200, 260],
                    y: [300, 180, 250, 200],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2.5,
                  }}
                >
                  <div className="relative">
                    <div className="w-5 h-5 bg-purple-500 rounded-full shadow-lg transform rotate-45 border-2 border-white"></div>
                    <div className="absolute -top-8 left-6 bg-purple-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      Mike
                    </div>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feature highlights below demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Collaboration</h3>
            <p className="text-gray-600 text-sm">See everyone's changes in real-time</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Communication</h3>
            <p className="text-gray-600 text-sm">Chat, voice, and video built-in</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
            <p className="text-gray-600 text-sm">Zero lag, instant responsiveness</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}