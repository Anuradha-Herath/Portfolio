"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { motion, useAnimation, Variants } from "framer-motion";

// Typing effect roles - moved outside component to avoid re-creation on every render
const roles = [
  "IT Undergraduate",
  "Full Stack Developer",
  "Problem Solver",
];

export function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    setIsLoaded(true);
    controls.start("visible");
  }, [controls]);

  const scrollToContact = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToProjects = () => {
    const element = document.querySelector("#projects");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Typing effect with improved performance
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const currentRole = roles[currentRoleIndex];
    let timeout: NodeJS.Timeout;

    if (isTyping) {
      if (displayedText.length < currentRole.length) {
        timeout = setTimeout(() => {
          setDisplayedText(currentRole.slice(0, displayedText.length + 1));
        }, 80);
      } else {
        timeout = setTimeout(() => setIsTyping(false), 2500);
      }
    } else {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1));
        }, 40);
      } else {
        setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isTyping, currentRoleIndex]);

  // Faster, more fluid animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Faster stagger
        delayChildren: 0.2, // Reduced delay
        ease: "easeOut",
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4, // Faster individual animations
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20"
    >
      {/* Sophisticated Background - Subtle Grid of Dots */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle animated dot grid pattern */}
        <motion.div
          className="absolute inset-0 opacity-[0.15] dark:opacity-[0.08]"
          style={{
            backgroundImage: `radial-gradient(circle, rgb(99 102 241) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
          animate={{
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Soft gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/30 to-indigo-50/20 dark:from-transparent dark:via-slate-900/50 dark:to-purple-950/10" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {/* Profile Image Section - Enhanced with Sophisticated Animations */}
          <motion.div
            className="flex justify-center lg:justify-start order-2 lg:order-2"
            variants={itemVariants}
          >
            <div className="relative lg:ml-12">
              <motion.div
                className="relative w-72 h-72 lg:w-80 lg:h-80"
                initial={{ scale: 0.8, opacity: 0, rotateY: -15 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                transition={{
                  delay: 0.3,
                  duration: 1.2,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                {/* Enhanced floating animation with multiple layers */}
                <motion.div
                  className="relative w-full h-full"
                  animate={{
                    y: [0, -12, 0],
                    rotate: [0, 0.5, 0, -0.5, 0],
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                >
                  {/* Primary glow effect with enhanced gradients */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/40 via-purple-500/30 to-pink-500/40 blur-3xl"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.4, 0.8, 0.4],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 12,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5,
                    }}
                  />

                  {/* Secondary glow with complementary colors */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-tl from-cyan-400/25 to-blue-500/25 blur-2xl"
                    animate={{
                      scale: [1.2, 0.8, 1.2],
                      opacity: [0.3, 0.6, 0.3],
                      rotate: [360, 180, 0],
                    }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 2,
                    }}
                  />

                  {/* Tertiary accent glow */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-400/20 to-fuchsia-400/20 blur-xl"
                    animate={{
                      scale: [0.9, 1.1, 0.9],
                      opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 3,
                    }}
                  />

                  {/* Main image container with enhanced interactions */}
                  <motion.div
                    className="relative w-full h-full rounded-full overflow-hidden shadow-2xl"
                    whileHover={{
                      scale: 1.08,
                      rotateY: 8,
                      rotateX: 8,
                      z: 50,
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                      mass: 0.8,
                    }}
                    style={{
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {/* Animated multi-layered border rings */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background:
                          "conic-gradient(from 0deg, transparent, rgba(99, 102, 241, 0.9), rgba(168, 85, 247, 0.7), transparent)",
                        padding: "4px",
                      }}
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <motion.div
                        className="w-full h-full rounded-full"
                        style={{
                          background:
                            "conic-gradient(from 180deg, transparent, rgba(6, 182, 212, 0.6), rgba(236, 72, 153, 0.4), transparent)",
                          padding: "2px",
                        }}
                        animate={{ rotate: -360 }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <div className="w-full h-full rounded-full bg-white dark:bg-slate-900" />
                      </motion.div>
                    </motion.div>

                    {/* Dynamic shadow effects with multiple layers */}
                    <motion.div
                      className="absolute -inset-6 rounded-full bg-gradient-to-r from-indigo-500/30 to-purple-500/30 blur-xl"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.6, 1, 0.6],
                        rotate: [0, 90, 180, 270, 360],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />

                    {/* Secondary shadow layer */}
                    <motion.div
                      className="absolute -inset-4 rounded-full bg-gradient-to-br from-pink-400/20 to-cyan-400/20 blur-lg"
                      animate={{
                        scale: [1.1, 0.9, 1.1],
                        opacity: [0.4, 0.7, 0.4],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1,
                      }}
                    />

                    {/* Main image container with enhanced styling */}
                    <div className="relative w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-2 border-white/50 dark:border-slate-700/50 rounded-full overflow-hidden">
                      {/* Enhanced loading shimmer with multiple passes */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{
                          x: ["-150%", "150%"],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 1.5,
                        }}
                      />

                      {/* Secondary shimmer layer */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-200/20 to-transparent"
                        animate={{
                          x: ["-150%", "150%"],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 2.5,
                        }}
                      />

                      {/* Professional photo with enhanced animations */}
                      <motion.img
                        src="/images/profile_photo.jpg"
                        alt="Anuradha Herath"
                        className="w-full h-full object-cover"
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          delay: 0.8,
                          duration: 0.8,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                        whileHover={{
                          scale: 1.05,
                          filter: "brightness(1.1) contrast(1.05)",
                        }}
                        onError={(e) => {
                          // Enhanced fallback with sophisticated animation
                          e.currentTarget.style.display = "none";
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <motion.div
                                class="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-indigo-900/40 dark:via-purple-900/30 dark:to-pink-900/20"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                              >
                                <motion.div
                                  class="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                                  animate={{
                                    scale: [1, 1.1, 1],
                                    rotate: [0, 2, -2, 0]
                                  }}
                                  transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 1
                                  }}
                                >
                                  AH
                                </motion.div>
                              </motion.div>
                            `;
                          }
                        }}
                      />
                    </div>

                    {/* Enhanced hover overlay with multiple effects */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-indigo-500/15 to-indigo-600/25"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    />

                    {/* Sophisticated particle system */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {[...Array(12)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"
                          style={{
                            top: `${15 + (i % 3) * 25}%`,
                            left: `${10 + (i % 4) * 20}%`,
                          }}
                          animate={{
                            y: [0, -25, 0],
                            x: [0, Math.sin(i) * 10, 0],
                            opacity: [0, 1, 0],
                            scale: [0, 1.2, 0],
                          }}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            delay: i * 0.15,
                            ease: [0.25, 0.46, 0.45, 0.94],
                          }}
                        />
                      ))}
                    </motion.div>

                    {/* Additional floating elements */}
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={`float-${i}`}
                        className="absolute w-2 h-2 bg-gradient-to-r from-indigo-300/60 to-purple-300/60 rounded-full blur-sm"
                        style={{
                          top: `${20 + i * 12}%`,
                          right: `${-5 + i * 8}%`,
                        }}
                        animate={{
                          y: [0, -15, 0],
                          opacity: [0.3, 0.8, 0.3],
                          scale: [0.8, 1.2, 0.8],
                        }}
                        transition={{
                          duration: 4 + i * 0.5,
                          repeat: Infinity,
                          delay: i * 0.8,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Content Section - Now on the Left with Left Alignment */}
          <motion.div
            className="text-left space-y-8 order-1 lg:order-1"
            variants={itemVariants}
          >
            {/* Elegant greeting introduction */}
            <motion.div className="space-y-6" variants={itemVariants}>
              <motion.p
                className="text-sm font-semibold tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400"
                variants={itemVariants}
              >
                — Hello, I&apos;m
              </motion.p>

              {/* Refined name with subtle, unified gradient */}
              <Heading
                level={1}
                className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight"
              >
                <motion.span
                  className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 dark:from-white dark:via-indigo-200 dark:to-white bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 6, // Slower, more understated shimmer
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    backgroundSize: "200% 100%",
                  }}
                >
                  Anuradha Herath
                </motion.span>
              </Heading>
            </motion.div>

            {/* Softer sub-headline with typing effect */}
            <motion.div
              className="h-12 flex items-center"
              variants={itemVariants}
            >
              <span className="text-xl lg:text-2xl font-medium text-slate-500 dark:text-slate-500">
                {displayedText}
                <motion.span
                  className="inline-block w-0.5 h-6 bg-indigo-500 ml-1"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
              </span>
            </motion.div>

            {/* Enhanced description with better spacing */}
            <motion.p
              className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl"
              variants={itemVariants}
            >
              Passionate about crafting{" "}
              <span className="font-semibold text-slate-900 dark:text-slate-200">
                exceptional digital experiences
              </span>{" "}
              through innovative web technologies. I transform ideas into{" "}
              <span className="font-semibold text-slate-900 dark:text-slate-200">
                scalable solutions
              </span>{" "}
              that make a real impact.
            </motion.p>

            {/* Refined CTA Buttons with improved hierarchy */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 pt-4"
              variants={itemVariants}
            >
              {/* Primary button - unchanged */}
              <motion.div
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="premium"
                  size="lg"
                  onClick={scrollToContact}
                  className="px-8 py-4 text-base font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    Let&apos;s Connect
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>
                </Button>
              </motion.div>

              {/* Secondary button - Ghost style that reveals fill on hover */}
              <motion.div
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  onClick={scrollToProjects}
                  className="group px-8 py-4 text-base font-semibold border-2 border-slate-300 dark:border-slate-600 bg-transparent hover:bg-slate-900 dark:hover:bg-white hover:border-slate-900 dark:hover:border-white text-slate-700 dark:text-slate-300 hover:text-white dark:hover:text-slate-900 transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    View My Work
                    <svg
                      className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </span>
                </Button>
              </motion.div>
            </motion.div>

            {/* Enhanced Social Links with Smooth Animations */}
            <motion.div className="flex space-x-5 pt-8" variants={itemVariants}>
              {[
                {
                  href: "https://github.com/Anuradha-Herath",
                  label: "GitHub",
                  icon: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z",
                  hoverColor: "hover:bg-gray-900 hover:text-white",
                  glowColor: "shadow-gray-900/50",
                },
                {
                  href: "https://www.linkedin.com/in/herath-anuradha",
                  label: "LinkedIn",
                  icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
                  hoverColor: "hover:bg-blue-600 hover:text-white",
                  glowColor: "shadow-blue-600/50",
                },
                {
                  href: "mailto:anuradhaherath2001@gmail.com",
                  label: "Email",
                  icon: "M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zm0 12H4V8.99l8 6.99 8-6.99V18z",
                  hoverColor: "hover:bg-red-500 hover:text-white",
                  glowColor: "shadow-red-500/50",
                },
              ].map((social, index) => (
                <motion.div
                  key={social.label}
                  className="relative group"
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: 0.8 + index * 0.15,
                    duration: 0.6,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  {/* Glow effect background */}
                  <motion.div
                    className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${social.glowColor}`}
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  <motion.a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`relative w-12 h-12 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 transition-all duration-500 shadow-sm hover:shadow-xl ${social.hoverColor} overflow-hidden`}
                    whileHover={{
                      scale: 1.15,
                      y: -3,
                      rotate: [0, -2, 2, 0],
                      transition: {
                        duration: 0.4,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      },
                    }}
                    whileTap={{
                      scale: 0.9,
                      transition: { duration: 0.1 },
                    }}
                  >
                    {/* Animated background fill */}
                    <motion.div
                      className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: social.label === 'GitHub'
                          ? 'linear-gradient(135deg, #333, #666)'
                          : social.label === 'LinkedIn'
                          ? 'linear-gradient(135deg, #0077b5, #005885)'
                          : 'linear-gradient(135deg, #ea4335, #b23121)',
                      }}
                    />

                    {/* Icon with smooth animations */}
                    <motion.svg
                      className="relative w-5 h-5 z-10"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      whileHover={{
                        scale: 1.1,
                        rotate: social.label === 'GitHub' ? 360 : 0,
                        transition: {
                          duration: 0.5,
                          ease: "easeInOut",
                        },
                      }}
                    >
                      <motion.path
                        d={social.icon}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{
                          delay: 1 + index * 0.2,
                          duration: 1.5,
                          ease: "easeInOut",
                        }}
                      />
                    </motion.svg>

                    {/* Ripple effect on click */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-white/20"
                      initial={{ scale: 0, opacity: 1 }}
                      whileTap={{
                        scale: 2,
                        opacity: 0,
                        transition: { duration: 0.4 },
                      }}
                    />

                    {/* Floating particles */}
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-current rounded-full opacity-0 group-hover:opacity-60"
                        style={{
                          top: `${20 + i * 20}%`,
                          right: `${-10 + i * 10}%`,
                        }}
                        animate={{
                          y: [0, -15, 0],
                          x: [0, Math.sin(i) * 8, 0],
                          opacity: [0, 0.6, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.3,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </motion.a>

                  {/* Enhanced tooltip with smooth animation */}
                  <motion.div
                    className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-lg"
                    initial={{ y: 10, scale: 0.8 }}
                    whileHover={{ y: 0, scale: 1 }}
                  >
                    {social.label}
                    {/* Tooltip arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900 dark:border-t-slate-100"></div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
