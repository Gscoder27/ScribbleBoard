import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: "fas fa-users",
    title: "Real-time Collaboration",
    description: "Work together seamlessly with live cursors, instant updates, and synchronized changes.",
    gradient: "from-primary to-secondary"
  },
  {
    icon: "fas fa-comments",
    title: "Integrated Chat",
    description: "Communicate without leaving your canvas. Voice, text, and video chat built right in.",
    gradient: "from-secondary to-accent"
  },
  {
    icon: "fas fa-comments",
    title: "Team Presence",
    description: "See who's online and what they're working on with live cursors and user indicators.",
    gradient: "from-secondary to-accent"
  },
  {
    icon: "fas fa-th",
    title: "Infinite Canvas",
    description: "Never run out of space. Pan, zoom, and explore your ideas without boundaries.",
    gradient: "from-success to-primary"
  },
  {
    icon: "fas fa-mobile-alt",
    title: "Cross-Platform",
    description: "Access your boards from any device. Desktop, tablet, or mobile - we've got you covered.",
    gradient: "from-accent to-success"
  },
  {
    icon: "fas fa-magic",
    title: "Smart Tools",
    description: "AI-powered suggestions, shape recognition, and auto-organize features to enhance creativity.",
    gradient: "from-success to-secondary"
  }
];

export default function FeaturesSection() {
  return (
    <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              collaborate
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful features designed to make remote collaboration as natural as working side by side.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full border-2 border-transparent hover:border-primary/20 transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50 shadow-lg hover:shadow-xl">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-lg`}>
                    <i className={`${feature.icon} text-white text-2xl`}></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}