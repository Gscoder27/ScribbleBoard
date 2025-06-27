import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Floating circles */}
      <motion.div
        className="floating-shape w-64 h-64 -top-32 -left-32"
        animate={{
          y: [0, -15, 10, 0],
          rotate: [0, 2, -2, 0],
        }}
        transition={{
          duration: 8,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
      <motion.div
        className="floating-shape w-48 h-48 top-1/4 right-0"
        animate={{
          y: [0, -12, 8, 0],
          rotate: [0, -1.5, 1.5, 0],
        }}
        transition={{
          duration: 7,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 2,
        }}
      />
      <motion.div
        className="floating-shape w-32 h-32 top-1/2 left-1/4"
        animate={{
          y: [0, -8, 5, 0],
          rotate: [0, 3, -3, 0],
        }}
        transition={{
          duration: 9,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 1,
        }}
      />
      <motion.div
        className="floating-shape w-40 h-40 bottom-0 right-1/4"
        animate={{
          y: [0, -10, 6, 0],
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
          y: [0, -14, 7, 0],
          rotate: [0, 2.5, -2.5, 0],
        }}
        transition={{
          duration: 8,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 3,
        }}
      />

      {/* Rotating squares */}
      <motion.div
        className="absolute w-20 h-20 top-10 left-1/3"
        style={{
          background: "linear-gradient(45deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))",
          borderRadius: "8px",
        }}
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 12,
          ease: "linear",
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute w-16 h-16 top-3/4 left-2/3"
        style={{
          background: "linear-gradient(45deg, rgba(6, 182, 212, 0.1), rgba(99, 102, 241, 0.1))",
          borderRadius: "6px",
        }}
        animate={{
          rotate: [360, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 10,
          ease: "linear",
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute w-12 h-12 top-1/3 right-10"
        style={{
          background: "linear-gradient(45deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1))",
          borderRadius: "4px",
        }}
        animate={{
          rotate: [0, 360],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 8,
          ease: "linear",
          repeat: Infinity,
        }}
      />

      {/* Triangle shapes */}
      <motion.div
        className="absolute w-0 h-0 top-1/2 right-1/3"
        style={{
          borderLeft: "15px solid transparent",
          borderRight: "15px solid transparent",
          borderBottom: "26px solid rgba(99, 102, 241, 0.1)",
        }}
        animate={{
          rotate: [0, 120, 240, 360],
          y: [0, -10, 5, 0],
        }}
        transition={{
          duration: 15,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute w-0 h-0 bottom-1/3 left-1/5"
        style={{
          borderLeft: "12px solid transparent",
          borderRight: "12px solid transparent",
          borderBottom: "20px solid rgba(6, 182, 212, 0.1)",
        }}
        animate={{
          rotate: [360, 240, 120, 0],
          y: [0, -8, 4, 0],
        }}
        transition={{
          duration: 13,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 2,
        }}
      />

      {/* Floating dots */}
      <motion.div
        className="absolute w-3 h-3 bg-primary/20 rounded-full top-1/4 left-1/2"
        animate={{
          y: [0, -20, 10, 0],
          opacity: [0.2, 0.6, 0.2],
        }}
        transition={{
          duration: 6,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute w-2 h-2 bg-secondary/30 rounded-full top-2/3 left-3/4"
        animate={{
          y: [0, -15, 8, 0],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 5,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 1,
        }}
      />
      <motion.div
        className="absolute w-4 h-4 bg-accent/20 rounded-full bottom-1/2 left-1/6"
        animate={{
          y: [0, -12, 6, 0],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 7,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 3,
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
    </div>
  );
}
