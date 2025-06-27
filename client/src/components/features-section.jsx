import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Users, MessageCircle, Eye, Infinity, Smartphone, Sparkles, Zap, Palette, Lock } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Real-time Collaboration",
    description: "Work together seamlessly with live cursors, instant updates, and synchronized changes across all devices.",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
    borderColor: "border-blue-200"
  },
  {
    icon: MessageCircle,
    title: "Integrated Chat",
    description: "Communicate without leaving your canvas. Voice, text, and video chat built right in for seamless teamwork.",
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50",
    borderColor: "border-purple-200"
  },
  {
    icon: Eye,
    title: "Team Presence",
    description: "See who's online and what they're working on with live cursors and real-time user indicators.",
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-50 to-emerald-50",
    borderColor: "border-green-200"
  },
  {
    icon: Infinity,
    title: "Infinite Canvas",
    description: "Never run out of space. Pan, zoom, and explore your ideas without boundaries or limitations.",
    gradient: "from-orange-500 to-red-500",
    bgGradient: "from-orange-50 to-red-50",
    borderColor: "border-orange-200"
  },
  {
    icon: Palette,
    title: "Advanced Tools",
    description: "Professional drawing tools, shapes, text, sticky notes, and everything you need to bring ideas to life.",
    gradient: "from-indigo-500 to-purple-500",
    bgGradient: "from-indigo-50 to-purple-50",
    borderColor: "border-indigo-200"
  },
  {
    icon: Sparkles,
    title: "AI-Powered",
    description: "Smart suggestions, shape recognition, auto-organize features, and AI assistance to enhance creativity.",
    gradient: "from-yellow-500 to-orange-500",
    bgGradient: "from-yellow-50 to-orange-50",
    borderColor: "border-yellow-200"
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50/50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
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
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              create together
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Powerful features designed to make remote collaboration as natural and intuitive as working side by side.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <Card className={`h-full border-2 ${feature.borderColor} hover:shadow-2xl transition-all duration-300 bg-gradient-to-br ${feature.bgGradient} backdrop-blur-sm relative overflow-hidden`}>
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  
                  <CardContent className="p-8 text-center relative z-10">
                    <motion.div 
                      className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </motion.div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-gray-600 mb-6">
            Ready to experience the future of collaboration?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform"
          >
            Get Started Free
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}