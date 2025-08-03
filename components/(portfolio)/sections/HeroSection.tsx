'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { motion, useAnimation, Variants } from 'framer-motion';

export function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    setIsLoaded(true);
    controls.start("visible");
  }, [controls]);

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToProjects = () => {
    const element = document.querySelector('#projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Professional typing effect for roles
  const roles = [
    "Full Stack Developer",
    "UI/UX Designer", 
    "Problem Solver",
    "Tech Innovator"
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
        }, 100);
      } else {
        timeout = setTimeout(() => setIsTyping(false), 2000);
      }
    } else {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1));
        }, 50);
      } else {
        setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isTyping, currentRoleIndex, roles]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-indigo-950/30 dark:to-purple-950/20"
    >
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/20 via-indigo-500/20 to-purple-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.6, 0.4],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tl from-violet-400/20 via-purple-500/20 to-pink-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full opacity-60"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + i * 8}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'grid\' width=\'60\' height=\'60\' patternUnits=\'userSpaceOnUse\'%3E%3Cpath d=\'M 60 0 L 0 0 0 60\' fill=\'none\' stroke=\'rgb(99 102 241 / 0.1)\' stroke-width=\'1\'/ %3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'url(%23grid)\' /%3E%3C/svg%3E')`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {/* Enhanced Content Section */}
          <motion.div
            className="text-center lg:text-left space-y-8"
            variants={itemVariants}
          >
            {/* Greeting with enhanced styling */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-indigo-200/50 dark:border-indigo-700/50 rounded-full shadow-lg"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <motion.span
                className="text-2xl"
                animate={{ rotate: [0, 20, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 3 }}
              >
                👋
              </motion.span>
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-lg">
                Hello, I'm
              </span>
            </motion.div>

            {/* Enhanced Name with premium styling */}
            <motion.div variants={itemVariants}>
              <Heading 
                level={1} 
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight mb-4"
              >
                <span className="bg-gradient-to-r from-slate-900 via-indigo-800 to-slate-900 dark:from-white dark:via-indigo-200 dark:to-white bg-clip-text text-transparent">
                  Doomin
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Herath
                </span>
              </Heading>
            </motion.div>

            {/* Dynamic typing role with enhanced styling */}
            <motion.div 
              className="h-16 flex items-center justify-center lg:justify-start"
              variants={itemVariants}
            >
              <span className="text-2xl lg:text-3xl font-bold text-slate-700 dark:text-slate-300">
                {displayedText}
                <motion.span
                  className="inline-block w-0.5 h-8 bg-indigo-600 ml-1"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </span>
            </motion.div>

            {/* Enhanced description */}
            <motion.p 
              className="text-lg lg:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0"
              variants={itemVariants}
            >
              Passionate about crafting{" "}
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">exceptional digital experiences</span>
              {" "}through innovative web technologies. I transform ideas into{" "}
              <span className="font-semibold text-purple-600 dark:text-purple-400">scalable solutions</span>
              {" "}that make a real impact.
            </motion.p>

            {/* Key highlights */}
            <motion.div
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
              variants={itemVariants}
            >
              {[
                { icon: "⚡", text: "5+ Years Experience" },
                { icon: "🚀", text: "50+ Projects Delivered" },
                { icon: "🏆", text: "Award-Winning Design" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-full"
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* Enhanced CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4"
              variants={itemVariants}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }} 
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  variant="premium" 
                  size="lg" 
                  glow 
                  onClick={scrollToContact}
                  className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <span className="flex items-center gap-3">
                    Let's Connect
                    <motion.svg 
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </motion.svg>
                  </span>
                </Button>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }} 
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={scrollToProjects}
                  className="px-8 py-4 text-lg font-semibold border-2 border-indigo-300 dark:border-indigo-600 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                >
                  <span className="flex items-center gap-3">
                    View My Work
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </span>
                </Button>
              </motion.div>
            </motion.div>

            {/* Enhanced Social Links */}
            <motion.div
              className="flex justify-center lg:justify-start space-x-4 pt-6"
              variants={itemVariants}
            >
              {[
                { 
                  href: "https://github.com", 
                  label: "GitHub",
                  icon: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                },
                { 
                  href: "https://linkedin.com", 
                  label: "LinkedIn",
                  icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                },
                { 
                  href: "https://twitter.com", 
                  label: "Twitter",
                  icon: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                }
              ].map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-12 h-12 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, type: "spring", stiffness: 200 }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                  
                  {/* Tooltip */}
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    {social.label}
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Enhanced Profile Section */}
          <motion.div
            className="flex justify-center lg:justify-end"
            variants={itemVariants}
          >
            <div className="relative">
              {/* Main profile container */}
              <motion.div
                className="relative w-80 h-80 lg:w-96 lg:h-96"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8, type: "spring", stiffness: 100 }}
              >
                {/* Rotating gradient border */}
                <motion.div 
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500 p-1"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 p-2">
                    <motion.div 
                      className="relative w-full h-full rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 overflow-hidden shadow-2xl"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      {/* Enhanced placeholder with professional styling */}
                      <div className="relative w-full h-full bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 dark:from-indigo-950 dark:via-blue-950 dark:to-purple-950 flex items-center justify-center">
                        {/* Animated background pattern */}
                        <div className="absolute inset-0 opacity-20">
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-600/20"
                            animate={{ 
                              background: [
                                "linear-gradient(45deg, rgba(59,130,246,0.2), rgba(147,51,234,0.2))",
                                "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(59,130,246,0.2))",
                                "linear-gradient(225deg, rgba(147,51,234,0.2), rgba(99,102,241,0.2))",
                                "linear-gradient(315deg, rgba(59,130,246,0.2), rgba(147,51,234,0.2))"
                              ]
                            }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                          />
                        </div>
                        
                        {/* Professional avatar with enhanced styling */}
                        <motion.div
                          className="relative z-10 flex flex-col items-center space-y-4"
                          animate={{ 
                            y: [-5, 5, -5],
                          }}
                          transition={{ 
                            duration: 4, 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                          }}
                        >
                          <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl">
                            <svg 
                              className="w-16 h-16 lg:w-20 lg:h-20 text-white" 
                              fill="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                          </div>
                          
                          {/* Status indicator */}
                          <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            Available for work
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Enhanced floating elements */}
                {[
                  { size: 'w-20 h-20', position: '-top-6 -right-6', gradient: 'from-blue-400 to-indigo-500', delay: 0 },
                  { size: 'w-16 h-16', position: '-bottom-4 -left-4', gradient: 'from-purple-400 to-pink-500', delay: 1 },
                  { size: 'w-12 h-12', position: 'top-1/4 -left-6', gradient: 'from-indigo-400 to-purple-500', delay: 2 },
                  { size: 'w-14 h-14', position: 'bottom-1/3 -right-4', gradient: 'from-cyan-400 to-blue-500', delay: 1.5 }
                ].map((orb, index) => (
                  <motion.div
                    key={index}
                    className={`absolute ${orb.position} ${orb.size} rounded-full bg-gradient-to-br ${orb.gradient} opacity-20 blur-xl`}
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [0.2, 0.4, 0.2],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ 
                      duration: 4 + index, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: orb.delay
                    }}
                  />
                ))}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Scroll Indicator */}
        <motion.div
          className="flex justify-center mt-16 lg:mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <motion.div
            className="flex flex-col items-center space-y-3 cursor-pointer group"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            onClick={() => {
              const nextSection = document.querySelector('#about, #experience, #projects');
              if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <span className="text-slate-600 dark:text-slate-400 text-sm font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Discover More
            </span>
            <motion.div 
              className="w-0.5 h-8 bg-gradient-to-b from-indigo-500 to-transparent rounded-full"
              animate={{ scaleY: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="w-6 h-6 border-2 border-indigo-500 rounded-full flex items-center justify-center group-hover:border-indigo-600 transition-colors"
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.svg 
                className="w-3 h-3 text-indigo-500 group-hover:text-indigo-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </motion.svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}