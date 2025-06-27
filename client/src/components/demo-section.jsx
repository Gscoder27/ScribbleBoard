import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function DemoSection() {
  return (
    <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            See Scribble Board in{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Action
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Experience the power of real-time collaboration with our interactive demo.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <Card className="overflow-hidden shadow-2xl border-2 border-gray-200 bg-white">
            <div className="bg-gray-800 px-6 py-4 flex items-center space-x-2">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex-1 text-center">
                <span className="text-gray-300 text-sm font-medium">Scribble Board - Live Demo</span>
              </div>
            </div>
            
            <CardContent className="p-0">
              <div className="h-96 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
                {/* Interactive demo preview */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg"
                    >
                      <i className="fas fa-play text-white text-2xl"></i>
                    </motion.div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Interactive Demo</h3>
                    <p className="text-gray-600 mb-6">Click to start exploring Scribble Board</p>
                    <Button className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all duration-200">
                      Launch Demo
                    </Button>
                  </div>
                </div>

                {/* Animated collaboration indicators */}
                <motion.div
                  className="absolute top-4 left-4 flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm"
                  animate={{
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-700">3 users online</span>
                </motion.div>

                <motion.div
                  className="absolute bottom-4 right-4 flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm"
                  animate={{
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-700">Live chat</span>
                </motion.div>

                {/* Floating cursors simulation */}
                <motion.div
                  className="absolute w-4 h-4"
                  animate={{
                    x: [100, 300, 200, 150],
                    y: [100, 150, 200, 120],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="w-4 h-4 bg-blue-500 rounded-full shadow-lg transform rotate-45"></div>
                </motion.div>

                <motion.div
                  className="absolute w-4 h-4"
                  animate={{
                    x: [200, 100, 250, 180],
                    y: [200, 100, 180, 150],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                >
                  <div className="w-4 h-4 bg-green-500 rounded-full shadow-lg transform rotate-45"></div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}