import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        className="floating-shape w-64 h-64 -top-32 -left-32"
        animate={{
          y: [0, -10, 5, 0],
          rotate: [0, 1, -1, 0],
        }}
        transition={{
          duration: 6,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
      <motion.div
        className="floating-shape w-48 h-48 top-1/4 right-0"
        animate={{
          y: [0, -10, 5, 0],
          rotate: [0, 1, -1, 0],
        }}
        transition={{
          duration: 6,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 2,
        }}
      />
      <motion.div
        className="floating-shape w-32 h-32 top-1/2 left-1/4"
        animate={{
          y: [0, -10, 5, 0],
          rotate: [0, 1, -1, 0],
        }}
        transition={{
          duration: 8,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 1,
        }}
      />
      <motion.div
        className="floating-shape w-40 h-40 bottom-0 right-1/4"
        animate={{
          y: [0, -10, 5, 0],
          rotate: [0, 1, -1, 0],
        }}
        transition={{
          duration: 6,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
      <motion.div
        className="floating-shape w-24 h-24 bottom-1/4 -right-12"
        animate={{
          y: [0, -10, 5, 0],
          rotate: [0, 1, -1, 0],
        }}
        transition={{
          duration: 6,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 2,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
    </div>
  );
}
