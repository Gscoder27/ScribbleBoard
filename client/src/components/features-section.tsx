import { motion } from "framer-motion";

const features = [
  {
    icon: "fas fa-paint-brush",
    title: "Real-time Drawing",
    description: "Draw, sketch, and create with infinite canvas space. See changes instantly as your team collaborates.",
    gradient: "from-primary to-secondary"
  },
  {
    icon: "fas fa-comments",
    title: "Integrated Chat",
    description: "Communicate without leaving your workspace. Share ideas and feedback in real-time.",
    gradient: "from-accent to-primary"
  },
  {
    icon: "fas fa-users",
    title: "Team Presence",
    description: "See who's online and what they're working on with live cursors and user indicators.",
    gradient: "from-secondary to-accent"
  },
  {
    icon: "fas fa-layer-group",
    title: "Infinite Canvas",
    description: "Never run out of space. Pan, zoom, and explore your ideas without boundaries.",
    gradient: "from-success to-primary"
  },
  {
    icon: "fas fa-save",
    title: "Auto-Save",
    description: "Never lose your work. Everything is automatically saved and synced across all devices.",
    gradient: "from-primary to-success"
  },
  {
    icon: "fas fa-share-alt",
    title: "Easy Sharing",
    description: "Share your boards with a simple link. Control permissions and collaborate securely.",
    gradient: "from-accent to-secondary"
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything you need for seamless collaboration
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to make remote teamwork feel natural and effortless
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                y: -5,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 cursor-pointer transition-all duration-300"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-lg flex items-center justify-center mb-4`}>
                <i className={`${feature.icon} text-white text-xl`}></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
