import { motion } from "framer-motion";

export default function AnimatedBackground() {
  const squares = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 10 + Math.random() * 5,
  }));

  const triangles = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 8 + Math.random() * 4,
  }));

  const dots = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 6 + Math.random() * 3,
  }));

  const circles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2.5,
    duration: 12 + Math.random() * 6,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Rotating squares */}
      {squares.map((square) => (
        <motion.div
          key={`square-${square.id}`}
          className="absolute w-4 h-4 bg-blue-200/20 border border-blue-300/30"
          style={{
            left: `${square.x}%`,
            top: `${square.y}%`,
          }}
          animate={{
            rotate: [0, 360],
            scale: [0.8, 1.2, 0.8],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: square.duration,
            delay: square.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Floating triangles */}
      {triangles.map((triangle) => (
        <motion.div
          key={`triangle-${triangle.id}`}
          className="absolute w-0 h-0"
          style={{
            left: `${triangle.x}%`,
            top: `${triangle.y}%`,
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderBottom: "12px solid rgba(34, 197, 94, 0.2)",
          }}
          animate={{
            y: [-10, 10, -10],
            rotate: [0, 180, 360],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: triangle.duration,
            delay: triangle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Floating dots */}
      {dots.map((dot) => (
        <motion.div
          key={`dot-${dot.id}`}
          className="absolute w-2 h-2 bg-purple-300/40 rounded-full"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-5, 5, -5],
            scale: [0.5, 1, 0.5],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: dot.duration,
            delay: dot.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Pulsing circles */}
      {circles.map((circle) => (
        <motion.div
          key={`circle-${circle.id}`}
          className="absolute w-6 h-6 border-2 border-orange-300/30 rounded-full"
          style={{
            left: `${circle.x}%`,
            top: `${circle.y}%`,
          }}
          animate={{
            scale: [0.5, 1.5, 0.5],
            opacity: [0.2, 0.5, 0.2],
            rotate: [0, -360],
          }}
          transition={{
            duration: circle.duration,
            delay: circle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}