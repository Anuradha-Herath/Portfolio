'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const navigationLinks = [
  { name: 'Home', href: '#hero' },
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Contact', href: '#contact' },
];

const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com/Anuradha-Herath',
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.39.6.11.82-.26.82-.58v-2.23c-3.34.72-4.04-1.42-4.04-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.31.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.39 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23A11.5 11.5 0 0112 5.8c1.02 0 2.05.14 3.01.4 2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.83 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.48 5.93.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    ),
    hoverColor: 'hover:bg-gray-900 hover:text-white',
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/herath-anuradha',
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43c-1.14 0-2.06-.93-2.06-2.07 0-1.14.92-2.07 2.06-2.07 1.14 0 2.07.93 2.07 2.07 0 1.14-.93 2.07-2.07 2.07zM7.06 20.45H3.52V9h3.54v11.45zM22.22 0H1.78C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.78 24h20.44c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/>
      </svg>
    ),
    hoverColor: 'hover:bg-blue-600 hover:text-white',
  },
  {
    name: 'Email',
    href: 'mailto:anuradhaherath2001@gmail.com',
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
      </svg>
    ),
    hoverColor: 'hover:bg-red-500 hover:text-white',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export function Footer() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative overflow-hidden bg-slate-900">
      {/* Unified Background - Optimized for Performance */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Static dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.08] dark:opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle, rgb(99 102 241) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Soft gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-[var(--accent)]/10 dark:from-transparent dark:via-slate-900/30 dark:to-purple-950/5" />
      </div>

      <div className="relative z-10 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {/* Brand Section */}
            <motion.div
              className="sm:col-span-2 lg:col-span-5 space-y-4 sm:space-y-6"
              variants={itemVariants}
            >
              <div className="space-y-3 sm:space-y-4">
                <motion.h3
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-[var(--accent)] to-[#5856d6] bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    backgroundSize: "200% 100%",
                  }}
                >
                  Anuradha Herath
                </motion.h3>
                <motion.p
                  className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-lg"
                  variants={itemVariants}
                >
                  Crafting exceptional digital experiences through innovative
                  web technologies. Passionate about transforming ideas into
                  scalable solutions that make a real impact.
                </motion.p>
              </div>

              {/* Enhanced Social Links */}
              <motion.div
                className="flex flex-wrap gap-3 sm:gap-4"
                variants={itemVariants}
              >
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/50 flex items-center justify-center text-slate-400 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm overflow-hidden ${social.hoverColor}`}
                    whileHover={{
                      scale: 1.05,
                      y: -2,
                    }}
                    whileTap={{
                      scale: 0.95,
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.3 + index * 0.1,
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                    }}
                  >
                    {/* Simplified glow effect */}
                    <motion.div
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 blur-lg"
                      style={{
                        background:
                          social.name === "GitHub"
                            ? "radial-gradient(circle, #6366f1 0%, transparent 70%)"
                            : social.name === "LinkedIn"
                            ? "radial-gradient(circle, #0077b5 0%, transparent 70%)"
                            : "radial-gradient(circle, #ea4335 0%, transparent 70%)",
                      }}
                    />

                    {/* Icon */}
                    <motion.div
                      className="relative z-10"
                      whileHover={{
                        scale: 1.1,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {social.icon}
                    </motion.div>

                    {/* Simplified tooltip */}
                    <motion.div
                      className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-slate-900/95 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap backdrop-blur-sm border border-slate-700/50"
                      initial={{ y: 5, opacity: 0 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.15 }}
                    >
                      {social.name}
                    </motion.div>
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>

            {/* Navigation Links */}
            <motion.div
              className="sm:col-span-1 lg:col-span-3 space-y-4 sm:space-y-6"
              variants={itemVariants}
            >
              <h4 className="text-lg sm:text-xl font-semibold text-white">
                Quick Links
              </h4>
              <ul className="space-y-2 sm:space-y-3">
                {navigationLinks.map((link, index) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="group flex items-center text-slate-400 hover:text-[var(--accent)] transition-all duration-200 text-sm sm:text-base"
                    >
                      <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mr-2 sm:mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      {link.name}
                    </button>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact & CTA Section */}
            <motion.div
              className="sm:col-span-2 lg:col-span-4 space-y-4 sm:space-y-6"
              variants={itemVariants}
            >
              <div>
                <h4 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
                  Let&apos;s Connect
                </h4>
                <div className="space-y-2 sm:space-y-3 text-slate-400">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--accent)] flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-sm sm:text-base break-all">
                      anuradhaherath2001@gmail.com
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--accent)] flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="text-sm sm:text-base">
                      Colombo, Sri Lanka
                    </span>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <motion.div className="pt-2 sm:pt-4" variants={itemVariants}>
                <motion.button
                  onClick={() => scrollToSection("#contact")}
                  className="group relative w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[var(--accent)] to-[#5856d6] hover:from-[var(--accent)]/90 hover:to-[#5856d6]/90 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden text-sm sm:text-base"
                  whileHover={{
                    scale: 1.02,
                    y: -1,
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Start a Conversation
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 ml-2"
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
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Bottom Section */}
          <motion.div
            className="border-t border-slate-700/50 mt-8 sm:mt-12 lg:mt-16 pt-6 sm:pt-8"
            variants={itemVariants}
          >
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
              <p className="text-slate-400 text-xs sm:text-sm text-center sm:text-left">
                © {new Date().getFullYear()} Anuradha Herath. Crafted with
                passion and precision.
              </p>

              <div className="flex items-center space-x-4 sm:space-x-6 text-xs sm:text-sm text-slate-400">
                <a
                  href="/privacy"
                  className="hover:text-[var(--accent)] transition-colors duration-200"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms"
                  className="hover:text-[var(--accent)] transition-colors duration-200"
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}