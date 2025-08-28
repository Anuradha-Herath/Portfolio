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
    href: 'https://github.com',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
    hoverColor: 'hover:bg-gray-900 hover:text-white',
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    hoverColor: 'hover:bg-blue-600 hover:text-white',
  },
  {
    name: 'Email',
    href: 'mailto:anuradha.herath@email.com',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zm0 12H4V8.99l8 6.99 8-6.99V18z"/>
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
      {/* Unified Background - Matching Contact Section */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle animated dot grid pattern - Same as other sections */}
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

        {/* Soft gradient overlay for depth - Same as other sections */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/30 to-[var(--accent)]/20 dark:from-transparent dark:via-slate-900/50 dark:to-purple-950/10" />
      </div>

      <div className="relative z-10 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Brand Section */}
            <motion.div
              className="lg:col-span-5 space-y-6"
              variants={itemVariants}
            >
              <div className="space-y-4">
                <motion.h3
                  className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-[var(--accent)] to-[#5856d6] bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 8,
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
                  className="text-slate-300 text-lg leading-relaxed max-w-lg"
                  variants={itemVariants}
                >
                  Crafting exceptional digital experiences through innovative web technologies.
                  Passionate about transforming ideas into scalable solutions that make a real impact.
                </motion.p>
              </div>

              {/* Enhanced Social Links */}
              <motion.div
                className="flex flex-wrap gap-4"
                variants={itemVariants}
              >
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative w-12 h-12 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm ${social.hoverColor}`}
                    whileHover={{
                      scale: 1.1,
                      y: -3,
                      rotate: [0, -5, 5, 0],
                    }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.5 + index * 0.1,
                      type: "spring",
                      stiffness: 200,
                    }}
                  >
                    {social.icon}

                    {/* Tooltip */}
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-slate-900/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap backdrop-blur-sm">
                      {social.name}
                    </div>
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>

            {/* Navigation Links */}
            <motion.div
              className="lg:col-span-3 space-y-6"
              variants={itemVariants}
            >
              <h4 className="text-xl font-semibold text-white">Quick Links</h4>
              <ul className="space-y-3">
                {navigationLinks.map((link, index) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="group flex items-center text-slate-400 hover:text-[var(--accent)] transition-all duration-300"
                    >
                      <motion.span
                        className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        whileHover={{ scale: 1.5 }}
                      />
                      {link.name}
                      <motion.svg
                        className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        initial={{ x: -10 }}
                        whileHover={{ x: 0 }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </motion.svg>
                    </button>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact & CTA Section */}
            <motion.div
              className="lg:col-span-4 space-y-6"
              variants={itemVariants}
            >
              <div>
                <h4 className="text-xl font-semibold text-white mb-4">Let's Connect</h4>
                <div className="space-y-3 text-slate-400">
                  <motion.div
                    className="flex items-center space-x-3"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>anuradha.herath@email.com</span>
                  </motion.div>
                  <motion.div
                    className="flex items-center space-x-3"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Colombo, Sri Lanka</span>
                  </motion.div>
                </div>
              </div>

              {/* Call to Action */}
              <motion.div
                className="pt-4"
                variants={itemVariants}
              >
                <motion.button
                  onClick={() => scrollToSection('#contact')}
                  className="group relative px-6 py-3 bg-gradient-to-r from-[var(--accent)] to-[#5856d6] hover:from-[var(--accent)]/80 hover:to-[#5856d6]/80 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                  whileHover={{
                    scale: 1.02,
                    y: -2,
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center">
                    Start a Conversation
                    <motion.svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      animate={{ x: [0, 3, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </motion.svg>
                  </span>

                  {/* Button glow effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[var(--accent)] to-[#5856d6] opacity-0 group-hover:opacity-20 blur-xl"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Bottom Section */}
          <motion.div
            className="border-t border-slate-700/50 mt-16 pt-8"
            variants={itemVariants}
          >
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <motion.p
                className="text-slate-400 text-sm"
                variants={itemVariants}
              >
                © {new Date().getFullYear()} Anuradha Herath. Crafted with passion and precision.
              </motion.p>

              <motion.div
                className="flex items-center space-x-6 text-sm text-slate-400"
                variants={itemVariants}
              >
                <motion.a
                  href="/privacy"
                  className="hover:text-[var(--accent)] transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  Privacy Policy
                </motion.a>
                <motion.a
                  href="/terms"
                  className="hover:text-[var(--accent)] transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  Terms of Service
                </motion.a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}