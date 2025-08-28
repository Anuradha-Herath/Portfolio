"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { motion, useAnimation, Variants } from "framer-motion";

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
  const roles = [
    "Full Stack Developer",
    "UI/UX Designer",
    "Problem Solver",
    "Tech Innovator",
  ];

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
  }, [displayedText, isTyping, currentRoleIndex, roles]);

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
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20 section-background"
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
          {/* Profile Image Section - Now on the Right */}
          <motion.div
            className="flex justify-center lg:justify-start order-2 lg:order-2"
            variants={itemVariants}
          >
            <div className="relative lg:ml-12">
              <motion.div
                className="relative w-72 h-72 lg:w-80 lg:h-80"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
              >
                {/* Clean, elegant single border with subtle glow */}
                <motion.div
                  className="relative w-full h-full rounded-full overflow-hidden shadow-2xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {/* Subtle glow effect that pulses on hover */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-600/20 blur-xl"
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Main image container */}
                  <div className="relative w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border-2 border-white dark:border-slate-700 rounded-full overflow-hidden">
                    {/* Professional photo placeholder */}
                    <img
                      src="/images/profile_photo.jpg"
                      alt="Anuradha Herath"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to a elegant placeholder if image not found
                        e.currentTarget.style.display = "none";
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30">
                              <div class="text-4xl font-bold text-indigo-600 dark:text-indigo-400">AH</div>
                            </div>
                          `;
                        }
                      }}
                    />
                  </div>
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
                — Hello, I'm
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
                    Let's Connect
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

            {/* Refined Social Links with consistent spacing */}
            <motion.div className="flex space-x-5 pt-8" variants={itemVariants}>
              {[
                {
                  href: "https://github.com",
                  label: "GitHub",
                  icon: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z",
                  hoverColor: "hover:bg-gray-900 hover:text-white",
                },
                {
                  href: "https://linkedin.com",
                  label: "LinkedIn",
                  icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
                  hoverColor: "hover:bg-blue-600 hover:text-white",
                },
                {
                  href: "mailto:anuradha.herath@email.com",
                  label: "Email",
                  icon: "M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zm0 12H4V8.99l8 6.99 8-6.99V18z",
                  hoverColor: "hover:bg-red-500 hover:text-white",
                },
              ].map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative w-12 h-12 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 transition-all duration-300 shadow-sm hover:shadow-lg ${social.hoverColor}`}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.5 + index * 0.1,
                    type: "spring",
                    stiffness: 200,
                  }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d={social.icon} />
                  </svg>

                  {/* Tooltip */}
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    {social.label}
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
