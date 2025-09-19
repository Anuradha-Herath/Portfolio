"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Certification } from "@/lib/types";

// Lazy-loaded image component for better performance
function LazyImage({ src, alt, className }: { src: string; alt: string; className: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative">
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-[var(--background-tertiary)] animate-pulse rounded-lg flex items-center justify-center">
          <LoadingSpinner size="sm" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
      {hasError && (
        <div className="absolute inset-0 bg-[var(--background-tertiary)] rounded-lg flex items-center justify-center">
          <svg className="w-8 h-8 text-[var(--foreground-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
    </div>
  );
}

// Optimized Animated Counter Component for Statistics
interface AnimatedCounterProps {
  value: number;
  duration?: number;
}

function AnimatedCounter({ value, duration = 2 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Skip animation on mobile for better performance
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setCount(value);
      return;
    }

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

// Optimized Certificate Modal Component
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
  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  if (!certification) return null;

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
            className="fixed inset-0 z-[70] flex items-center justify-center p-2 sm:p-4"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div
              className="w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] bg-[var(--surface)] rounded-2xl shadow-2xl border border-[var(--border)] overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[95vh] sm:max-h-[90vh] relative">
                {/* Close Button - optimized for mobile */}
                <button
                  onClick={onClose}
                  className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-9 sm:h-9 bg-[var(--background-secondary)] hover:bg-[var(--surface-hover)] rounded-full flex items-center justify-center text-[var(--foreground-tertiary)] hover:text-[var(--foreground)] transition-all duration-200 ring-2 ring-[var(--accent)]/20 hover:ring-[var(--accent)]/40 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[var(--accent)]/40"
                  style={{ boxShadow: "0 4px 16px 0 rgba(0,0,0,0.10)" }}
                  aria-label="Close"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
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
                  <div className="mb-4 sm:mb-6">
                    <LazyImage
                      src={certification.image_url}
                      alt={`${certification.title} certificate`}
                      className="w-full max-w-2xl mx-auto rounded-xl shadow-lg bg-[var(--background-tertiary)]"
                    />
                  </div>
                )}

                {/* Certificate Details - responsive text sizes */}
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-2">
                      {certification.title}
                    </h2>
                    <p className="text-lg sm:text-xl text-[var(--accent)] font-semibold">
                      {certification.issuer}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold text-[var(--foreground-tertiary)] uppercase tracking-wide mb-2">
                        Date Earned
                      </h3>
                      <p className="text-[var(--foreground-secondary)] text-sm sm:text-base">
                        {formatDate(certification.date)}
                      </p>
                    </div>

                    {certification.credential_id && (
                      <div>
                        <h3 className="text-xs sm:text-sm font-semibold text-[var(--foreground-tertiary)] uppercase tracking-wide mb-2">
                          Credential ID
                        </h3>
                        <p className="text-[var(--foreground-secondary)] font-mono bg-[var(--background-tertiary)] p-2 rounded text-xs sm:text-sm break-all">
                          {certification.credential_id}
                        </p>
                      </div>
                    )}
                  </div>

                  {certification.description && (
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold text-[var(--foreground-tertiary)] uppercase tracking-wide mb-2">
                        Description
                      </h3>
                      <p className="text-[var(--foreground-secondary)] leading-relaxed text-sm sm:text-base">
                        {certification.description}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons - responsive sizing */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                    {certification.url && (
                      <a
                        href={certification.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-4 sm:px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent)]/80 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
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
  const [activeTab, setActiveTab] = useState<"course" | "competition">("course");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState<Certification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Memoized filtered certifications for better performance
  const { courseCertifications, competitionCertifications } = useMemo(() => {
    const course = certifications.filter((cert) => cert.category === "course");
    const competition = certifications.filter((cert) => cert.category === "competition");
    return { courseCertifications: course, competitionCertifications: competition };
  }, [certifications]);

  // Optimized fetch function with error handling
  const fetchCertifications = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchCertifications();
  }, [fetchCertifications]);

  // Optimized modal handlers
  const handleCertificateClick = useCallback((cert: Certification) => {
    setSelectedCertificate(cert);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedCertificate(null);
  }, []);

  // Animation variants - optimized for mobile
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

  const currentCertifications = activeTab === "course" ? courseCertifications : competitionCertifications;

  return (
    <>
      <motion.section
        id="certifications"
        className="py-12 sm:py-16 lg:py-20 relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        {/* Unified Background - Matching Projects Section */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Subtle animated dot grid pattern - Same as Projects */}
          <motion.div
            className="absolute inset-0 opacity-[0.08]"
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
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-slate-900/50 to-purple-950/10" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-12 sm:mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease }}
          >
            <Heading level={2} className="mb-4 sm:mb-6 text-2xl sm:text-3xl lg:text-4xl">
              Achievements &{" "}
              <span className="bg-gradient-to-r from-[var(--accent)] to-[#5856d6] bg-clip-text text-transparent">
                Certifications
              </span>
            </Heading>
            <p className="text-base sm:text-xl text-[var(--foreground-secondary)] max-w-3xl mx-auto leading-relaxed px-2">
              I believe in continuous learning and staying updated with the
              latest technologies. Here are my professional certifications and
              competition achievements.
            </p>
          </motion.div>

          {/* Enhanced Tab Navigation - Mobile Optimized */}
          <motion.div
            className="flex justify-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease }}
          >
            <div className="relative w-full max-w-md sm:max-w-lg">
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 rounded-2xl blur-2xl opacity-50" />

              {/* Main container */}
              <div className="relative flex bg-slate-900/20 backdrop-blur-md p-1 sm:p-2 rounded-2xl border border-slate-700/30 shadow-2xl">
                {/* Course Certifications Button */}
                <motion.button
                  onClick={() => setActiveTab("course")}
                  className="relative flex-1 px-3 sm:px-8 py-3 sm:py-4 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none overflow-hidden group transition-all duration-500 ease-out"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    background: activeTab === "course"
                      ? "linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(147,51,234,0.15) 100%)"
                      : "transparent",
                    boxShadow: activeTab === "course"
                      ? "0 10px 40px rgba(59,130,246,0.3), inset 0 1px 0 rgba(255,255,255,0.1)"
                      : "none",
                    border: activeTab === "course"
                      ? "1px solid rgba(59,130,246,0.4)"
                      : "1px solid transparent",
                  }}
                >
                  {/* Animated background gradient */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                    animate={{ opacity: activeTab === "course" ? 0.1 : 0 }}
                  />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center space-y-1 sm:space-y-2">
                    {/* Icon */}
                    <motion.div
                      className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors duration-300"
                      animate={{
                        rotate: activeTab === "course" ? [0, -5, 5, 0] : 0,
                        scale: activeTab === "course" ? 1.1 : 1
                      }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      <svg
                        className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300 ${
                          activeTab === "course"
                            ? "text-blue-300"
                            : "text-blue-400/70 group-hover:text-blue-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12,2L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
                        <path d="M9,5V7H15V5H9M9,9V11H15V9H9Z" opacity="0.3" />
                      </svg>
                    </motion.div>

                    {/* Text */}
                    <div className="text-center">
                      <div
                        className={`font-bold transition-colors duration-300 text-xs sm:text-sm ${
                          activeTab === "course"
                            ? "text-blue-200"
                            : "text-slate-300 group-hover:text-blue-200"
                        }`}
                      >
                        Course
                      </div>
                      <div
                        className={`text-xs font-medium transition-colors duration-300 ${
                          activeTab === "course"
                            ? "text-blue-300/80"
                            : "text-slate-400 group-hover:text-blue-300/70"
                        }`}
                      >
                        {courseCertifications.length}
                      </div>
                    </div>
                  </div>

                  {/* Active indicator */}
                  {activeTab === "course" && (
                    <motion.div
                      className="absolute bottom-1 sm:bottom-2 inset-x-0 mx-auto w-8 sm:w-12 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                      layoutId="activeTab"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>

                {/* Competition Certificates Button */}
                <motion.button
                  onClick={() => setActiveTab("competition")}
                  className="relative flex-1 px-3 sm:px-8 py-3 sm:py-4 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none overflow-hidden group transition-all duration-500 ease-out"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    background: activeTab === "competition"
                      ? "linear-gradient(135deg, rgba(34,197,94,0.2) 0%, rgba(59,130,246,0.15) 100%)"
                      : "transparent",
                    boxShadow: activeTab === "competition"
                      ? "0 10px 40px rgba(34,197,94,0.3), inset 0 1px 0 rgba(255,255,255,0.1)"
                      : "none",
                    border: activeTab === "competition"
                      ? "1px solid rgba(34,197,94,0.4)"
                      : "1px solid transparent",
                  }}
                >
                  {/* Animated background gradient */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                    animate={{ opacity: activeTab === "competition" ? 0.1 : 0 }}
                  />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center space-y-1 sm:space-y-2">
                    {/* Icon */}
                    <motion.div
                      className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-green-500/20 group-hover:bg-green-500/30 transition-colors duration-300"
                      animate={{
                        rotate: activeTab === "competition" ? [0, -5, 5, 0] : 0,
                        scale: activeTab === "competition" ? 1.1 : 1
                      }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      <svg
                        className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300 ${
                          activeTab === "competition"
                            ? "text-green-300"
                            : "text-green-400/70 group-hover:text-green-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M18,2A2,2 0 0,1 20,4V5L22,7V8H18V7H16V8H2V7L4,5V4A2,2 0 0,1 6,2H18M18,4H6V5.83L7.83,7H16.17L18,5.83V4M22,9V10H18V12.5L16,14.5V16A2,2 0 0,1 14,18H10A2,2 0 0,1 8,16V14.5L6,12.5V10H2V9H22M10,10V12.5L12,14.5L14,12.5V10H10Z" />
                      </svg>
                    </motion.div>

                    {/* Text */}
                    <div className="text-center">
                      <div
                        className={`font-bold transition-colors duration-300 text-xs sm:text-sm ${
                          activeTab === "competition"
                            ? "text-green-200"
                            : "text-slate-300 group-hover:text-green-200"
                        }`}
                      >
                        Competition
                      </div>
                      <div
                        className={`text-xs font-medium transition-colors duration-300 ${
                          activeTab === "competition"
                            ? "text-green-300/80"
                            : "text-slate-400 group-hover:text-green-300/70"
                        }`}
                      >
                        {competitionCertifications.length}
                      </div>
                    </div>
                  </div>

                  {/* Active indicator */}
                  {activeTab === "competition" && (
                    <motion.div
                      className="absolute bottom-1 sm:bottom-2 inset-x-0 mx-auto w-8 sm:w-12 h-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"
                      layoutId="activeTab"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center py-12 sm:py-20">
              <LoadingSpinner
                size="lg"
                text="Loading certifications..."
                showDots={true}
              />
            </div>
          ) : (
            <>
              {/* Enhanced Certifications Grid - Mobile Optimized */}
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
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

                      <Card className="h-full relative bg-slate-800/10 backdrop-blur-sm border-slate-700/20 hover:border-[var(--accent)]/40 transition-all duration-300 overflow-hidden">
                        <CardContent className="p-4 sm:p-6 h-full flex flex-col">
                          {/* Certificate Image or Icon */}
                          {cert.image_url ? (
                            <motion.div
                              className="mb-4 sm:mb-6 overflow-hidden rounded-lg"
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.3 }}
                            >
                              <LazyImage
                                src={cert.image_url}
                                alt={`${cert.title} certificate`}
                                className="w-full h-32 sm:h-40 lg:h-48 object-cover shadow-lg bg-[var(--background-tertiary)]"
                              />
                            </motion.div>
                          ) : (
                            <motion.div
                              className={`h-16 sm:h-20 bg-gradient-to-br ${
                                activeTab === "course"
                                  ? "from-blue-500/10 to-purple-500/10"
                                  : "from-green-500/10 to-blue-500/10"
                              } rounded-lg flex items-center justify-center mb-4 sm:mb-6`}
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
                          <h3 className="text-base sm:text-lg font-bold text-[var(--foreground)] mb-2 leading-tight line-clamp-2">
                            {cert.title}
                          </h3>

                          <p
                            className={`font-semibold mb-3 sm:mb-4 text-sm sm:text-base ${
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
                            <p className="text-[var(--foreground-tertiary)] text-xs sm:text-sm mb-2 sm:mb-3">
                              Earned:{" "}
                              {new Date(cert.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                              })}
                            </p>

                            {cert.description && (
                              <p className="text-[var(--foreground-secondary)] text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">
                                {cert.description}
                              </p>
                            )}

                            {cert.credential_id && (
                              <p className="text-[var(--foreground-tertiary)] text-xs mb-3 sm:mb-4 font-mono bg-[var(--background-tertiary)] p-2 rounded break-all">
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
                  className="text-center py-8 sm:py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-[var(--foreground-secondary)] text-base sm:text-lg px-4">
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
