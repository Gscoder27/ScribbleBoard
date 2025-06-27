import { motion } from "framer-motion";

export default function AnimatedBackground() {
  const floatingElements = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 4,
    duration: 15 + Math.random() * 10,
    size: 20 + Math.random() * 40,
  }));

  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 8 + Math.random() * 6,
  }));

  const gradientOrbs = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 20 + Math.random() * 15,
    size: 100 + Math.random() * 200,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Large gradient orbs */}
      {gradientOrbs.map((orb) => (
        <motion.div
          key={`orb-${orb.id}`}
          className="absolute rounded-full opacity-[0.03] blur-3xl"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            background: `linear-gradient(45deg, 
              hsl(${200 + orb.id * 30}, 70%, 60%), 
              hsl(${250 + orb.id * 25}, 80%, 65%)
            )`,
          }}
          animate={{
            x: [-30, 30, -30],
            y: [-20, 20, -20],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Floating geometric elements */}
      {floatingElements.map((element) => (
        <motion.div
          key={`element-${element.id}`}
          className="absolute opacity-[0.08]"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
          }}
          animate={{
            y: [-40, 40, -40],
            x: [-20, 20, -20],
            rotate: [0, 360],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {element.id % 3 === 0 && (
            <div 
              className="rounded-lg bg-gradient-to-br from-blue-400 to-purple-500"
              style={{ width: `${element.size}px`, height: `${element.size}px` }}
            />
          )}
          {element.id % 3 === 1 && (
            <div 
              className="rounded-full bg-gradient-to-br from-pink-400 to-orange-500"
              style={{ width: `${element.size}px`, height: `${element.size}px` }}
            />
          )}
          {element.id % 3 === 2 && (
            <div 
              className="transform rotate-45 bg-gradient-to-br from-green-400 to-cyan-500"
              style={{ width: `${element.size}px`, height: `${element.size}px` }}
            />
          )}
        </motion.div>
      ))}

      {/* Subtle floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={`particle-${particle.id}`}
          className="absolute w-1 h-1 bg-gray-400/20 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [-60, 60, -60],
            x: [-30, 30, -30],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Subtle grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />
    </div>
  );
}