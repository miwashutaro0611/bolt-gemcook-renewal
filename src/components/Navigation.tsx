import { useState } from 'react';
import { Sparkles, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { MoonGem } from './MoonGem';

const menuItems = [
  { title: 'MISSION', href: '#mission' },
  { title: 'WORKS', href: '#works' },
  { title: 'TEAM', href: '#team' },
  { title: 'NEWS', href: '#news' },
  { title: 'BLOG', href: '#blog' },
  { title: 'TECH BLOG', href: '#tech-blog' },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuVariants = {
    hidden: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      x: -50,
      transition: {
        duration: 0.3,
        ease: [0.36, 0, 0.66, -0.56],
      },
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.36, 0, 0.66, 1],
      },
    },
  };

  return (
    <>
      <motion.button
        onClick={toggleMenu}
        className="fixed top-4 md:top-8 right-4 md:right-8 z-50 p-2 rounded-full bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        whileHover={{ scale: 1.1, rotate: isOpen ? 0 : 180 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <Star className="w-5 h-5 md:w-6 md:h-6 text-white" />
        ) : (
          <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ clipPath: 'circle(0% at calc(100% - 2.5rem) 2.5rem)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 2.5rem) 2.5rem)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 2.5rem) 2.5rem)' }}
            transition={{ duration: 0.5, ease: [0.36, 0, 0.66, 1] }}
            className="fixed inset-0 z-40 bg-gradient-to-b from-black/95 to-indigo-950/95 backdrop-blur-md"
          >
            <div className="absolute right-0 bottom-0 w-[300px] h-[300px] md:w-[400px] md:h-[400px] opacity-75 pointer-events-none">
              <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} intensity={1.5} />
                <MoonGem isHovered={hoveredItem !== null} />
              </Canvas>
            </div>
            
            <nav className="h-full flex flex-col justify-center px-8 md:px-16">
              <motion.ul
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-6 md:space-y-8"
              >
                {menuItems.map((item) => (
                  <motion.li
                    key={item.title}
                    variants={itemVariants}
                    className="overflow-hidden"
                  >
                    <motion.a
                      href={item.href}
                      className="group relative inline-flex items-center text-3xl md:text-5xl font-light tracking-wider"
                      onClick={toggleMenu}
                      onMouseEnter={() => setHoveredItem(item.title)}
                      onMouseLeave={() => setHoveredItem(null)}
                      whileHover={{ x: 20 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                      }}
                    >
                      <span className="relative z-10 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#FA6681] group-hover:to-[#FA6681] transition-all duration-500">
                        {item.title}
                      </span>
                      <motion.div
                        className="absolute inset-0 -z-10"
                        initial={false}
                        whileHover={{
                          background: "radial-gradient(circle at left, rgba(250,102,129,0.2), rgba(250,102,129,0) 50%)",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 25
                        }}
                      />
                    </motion.a>
                  </motion.li>
                ))}
              </motion.ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}