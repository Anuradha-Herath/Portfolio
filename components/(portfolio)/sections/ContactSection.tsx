'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Heading } from '@/components/ui/Heading';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const ContactSection = React.memo(() => {
  const [formData, setFormData] = useState<FormData>(() => {
    // Load saved form data from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('contactFormDraft');
      return saved ? JSON.parse(saved) : {
        name: '',
        email: '',
        subject: '',
        message: ''
      };
    }
    return {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [retryAfter, setRetryAfter] = useState<number | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);

  const shouldReduceMotion = useReducedMotion();

  // Countdown timer for rate limiting
  React.useEffect(() => {
    if (retryAfter && retryAfter > 0) {
      const timer = setInterval(() => {
        setRetryAfter(prev => {
          if (prev && prev > 1) {
            return prev - 1;
          } else {
            return null; // Clear when countdown reaches 0
          }
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [retryAfter]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  };

  // Auto-save form data to localStorage
  const saveFormDraft = React.useCallback((data: FormData) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('contactFormDraft', JSON.stringify(data));
    }
  }, []);

  // Clear saved draft
  const clearFormDraft = React.useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('contactFormDraft');
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value
    };
    
    setFormData(newFormData);
    saveFormDraft(newFormData);

    // Field-specific validation
    if (name === 'email') {
      if (value && !validateEmail(value)) {
        setEmailError('Please enter a valid email address');
      } else {
        setEmailError('');
      }
    }

    // Clear any previous error messages when user starts typing
    if (submitStatus === 'error') {
      setSubmitStatus('idle');
      setErrorMessage('');
      setRetryAfter(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email before submitting
    if (!validateEmail(formData.email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    // Basic validation
    if (!formData.name.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setSubmitStatus('error');
      setErrorMessage('Please fill in all required fields');
      return;
    }

    // Validate subject length
    if (formData.subject.trim().length < 5 || formData.subject.trim().length > 200) {
      setSubmitStatus('error');
      setErrorMessage('Subject must be between 5 and 200 characters');
      return;
    }

    // Validate message length
    if (formData.message.trim().length < 10 || formData.message.trim().length > 2000) {
      setSubmitStatus('error');
      setErrorMessage('Message must be between 10 and 2000 characters');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // First, send the contact message to the backend
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Success - clear draft and reset form
        clearFormDraft();
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setEmailError('');
        setRetryCount(0);
        setRetryAfter(null);
      } else if (response.status === 403) {
        // IP blocked - show specific error
        setSubmitStatus('error');
        setErrorMessage('🚫 Nice try, troll! 😄 Your IP has been banished to the naughty list. Try again when you\'ve learned your lesson! 🎭');
        setIsBlocked(true);
        setRetryCount(0);
      } else if (response.status === 429) {
        // Rate limiting - show specific error with retry info
        const retryAfterSeconds = parseInt(response.headers.get('Retry-After') || '900');
        setRetryAfter(retryAfterSeconds);
        setSubmitStatus('error');
        setErrorMessage(
          `Too many requests. Please wait ${Math.ceil(retryAfterSeconds / 60)} minutes before trying again.`
        );
        setRetryCount(0);
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Retry logic for network errors
      if (retryCount < 2 && (error as Error).message.includes('Network') || (error as Error).message.includes('fetch')) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          handleSubmit(e);
        }, 2000 * (retryCount + 1)); // Exponential backoff
        return;
      }

      setSubmitStatus('error');
      setErrorMessage(
        retryCount > 0 
          ? `Failed to send message after ${retryCount + 1} attempts. Please try again later.`
          : 'Network error. Please check your connection and try again.'
      );
      setRetryCount(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: (
        <svg
          className="w-6 h-6"
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
      ),
      label: "Email",
      value: "anuradhaherath2001@gmail.com",
      href: "mailto:anuradhaherath2001@gmail.com",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
      label: "Phone",
      value: "+94 76 895 2480",
      href: "tel:+94768952480",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
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
      ),
      label: "Location",
      value: "Kurunegala, Sri Lanka",
      href: "#",
    },
  ];

  // Animation variants
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
      },
    },
  };

  return (
    <section id="contact" className="relative py-16 lg:py-20 overflow-hidden">
      {/* Unified Background - Matching Other Sections */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle animated dot grid pattern - Same as other sections */}
        <motion.div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `radial-gradient(circle, rgb(99 102 241) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
          animate={shouldReduceMotion ? {} : {
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={shouldReduceMotion ? {} : {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Soft gradient overlay for depth - Same as other sections */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-slate-900/50 to-purple-950/10" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div variants={itemVariants}>
            <Heading level={2} className="mb-6">
              Get In{" "}
              <span className="bg-gradient-to-r from-[var(--accent)] to-[#5856d6] bg-clip-text text-transparent">
                Touch
              </span>
            </Heading>
          </motion.div>
          <motion.p
            className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium"
            variants={itemVariants}
          >
            I&apos;m always open to discussing new opportunities, interesting
            projects, or just having a chat about technology.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Contact Information */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-6 tracking-tight">
                Let&apos;s Connect
              </h3>
              <p className="text-slate-300 leading-relaxed mb-8 text-base sm:text-lg">
                Whether you have a project in mind, want to collaborate, or just
                want to say hello, I&apos;d love to hear from you. Feel free to
                reach out through any of the channels below.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  whileHover={shouldReduceMotion ? {} : {
                    scale: 1.02,
                    x: 8,
                    transition: { type: "spring", stiffness: 300, damping: 20 },
                  }}
                  className="group"
                >
                  <Card className="bg-slate-800/10 backdrop-blur-sm border border-slate-700/20 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <motion.div
                          className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[var(--accent)] to-[#5856d6] rounded-xl flex items-center justify-center text-white shadow-lg group-hover:shadow-[var(--accent)]/25 transition-all duration-300"
                          whileHover={shouldReduceMotion ? {} : { rotate: 360, scale: 1.1 }}
                          transition={shouldReduceMotion ? {} : { duration: 0.6, ease: "easeInOut" }}
                        >
                          {info.icon}
                        </motion.div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-1">
                            {info.label}
                          </p>
                          {info.href !== "#" ? (
                            <a
                              href={info.href}
                              className="text-base sm:text-lg lg:text-xl font-semibold text-white hover:text-[#5856d6] transition-colors duration-300 group-hover:translate-x-1 transform"
                            >
                              {info.value}
                            </a>
                          ) : (
                            <p className="text-base sm:text-lg lg:text-xl font-semibold text-white">
                              {info.value}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <motion.div variants={itemVariants} className="pt-8">
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-6">
                Follow me on
              </p>
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                {[
                  {
                    href: "https://github.com/Anuradha-Herath",
                    icon: (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    ),
                    hoverColor: "hover:bg-slate-700",
                  },
                  {
                    href: "https://www.linkedin.com/in/herath-anuradha",
                    icon: (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    ),
                    hoverColor: "hover:bg-blue-600",
                  },
                  {
                    href: "https://www.facebook.com/anuradha.herath.9275/",
                    icon: (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    ),
                    hoverColor: "hover:bg-blue-700",
                  },
                  {
                    href: "https://www.instagram.com/_anuradha_herath_/",
                    icon: (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    ),
                    hoverColor: "hover:bg-pink-500",
                  },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 rounded-xl bg-slate-800/10 backdrop-blur-sm border border-slate-700/20 flex items-center justify-center text-slate-400 transition-all duration-300 shadow-lg hover:shadow-xl ${social.hoverColor} hover:text-white hover:scale-110`}
                    whileHover={shouldReduceMotion ? {} : {
                      scale: 1.1,
                      y: -2,
                      rotate: [0, -5, 5, 0],
                      transition: {
                        duration: 0.6,
                        ease: "easeInOut",
                      },
                    }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div variants={itemVariants}>
            <Card className="relative bg-slate-900/95 backdrop-blur-md border-2 border-slate-700/30 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden">
              {/* Decorative Header */}
              <div className="relative bg-gradient-to-r from-[var(--accent)] via-[#5856d6] to-purple-600 p-1">
                <div className="bg-slate-900/10 rounded-t-2xl p-6">
                  <div className="flex items-center space-x-4">
                    <motion.div
                      className="flex-shrink-0 w-16 h-16 bg-slate-800/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg"
                      whileHover={shouldReduceMotion ? {} : { rotate: 360, scale: 1.05 }}
                      transition={shouldReduceMotion ? {} : { duration: 0.6, ease: "easeInOut" }}
                    >
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </motion.div>
                    <div className="flex-1">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 tracking-tight" id="contact-form-title">
                          Send Me a Message
                        </h3>
                        <p className="text-white/90 text-base sm:text-lg leading-relaxed">
                          Fill out the form below and I&apos;ll get back to you
                          as soon as possible.
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="p-8 lg:p-10 bg-slate-900/50">
                <form 
                  onSubmit={handleSubmit} 
                  className="space-y-8"
                  role="form"
                  aria-labelledby="contact-form-title"
                >
                  {/* Honeypot field for spam prevention */}
                  <input type="text" name="website" style={{display: 'none'}} autoComplete="off" />
                  {/* Success Message */}
                  <AnimatePresence>
                    {submitStatus === "success" && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/30 rounded-2xl backdrop-blur-sm shadow-lg"
                      >
                        <div className="flex items-start space-x-4">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              delay: 0.2,
                              type: "spring",
                              stiffness: 300,
                            }}
                            className="flex-shrink-0 w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center"
                          >
                            <svg
                              className="h-7 w-7 text-green-500"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </motion.div>
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-green-400 mb-2">
                              Message Sent Successfully!
                            </h4>
                            <p className="text-green-300 text-base leading-relaxed">
                              Thank you for your message! I&apos;ll get back to
                              you within 24 hours.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Error Message */}
                  <AnimatePresence>
                    {submitStatus === "error" && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="p-6 bg-gradient-to-r from-red-500/20 to-rose-500/20 border-2 border-red-500/30 rounded-2xl backdrop-blur-sm shadow-lg"
                      >
                        <div className="flex items-start space-x-4">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              delay: 0.2,
                              type: "spring",
                              stiffness: 300,
                            }}
                            className="flex-shrink-0 w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center"
                          >
                            <svg
                              className="h-7 w-7 text-red-500"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </motion.div>
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-red-400 mb-2">
                              {retryAfter ? 'Rate Limit Exceeded' : submitStatus === 'error' && errorMessage.includes('troll') ? 'Troll Detected! 🎭' : 'Failed to Send Message'}
                            </h4>
                            <p className="text-red-300 text-base leading-relaxed">
                              {errorMessage}
                              {retryAfter && (
                                <span className="block mt-2 text-sm">
                                  You can try again in {Math.floor(retryAfter / 60)}:{(retryAfter % 60).toString().padStart(2, '0')}.
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Form Fields Container */}
                  <div className="space-y-8">
                    {/* Personal Information Section */}
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-[var(--accent)] to-[#5856d6] rounded-lg flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <h4 className="text-base sm:text-lg font-semibold text-white">
                          Personal Information
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <Input
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Your full name"
                            className="bg-slate-800/80 border-2 border-slate-600 focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/20 text-[var(--foreground)] placeholder-[var(--foreground-tertiary)] rounded-xl py-4 px-4 text-base font-medium shadow-sm hover:shadow-md transition-all duration-300"
                          />
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <Input
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="your.email@example.com"
                            className="bg-slate-800/80 border-2 border-slate-600 focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/20 text-[var(--foreground)] placeholder-[var(--foreground-tertiary)] rounded-xl py-4 px-4 text-base font-medium shadow-sm hover:shadow-md transition-all duration-300"
                          />
                        </motion.div>
                      </div>

                      {/* Email Error Message */}
                      <AnimatePresence>
                        {emailError && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-red-400 text-sm font-medium mt-2"
                          >
                            {emailError}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Message Section */}
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                        </div>
                        <h4 className="text-base sm:text-lg font-semibold text-white">
                          Your Message
                        </h4>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <Input
                          label="Subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          placeholder="What's this about?"
                          className="bg-slate-800/80 border-2 border-slate-600 focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/20 text-[var(--foreground)] placeholder-[var(--foreground-tertiary)] rounded-xl py-4 px-4 text-base font-medium shadow-sm hover:shadow-md transition-all duration-300"
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <Textarea
                          label="Message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={6}
                          placeholder="Tell me about your project or just say hello!"
                          className="bg-slate-800/80 border-2 border-slate-600 focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/20 text-[var(--foreground)] placeholder-[var(--foreground-tertiary)] rounded-xl py-4 px-4 text-base font-medium shadow-sm hover:shadow-md transition-all duration-300 resize-none"
                        />
                      </motion.div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="pt-6"
                  >
                    <motion.div
                      whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-gradient-to-r from-[var(--accent)] via-[#5856d6] to-purple-600 hover:from-[var(--accent)]/90 hover:via-[#5856d6]/90 hover:to-purple-600/90 shadow-xl hover:shadow-2xl transition-all duration-300 text-white text-lg font-bold py-5 rounded-2xl border-2 border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSubmitting || !!emailError || !!retryAfter || isBlocked}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center space-x-4">
                            <motion.div
                              animate={shouldReduceMotion ? {} : { rotate: 360 }}
                              transition={shouldReduceMotion ? {} : {
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
                            />
                            <span className="text-base sm:text-lg">
                              {retryCount > 0 ? `Retrying... (${retryCount}/3)` : 'Sending...'}
                            </span>
                          </div>
                        ) : retryAfter ? (
                          <div className="flex items-center justify-center space-x-4">
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span className="text-base sm:text-lg">
                              Try again in {Math.floor(retryAfter / 60)}:{(retryAfter % 60).toString().padStart(2, '0')}
                            </span>
                          </div>
                        ) : isBlocked ? (
                          <div className="flex items-center justify-center space-x-4">
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span className="text-base sm:text-lg">
                              Troll Mode Activated! 🎪
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center space-x-4">
                            <span className="text-base sm:text-lg">Send Message</span>
                            <motion.svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              animate={shouldReduceMotion ? {} : { x: [0, 5, 0] }}
                              transition={shouldReduceMotion ? {} : {
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                              />
                            </motion.svg>
                          </div>
                        )}
                      </Button>
                    </motion.div>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
});

ContactSection.displayName = 'ContactSection';