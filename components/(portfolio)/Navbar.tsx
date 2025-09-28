"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
} from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  Home,
  User,
  GraduationCap,
  Briefcase,
  FolderOpen,
  Star,
  Mail,
  Award,
} from "lucide-react";
import { useMediaQuery } from 'react-responsive';

const navigation = [
  { name: "Introduction", href: "#hero", icon: <Home size={16} /> },
  { name: "Education", href: "#education", icon: <GraduationCap size={16} /> },
  { name: "Experience", href: "#experience", icon: <Briefcase size={16} /> },
  { name: "Projects", href: "#projects", icon: <FolderOpen size={16} /> },
  { name: "Skills", href: "#skills", icon: <Star size={16} /> },
  { name: "Certifications", href: "#certifications", icon: <Award size={16} /> },
  { name: "Contact", href: "#contact", icon: <Mail size={16} /> },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [mounted, setMounted] = useState(false);
  const [activeCVUrl, setActiveCVUrl] = useState<string | null>("#");
  
  // Detect mobile devices - only after hydration
  const isMobile = useMediaQuery({ maxWidth: 768 });

  // Prevent hydration mismatch by ensuring consistent initial state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch active CV file
  useEffect(() => {
    const fetchActiveCV = async () => {
      try {
        const response = await fetch('/api/cv/active');
        if (response.ok) {
          const activeCV = await response.json();
          if (activeCV && activeCV.file_url) {
            setActiveCVUrl(activeCV.file_url);
          } else {
            // No active CV available
            setActiveCVUrl(null);
          }
        }
      } catch (error) {
        console.error('Error fetching active CV:', error);
        // Set to null if fetch fails
        setActiveCVUrl(null);
      }
    };

    if (mounted) {
      fetchActiveCV();
    }
  }, [mounted]);
  
  const { scrollYProgress } = useScroll();
  
  // Enhanced spring animations with different characteristics
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 40,
    restDelta: 0.001,
  });
  
  // Delayed scroll progress for premium feel
  const delayedScrollProgress = useSpring(scrollYProgress, {
    stiffness: 30,
    damping: 50,
    restDelta: 0.001,
  });
  
  // Scroll-based background opacity
  const backgroundOpacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.2],
    [0, 0.5, 0.9]
  );
  
  const backdropBlur = useTransform(
    scrollYProgress,
    [0, 0.1, 0.2],
    [0, 8, 16]
  );

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled(scrolled);
    };
    
    // Throttle scroll events for better performance
    let ticking = false;
    const optimizedScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener("scroll", optimizedScrollHandler, { passive: true });
    return () => window.removeEventListener("scroll", optimizedScrollHandler);
  }, []);

  // Enhanced active section detection
  useEffect(() => {
    const handleActiveSection = () => {
      const sections = navigation.map(nav => nav.href.substring(1));
      let current = "";
      
      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            current = section;
          }
        }
      });
      
      setActiveSection(current);
    };
    
    window.addEventListener("scroll", handleActiveSection, { passive: true });
    return () => window.removeEventListener("scroll", handleActiveSection);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 80,
          damping: 25,
          duration: 1.2,
          ease: [0.25, 0.46, 0.45, 0.94] 
        }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isScrolled
            ? "bg-white/10 backdrop-blur-lg shadow-[0_0_30px_rgba(88,86,214,0.4)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <motion.div
              className="flex-shrink-0 relative"
              whileHover={mounted && !isMobile ? { 
                scale: 1.08,
                rotate: [0, -1, 1, 0],
              } : {}}
              transition={{ 
                scale: { type: "spring", stiffness: 400, damping: 15 },
                rotate: { duration: 0.6, ease: "linear" }
              }}
            >
              <Link
                href="/"
                className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent hover:from-pink-400 hover:via-purple-400 hover:to-blue-400 transition-all duration-300"
              >
                Anuradha
              </Link>
              
              {/* Logo accent dot */}
              <motion.div
                className="absolute -top-1 -right-2 w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  delay: 0.5,
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
                whileHover={{ 
                  scale: 1.5,
                  boxShadow: "0 0 10px rgba(168, 85, 247, 0.6)"
                }}
              />
            </motion.div>

            {/* Desktop Navigation */}
            {mounted && !isMobile && (
              <div className="hidden md:flex flex-1 items-center justify-center">
                <div className="flex items-center space-x-1">
                  {navigation.map((item, idx) => (
                    <motion.button
                      key={item.name}
                      onClick={() => scrollToSection(item.href)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-500 ease-out hover:bg-white/10 relative group overflow-hidden ${
                        activeSection === item.href.substring(1) 
                          ? 'text-white bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 shadow-lg ring-2 ring-blue-400/60 shadow-blue-500/25' 
                          : 'text-white/80 hover:text-white'
                      }`}
                      whileHover={{ 
                        scale: 1.08,
                        y: -2,
                      }}
                      whileTap={{ 
                        scale: 0.95,
                        y: 0,
                      }}
                      initial={{ opacity: 0, y: -20, rotateX: -15 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{ 
                        delay: 0.2 + idx * 0.08,
                        type: "spring",
                        stiffness: 150,
                        damping: 20,
                        duration: 0.8,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                    >
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.2 }}
                        transition={{ 
                          type: "spring",
                          stiffness: 300,
                          damping: 20
                        }}
                      >
                        {item.icon}
                      </motion.div>
                      {item.name}
                      
                      {/* Enhanced gradient underline with animation */}
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-[length:200%_200%] origin-center"
                        initial={{ scaleX: 0, backgroundPosition: "0% 50%" }}
                        whileHover={{ 
                          scaleX: 1,
                          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                        }}
                        transition={{ 
                          scaleX: { type: "spring", stiffness: 400, damping: 30 },
                          backgroundPosition: { 
                            duration: 2,
                            ease: "linear",
                            repeat: Infinity
                          }
                        }}
                      />
                      
                      {/* Floating particles effect on hover */}
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      >
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-gradient-to-r from-pink-400 to-blue-400 rounded-full"
                            initial={{ 
                              x: "50%", 
                              y: "50%", 
                              scale: 0,
                              opacity: 0 
                            }}
                            whileHover={{
                              x: `${50 + (i - 1) * 30}%`,
                              y: `${30 + i * 20}%`,
                              scale: [0, 1, 0],
                              opacity: [0, 1, 0],
                            }}
                            transition={{
                              duration: 1.5,
                              delay: i * 0.1,
                              repeat: Infinity,
                              repeatDelay: 0.5,
                            }}
                          />
                        ))}
                      </motion.div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Resume Button */}
            {mounted && !isMobile && (
              <motion.div 
                className="hidden md:flex items-center ml-6"
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                whileHover={{ 
                  scale: 1.05,
                  rotate: [0, -2, 2, 0],
                }}
                whileTap={{ scale: 0.95 }}
                transition={{
                  delay: 0.8,
                  scale: { type: "spring", stiffness: 180, damping: 20 },
                  rotate: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
                }}
              >
                {activeCVUrl ? (
                  <Button variant="premium" size="sm" glow asChild>
                    <a
                      href={activeCVUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2"
                    >
                      <span>Download Resume</span>
                    </a>
                  </Button>
                ) : (
                  <Button variant="premium" size="sm" glow disabled>
                    <span>No Resume Available</span>
                  </Button>
                )}
              </motion.div>
            )}

            {/* Mobile Menu Button */}
            {mounted && isMobile && (
              <motion.div 
                className="md:hidden"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: 0.6,
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
              >
                <motion.button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-white/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 p-3 rounded-lg hover:bg-white/10 transition-all duration-300 relative overflow-hidden"
                  whileTap={{ scale: 0.85 }}
                  whileHover={{ 
                    scale: 1.1,
                    rotate: isMobileMenuOpen ? 0 : [0, -10, 10, 0],
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                  }}
                  style={{ minWidth: '44px', minHeight: '44px' }}
                  aria-label="Toggle menu"
                >
                  <motion.svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    animate={isMobileMenuOpen ? { rotate: 180 } : { rotate: 0 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }}
                  >
                    {isMobileMenuOpen ? (
                      <motion.path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    ) : (
                      <motion.g>
                        <motion.path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.2, delay: 0 }}
                        />
                        <motion.path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 12h16"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.2, delay: 0.1 }}
                        />
                        <motion.path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 18h16"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.2, delay: 0.2 }}
                        />
                      </motion.g>
                    )}
                  </motion.svg>
                  
                  {/* Ripple effect */}
                  <motion.div
                    className="absolute inset-0 rounded-lg bg-white/20"
                    initial={{ scale: 0, opacity: 0 }}
                    whileTap={{ 
                      scale: [0, 1.5],
                      opacity: [0.5, 0],
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence mode="wait">
          {mounted && isMobile && isMobileMenuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ 
                opacity: 0, 
                y: -30,
                scale: 0.95
              }}
              animate={{ 
                opacity: 1, 
                y: 0,
                scale: 1
              }}
              exit={{ 
                opacity: 0, 
                y: -30,
                scale: 0.98
              }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 0.8
              }}
              className="md:hidden bg-white/10 backdrop-blur-xl border-t border-white/20 shadow-2xl overflow-hidden"
            >
              <motion.div 
                className="px-2 pt-2 pb-3 space-y-1 sm:px-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {navigation.map((item, idx) => (
                  <motion.button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className={`flex items-center gap-3 px-4 py-4 rounded-xl text-base font-medium w-full text-left hover:bg-white/10 transition-all duration-500 ease-out relative overflow-hidden group ${
                      activeSection === item.href.substring(1) 
                        ? 'text-white bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 shadow-lg ring-2 ring-blue-400/60 shadow-blue-500/25' 
                        : 'text-white/80 hover:text-white'
                    }`}
                    whileHover={{ 
                      scale: 1.03,
                      x: 12,
                      backgroundColor: "rgba(255, 255, 255, 0.15)"
                    }}
                    whileTap={{ 
                      scale: 0.97,
                      x: 8
                    }}
                    initial={{ 
                      opacity: 0, 
                      x: -50, 
                      rotateY: -20
                    }}
                    animate={{ 
                      opacity: 1, 
                      x: 0, 
                      rotateY: 0
                    }}
                    exit={{
                      opacity: 0,
                      x: -30,
                      rotateY: -15
                    }}
                    transition={{ 
                      delay: 0.1 + idx * 0.05,
                      type: "spring",
                      stiffness: 180,
                      damping: 22,
                      mass: 0.8,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                  >
                    <motion.div
                      whileHover={{ 
                        rotate: [0, -10, 10, 0],
                        scale: 1.3
                      }}
                      transition={{ 
                        type: "spring",
                        stiffness: 400,
                        damping: 15
                      }}
                      className="relative z-10"
                    >
                      {item.icon}
                    </motion.div>
                    <span className="relative z-10">{item.name}</span>
                    
                    {/* Animated background on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 rounded-xl"
                      initial={{ scaleX: 0, originX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30
                      }}
                    />
                    
                    {/* Side accent line */}
                    <motion.div
                      className="absolute left-0 top-1/2 w-1 h-0 bg-gradient-to-b from-pink-500 to-blue-500 rounded-full"
                      initial={{ height: 0, y: "-50%" }}
                      whileHover={{ height: "60%" }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25
                      }}
                    />
                  </motion.button>
                ))}
                
                <motion.div 
                  className="px-4 py-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 0.3 + navigation.length * 0.05,
                    type: "spring",
                    stiffness: 200,
                    damping: 20
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 25
                    }}
                  >
                    {activeCVUrl ? (
                      <Button variant="premium" size="sm" className="w-full" asChild>
                        <a
                          href={activeCVUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center space-x-2"
                        >
                          <span>Download Resume</span>
                        </a>
                      </Button>
                    ) : (
                      <Button variant="premium" size="sm" className="w-full" disabled>
                        <span>No Resume Available</span>
                      </Button>
                    )}
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Enhanced Scroll Progress Bar with Multiple Layers */}
        <div className="absolute left-0 right-0 bottom-0 h-[3px] overflow-hidden">
          {/* Base glow layer */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-blue-500/30 blur-sm"
            style={{ scaleX: smoothScrollProgress }}
            transition={{ type: "spring", stiffness: 100, damping: 30 }}
          />
          
          {/* Main progress bar with slight delay for premium feel */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 origin-left"
            style={{ scaleX: delayedScrollProgress }}
          />
        </div>
      </motion.nav>
    </>
  );
}
