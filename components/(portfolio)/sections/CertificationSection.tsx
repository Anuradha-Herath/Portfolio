"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Certification } from "@/lib/types";

// Animated Counter Component for Statistics
interface AnimatedCounterProps {
  value: number;
  duration?: number;
}

function AnimatedCounter({ value, duration = 2 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      // Easing function for smooth animation
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      const easedProgress = easeOutCubic(progress);

      setCount(Math.floor(easedProgress * value));

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [value, duration]);

  return <span>{count}</span>;
}

// Certificate Modal Component
interface CertificateModalProps {
  certification: Certification | null;
  isOpen: boolean;
  onClose: () => void;
}

function CertificateModal({
  certification,
  isOpen,
  onClose,
}: CertificateModalProps) {
  if (!certification) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div
              className="max-w-4xl w-full max-h-[90vh] bg-[var(--surface)] rounded-2xl shadow-2xl border border-[var(--border)] overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 overflow-y-auto max-h-[90vh] relative">
                {/* Close Button - moved inside modal content */}
                <button
                  onClick={onClose}
                  className="absolute top-0 right-0 mt-4 mr-4 z-10 w-9 h-9 bg-[var(--background-secondary)] hover:bg-[var(--surface-hover)] rounded-full flex items-center justify-center text-[var(--foreground-tertiary)] hover:text-[var(--foreground)] transition-all duration-200 ring-2 ring-[var(--accent)]/20 hover:ring-[var(--accent)]/40 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[var(--accent)]/40"
                  style={{ boxShadow: "0 4px 16px 0 rgba(0,0,0,0.10)" }}
                  aria-label="Close"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                {/* Certificate Image */}
                {certification.image_url && (
                  <div className="mb-6">
                    <img
                      src={certification.image_url}
                      alt={`${certification.title} certificate`}
                      className="w-full max-w-2xl mx-auto rounded-xl shadow-lg bg-[var(--background-tertiary)]"
                    />
                  </div>
                )}

                {/* Certificate Details */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-[var(--foreground)] mb-2">
                      {certification.title}
                    </h2>
                    <p className="text-xl text-[var(--accent)] font-semibold">
                      {certification.issuer}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-semibold text-[var(--foreground-tertiary)] uppercase tracking-wide mb-2">
                        Date Earned
                      </h3>
                      <p className="text-[var(--foreground-secondary)]">
                        {formatDate(certification.date)}
                      </p>
                    </div>

                    {certification.credential_id && (
                      <div>
                        <h3 className="text-sm font-semibold text-[var(--foreground-tertiary)] uppercase tracking-wide mb-2">
                          Credential ID
                        </h3>
                        <p className="text-[var(--foreground-secondary)] font-mono bg-[var(--background-tertiary)] p-2 rounded text-sm">
                          {certification.credential_id}
                        </p>
                      </div>
                    )}
                  </div>

                  {certification.description && (
                    <div>
                      <h3 className="text-sm font-semibold text-[var(--foreground-tertiary)] uppercase tracking-wide mb-2">
                        Description
                      </h3>
                      <p className="text-[var(--foreground-secondary)] leading-relaxed">
                        {certification.description}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4 pt-4">
                    {certification.url && (
                      <a
                        href={certification.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent)]/80 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        Verify Certificate
                      </a>
                    )}
                    {certification.certificate_file_url && (
                      <a
                        href={certification.certificate_file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-3 bg-[var(--surface-hover)] hover:bg-[var(--background-secondary)] text-[var(--foreground)] rounded-lg font-semibold transition-all duration-200 border border-[var(--border)]"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Download Certificate
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function CertificationSection() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [courseCertifications, setCourseCertifications] = useState<
    Certification[]
  >([]);
  const [competitionCertifications, setCompetitionCertifications] = useState<
    Certification[]
  >([]);
  const [activeTab, setActiveTab] = useState<"course" | "competition">(
    "course"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] =
    useState<Certification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCertifications();
  }, []);

  useEffect(() => {
    // Filter certifications by category
    setCourseCertifications(
      certifications.filter((cert) => cert.category === "course")
    );
    setCompetitionCertifications(
      certifications.filter((cert) => cert.category === "competition")
    );
  }, [certifications]);

  const fetchCertifications = async () => {
    try {
      const response = await fetch("/api/certifications");
      if (response.ok) {
        const data = await response.json();
        setCertifications(data);
      } else {
        console.error("Failed to fetch certifications");
      }
    } catch (error) {
      console.error("Error fetching certifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCertificateClick = (cert: Certification) => {
    setSelectedCertificate(cert);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCertificate(null);
  };

  // Animation variants
  const ease: [number, number, number, number] = [0.4, 0, 0.2, 1];
  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
  };
  const gridVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeInOut } },
    hover: {
      scale: 1.05,
      y: -8,
      transition: { duration: 0.3, ease: easeInOut },
    },
  };

  const currentCertifications =
    activeTab === "course" ? courseCertifications : competitionCertifications;

  return (
    <>
      <motion.section
        id="certifications"
        className="py-16 lg:py-20 relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        {/* Unified Background - Matching Projects Section */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Subtle animated dot grid pattern - Same as Projects */}
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

          {/* Soft gradient overlay for depth - Same as Projects */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/30 to-indigo-50/20 dark:from-transparent dark:via-slate-900/50 dark:to-purple-950/10" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease }}
          >
            <Heading level={2} className="mb-6">
              Achievements &{" "}
              <span className="bg-gradient-to-r from-[var(--accent)] to-[#5856d6] bg-clip-text text-transparent">
                Certifications
              </span>
            </Heading>
            <p className="text-xl text-[var(--foreground-secondary)] max-w-3xl mx-auto leading-relaxed">
              I believe in continuous learning and staying updated with the
              latest technologies. Here are my professional certifications and
              competition achievements.
            </p>
          </motion.div>

          {/* Tab Navigation - Enhanced */}
          <motion.div
            className="flex justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease }}
          >
            <div className="flex space-x-1 bg-[var(--background-tertiary)]/80 backdrop-blur-sm p-1 rounded-xl border border-[var(--border)] shadow-2xl">
              <button
                onClick={() => setActiveTab("course")}
                className={`relative px-7 py-3 rounded-lg text-sm font-semibold focus:outline-none overflow-hidden
                  transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
                  ${
                    activeTab === "course"
                      ? "text-blue-300 shadow-md scale-105 z-10"
                      : "text-[var(--foreground-tertiary)] hover:text-blue-200"
                  }
                `}
                style={{
                  background:
                    activeTab === "course"
                      ? "linear-gradient(135deg, rgba(0,122,255,0.15) 0%, rgba(88,86,214,0.12) 100%)"
                      : "transparent",
                  boxShadow:
                    activeTab === "course"
                      ? "0 8px 32px 0 rgba(0,122,255,0.15)"
                      : "none",
                  border:
                    activeTab === "course"
                      ? "1.5px solid var(--accent)"
                      : "1.5px solid transparent",
                }}
              >
                <span className="relative z-10">
                  Course Certifications ({courseCertifications.length})
                </span>
              </button>
              <button
                onClick={() => setActiveTab("competition")}
                className={`relative px-7 py-3 rounded-lg text-sm font-semibold focus:outline-none overflow-hidden
                  transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
                  ${
                    activeTab === "competition"
                      ? "text-green-300 shadow-md scale-105 z-10"
                      : "text-[var(--foreground-tertiary)] hover:text-green-200"
                  }
                `}
                style={{
                  background:
                    activeTab === "competition"
                      ? "linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(0,122,255,0.12) 100%)"
                      : "transparent",
                  boxShadow:
                    activeTab === "competition"
                      ? "0 8px 32px 0 rgba(34,197,94,0.15)"
                      : "none",
                  border:
                    activeTab === "competition"
                      ? "1.5px solid #22c55e"
                      : "1.5px solid transparent",
                }}
              >
                <span className="relative z-10">
                  Competition Certificates ({competitionCertifications.length})
                </span>
              </button>
            </div>
          </motion.div>

          {/* Loading State */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-[var(--foreground-secondary)]">
                Loading certifications...
              </p>
            </div>
          ) : (
            <>
              {/* Enhanced Certifications Grid */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={gridVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                key={activeTab}
              >
                {currentCertifications.map((cert) => (
                  <motion.div
                    key={cert.id}
                    variants={cardVariants}
                    whileHover="hover"
                    whileTap={{ scale: 0.98 }}
                    className="cursor-pointer"
                    onClick={() => handleCertificateClick(cert)}
                  >
                    <div className="relative h-full group">
                      {/* Glowing border effect */}
                      <div
                        className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${
                          activeTab === "course"
                            ? "from-blue-500/20 to-purple-500/20"
                            : "from-green-500/20 to-blue-500/20"
                        } opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`}
                      />

                      <Card className="h-full relative bg-white/10 dark:bg-slate-800/10 backdrop-blur-sm border-white/20 dark:border-slate-700/20 hover:border-[var(--accent)]/40 transition-all duration-300 overflow-hidden">
                        <CardContent className="p-6 h-full flex flex-col">
                          {/* Certificate Image or Icon */}
                          {cert.image_url ? (
                            <motion.div
                              className="mb-6 overflow-hidden rounded-lg"
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.3 }}
                            >
                              <img
                                src={cert.image_url}
                                alt={`${cert.title} certificate`}
                                className="w-full h-48 object-cover shadow-lg bg-[var(--background-tertiary)]"
                              />
                            </motion.div>
                          ) : (
                            <motion.div
                              className={`h-20 bg-gradient-to-br ${
                                activeTab === "course"
                                  ? "from-blue-500/10 to-purple-500/10"
                                  : "from-green-500/10 to-blue-500/10"
                              } rounded-lg flex items-center justify-center mb-6`}
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div
                                className={
                                  activeTab === "course"
                                    ? "text-blue-400"
                                    : "text-green-400"
                                }
                              >
                                {activeTab === "course" ? (
                                  <svg
                                    className="w-10 h-10"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
                                  </svg>
                                ) : (
                                  <svg
                                    className="w-10 h-10"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M5,16L3,5H1V3H4L6,14H18.5L19.5,7H8.5V5H21L19,17H5M6,20A1,1 0 0,0 7,21A1,1 0 0,0 8,20A1,1 0 0,0 7,19A1,1 0 0,0 6,20M16,20A1,1 0 0,0 17,21A1,1 0 0,0 18,20A1,1 0 0,0 17,19A1,1 0 0,0 16,20Z" />
                                  </svg>
                                )}
                              </div>
                            </motion.div>
                          )}

                          {/* Always visible content */}
                          <h3 className="text-lg font-bold text-[var(--foreground)] mb-2 leading-tight line-clamp-2">
                            {cert.title}
                          </h3>

                          <p
                            className={`font-semibold mb-4 ${
                              activeTab === "course"
                                ? "text-blue-400"
                                : "text-green-400"
                            }`}
                          >
                            {cert.issuer}
                          </p>

                          {/* Progressive disclosure content - hidden by default, shown on hover */}
                          <motion.div
                            className="mt-auto opacity-0 group-hover:opacity-100 transition-all duration-300"
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                          >
                            <p className="text-[var(--foreground-tertiary)] text-sm mb-3">
                              Earned:{" "}
                              {new Date(cert.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                              })}
                            </p>

                            {cert.description && (
                              <p className="text-[var(--foreground-secondary)] text-sm mb-3 line-clamp-2">
                                {cert.description}
                              </p>
                            )}

                            {cert.credential_id && (
                              <p className="text-[var(--foreground-tertiary)] text-xs mb-4 font-mono bg-[var(--background-tertiary)] p-2 rounded">
                                ID: {cert.credential_id}
                              </p>
                            )}

                            <div className="text-xs text-[var(--foreground-tertiary)] italic">
                              Click to view details
                            </div>
                          </motion.div>
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Empty State */}
              {currentCertifications.length === 0 && (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-[var(--foreground-secondary)] text-lg">
                    No{" "}
                    {activeTab === "course"
                      ? "course certifications"
                      : "competition certificates"}{" "}
                    available.
                  </p>
                </motion.div>
              )}
            </>
          )}

          {/* Enhanced Animated Statistics */}
          <motion.div
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease }}
          >
            <motion.div
              className="group relative overflow-hidden"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-blue-600/5 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="relative p-8 bg-white/10 dark:bg-slate-800/10 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-slate-700/20 hover:border-blue-400/40 transition-all duration-300">
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Enhanced Icon with Animation */}
                  <motion.div
                    className="relative"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-shadow duration-300">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
                      </svg>
                    </div>
                    {/* Floating particles */}
                    <motion.div
                      className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100"
                      animate={{ y: [-2, -8, -2] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                      className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-300 rounded-full opacity-0 group-hover:opacity-100"
                      animate={{ y: [2, 6, 2] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    />
                  </motion.div>

                  <div className="space-y-2">
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                      <AnimatedCounter value={courseCertifications.length} />
                    </div>
                    <div className="text-sm font-semibold text-blue-400 uppercase tracking-wide">
                      Course Certifications
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="group relative overflow-hidden"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-green-600/5 to-emerald-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="relative p-8 bg-white/10 dark:bg-slate-800/10 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-slate-700/20 hover:border-green-400/40 transition-all duration-300">
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Enhanced Icon with Animation */}
                  <motion.div
                    className="relative"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-green-500/25 transition-shadow duration-300">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,6V8H13V6H11M11,10V18H13V10H11Z" />
                      </svg>
                    </div>
                    {/* Floating particles */}
                    <motion.div
                      className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full opacity-0 group-hover:opacity-100"
                      animate={{ y: [-2, -8, -2] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                      className="absolute -bottom-1 -left-1 w-2 h-2 bg-green-300 rounded-full opacity-0 group-hover:opacity-100"
                      animate={{ y: [2, 6, 2] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    />
                  </motion.div>

                  <div className="space-y-2">
                    <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                      <AnimatedCounter value={competitionCertifications.length} />
                    </div>
                    <div className="text-sm font-semibold text-green-400 uppercase tracking-wide">
                      Competition Certificates
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="group relative overflow-hidden"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-purple-600/5 to-indigo-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-purple-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="relative p-8 bg-white/10 dark:bg-slate-800/10 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-slate-700/20 hover:border-purple-400/40 transition-all duration-300">
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Enhanced Icon with Animation */}
                  <motion.div
                    className="relative"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-shadow duration-300">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12,2L13.09,8.26L22,9L16.91,13.74L18.18,21.02L12,17.77L5.82,21.02L7.09,13.74L2,9L10.91,8.26L12,2Z" />
                      </svg>
                    </div>
                    {/* Floating particles */}
                    <motion.div
                      className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100"
                      animate={{ y: [-2, -8, -2] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                      className="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-300 rounded-full opacity-0 group-hover:opacity-100"
                      animate={{ y: [2, 6, 2] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    />
                  </motion.div>

                  <div className="space-y-2">
                    <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                      <AnimatedCounter value={certifications.length} />
                    </div>
                    <div className="text-sm font-semibold text-purple-400 uppercase tracking-wide">
                      Total Achievements
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="group relative overflow-hidden"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-orange-600/5 to-red-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-orange-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="relative p-8 bg-white/10 dark:bg-slate-800/10 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-slate-700/20 hover:border-orange-400/40 transition-all duration-300">
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Enhanced Icon with Animation */}
                  <motion.div
                    className="relative"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-orange-500/25 transition-shadow duration-300">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M13,2.05V4.05C17.39,4.59 20.5,8.58 20.5,13C20.5,15.21 19.71,17.21 18.4,18.85L16.68,17.13C17.54,15.89 18,14.5 18,13C18,9.69 15.31,7 12,7V9.79L7.5,5.29L12,0.79V2.05C16.18,2.05 19.5,5.37 19.5,9.55C19.5,10.53 19.3,11.47 18.93,12.33L17.21,10.61C17.43,10.14 17.5,9.58 17.5,9C17.5,6.79 15.71,5 13,5V2.05M12,11C10.9,11 10,11.9 10,13C10,14.1 10.9,15 12,15C13.1,15 14,14.1 14,13C14,11.9 13.1,11 12,11M6.5,13C6.5,8.58 9.61,4.59 14,4.05V2.05C9.82,2.05 6.5,5.37 6.5,9.55C6.5,10.53 6.7,11.47 7.07,12.33L8.79,10.61C8.57,10.14 8.5,9.58 8.5,9C8.5,6.79 10.29,5 13,5V7C9.69,7 7,9.69 7,13C7,14.5 7.46,15.89 8.32,17.13L10.04,18.85C8.73,17.21 7.93,15.21 7.93,13H6.5Z" />
                      </svg>
                    </div>
                    {/* Floating particles */}
                    <motion.div
                      className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100"
                      animate={{ y: [-2, -8, -2] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                      className="absolute -bottom-1 -left-1 w-2 h-2 bg-orange-300 rounded-full opacity-0 group-hover:opacity-100"
                      animate={{ y: [2, 6, 2] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    />
                  </motion.div>

                  <div className="space-y-2">
                    <div className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                      <AnimatedCounter value={100} />%
                    </div>
                    <div className="text-sm font-semibold text-orange-400 uppercase tracking-wide">
                      Commitment to Learning
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Certificate Modal */}
      <CertificateModal
        certification={selectedCertificate}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
