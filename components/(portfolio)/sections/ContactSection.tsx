'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

export function ContactSection() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        // Trigger SMS notification via TextBee
        try {
          await fetch('/api/send-sms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              recipients: ['+94768952480'],
              message: 'New contact form submission! Check admin page.'
            })
          });
        } catch (smsError) {
          // Optionally log or handle SMS error, but don't block form success
          console.error('SMS notification failed', smsError);
        }
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.error || 'Failed to send message');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: 'Email',
      value: 'doomin.herath@example.com',
      href: 'mailto:doomin.herath@example.com'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      label: 'Phone',
      value: '+94 77 123 4567',
      href: 'tel:+94771234567'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: 'Location',
      value: 'Colombo, Sri Lanka',
      href: '#'
    }
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
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/30 to-indigo-50/20 dark:from-transparent dark:via-slate-900/50 dark:to-purple-950/10" />
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
            className="text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium"
            variants={itemVariants}
          >
            I&apos;m always open to discussing new opportunities, interesting projects, or just having a chat about technology.
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
              <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
                Let&apos;s Connect
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8 text-lg">
                Whether you have a project in mind, want to collaborate, or just want to say hello,
                I&apos;d love to hear from you. Feel free to reach out through any of the channels below.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  whileHover={{
                    scale: 1.02,
                    x: 8,
                    transition: { type: "spring", stiffness: 300, damping: 20 }
                  }}
                  className="group"
                >
                  <Card className="bg-white/10 dark:bg-slate-800/10 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <motion.div
                          className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[var(--accent)] to-[#5856d6] rounded-xl flex items-center justify-center text-white shadow-lg group-hover:shadow-[var(--accent)]/25 transition-all duration-300"
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.6, ease: "easeInOut" }}
                        >
                          {info.icon}
                        </motion.div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                            {info.label}
                          </p>
                          {info.href !== '#' ? (
                            <a
                              href={info.href}
                              className="text-lg lg:text-xl font-semibold text-slate-900 dark:text-white hover:text-[var(--accent)] dark:hover:text-[#5856d6] transition-colors duration-300 group-hover:translate-x-1 transform"
                            >
                              {info.value}
                            </a>
                          ) : (
                            <p className="text-lg lg:text-xl font-semibold text-slate-900 dark:text-white">
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
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-6">
                Follow me on
              </p>
              <div className="flex space-x-4">
                {[
                  {
                    href: "https://github.com",
                    icon: (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    ),
                    hoverColor: "hover:bg-slate-900 dark:hover:bg-slate-700",
                  },
                  {
                    href: "https://linkedin.com",
                    icon: (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    ),
                    hoverColor: "hover:bg-blue-600",
                  },
                  {
                    href: "https://twitter.com",
                    icon: (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    ),
                    hoverColor: "hover:bg-sky-500",
                  },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 rounded-xl bg-white/10 dark:bg-slate-800/10 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 flex items-center justify-center text-slate-600 dark:text-slate-400 transition-all duration-300 shadow-lg hover:shadow-xl ${social.hoverColor} hover:text-white hover:scale-110`}
                    whileHover={{
                      scale: 1.1,
                      y: -2,
                      rotate: [0, -5, 5, 0],
                      transition: { type: "spring", stiffness: 400, damping: 10 }
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
            <Card className="bg-white/10 dark:bg-slate-800/10 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden">
              <CardContent className="p-8 lg:p-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                    Send Me a Message
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-8 text-lg">
                    Fill out the form below and I&apos;ll get back to you as soon as possible.
                  </p>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Success Message */}
                  <AnimatePresence>
                    {submitStatus === 'success' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl backdrop-blur-sm"
                      >
                        <div className="flex items-start space-x-3">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                          >
                            <svg className="h-6 w-6 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </motion.div>
                          <div>
                            <h4 className="text-lg font-semibold text-green-400 mb-1">Message Sent Successfully!</h4>
                            <p className="text-green-300 text-sm leading-relaxed">
                              Thank you for your message! I&apos;ll get back to you within 24 hours.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Error Message */}
                  <AnimatePresence>
                    {submitStatus === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="p-6 bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm"
                      >
                        <div className="flex items-start space-x-3">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                          >
                            <svg className="h-6 w-6 text-red-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </motion.div>
                          <div>
                            <h4 className="text-lg font-semibold text-red-400 mb-1">Failed to Send Message</h4>
                            <p className="text-red-300 text-sm leading-relaxed">
                              {errorMessage}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Form Fields */}
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
                        className="bg-white/5 dark:bg-slate-800/5 border-white/20 dark:border-slate-700/20 focus:border-[var(--accent)]/50 focus:ring-[var(--accent)]/20"
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
                        className="bg-white/5 dark:bg-slate-800/5 border-white/20 dark:border-slate-700/20 focus:border-[var(--accent)]/50 focus:ring-[var(--accent)]/20"
                      />
                    </motion.div>
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
                      className="bg-white/5 dark:bg-slate-800/5 border-white/20 dark:border-slate-700/20 focus:border-[var(--accent)]/50 focus:ring-[var(--accent)]/20"
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
                      rows={5}
                      placeholder="Tell me about your project or just say hello!"
                      className="bg-white/5 dark:bg-slate-800/5 border-white/20 dark:border-slate-700/20 focus:border-[var(--accent)]/50 focus:ring-[var(--accent)]/20 resize-none"
                    />
                  </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="pt-4"
                    >
                      <motion.div
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          size="lg"
                          className="w-full bg-gradient-to-r from-[var(--accent)] to-[#5856d6] hover:from-[var(--accent)]/80 hover:to-[#5856d6]/80 shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-semibold py-4"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <div className="flex items-center justify-center space-x-3">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                              />
                              <span>Sending...</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center space-x-3">
                              <span>Send Message</span>
                              <motion.svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                animate={{ x: [0, 4, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
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
}