"use client";
import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Project } from "@/lib/types";
import { Button } from "@/components/ui/Button";

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  // Gallery state management
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoadingStates, setImageLoadingStates] = useState<Record<number, boolean>>({});
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  // Initialize loading states for gallery images
  useEffect(() => {
    if (project?.additional_images) {
      const initialStates: Record<number, boolean> = {};
      project.additional_images.forEach((_, index) => {
        initialStates[index] = true; // Start with loading state
      });
      setImageLoadingStates(initialStates);
    }
  }, [project?.additional_images]);
  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "unset";
  };

  const nextImage = useCallback(() => {
    if (project?.additional_images) {
      setCurrentImageIndex((prev) => 
        (prev + 1) % project.additional_images!.length
      );
    }
  }, [project?.additional_images]);

  const prevImage = useCallback(() => {
    if (project?.additional_images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? project.additional_images!.length - 1 : prev - 1
      );
    }
  }, [project?.additional_images]);

  const handleImageLoad = (index: number) => {
    setImageLoadingStates(prev => ({ ...prev, [index]: false }));
  };

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set(prev).add(index));
    setImageLoadingStates(prev => ({ ...prev, [index]: false }));
  };

  // Handle escape key for lightbox
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightboxOpen) {
          closeLightbox();
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, lightboxOpen, nextImage, prevImage]);

  // Handle keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyNavigation = (e: KeyboardEvent) => {
      if (!lightboxOpen || !project?.additional_images) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevImage();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nextImage();
      }
    };

    if (lightboxOpen) {
      document.addEventListener("keydown", handleKeyNavigation);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyNavigation);
    };
  }, [lightboxOpen, project?.additional_images]);

  const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.3
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  const modalVariants: Variants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8, 
      y: 50,
      rotateX: -15
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        mass: 1
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      y: 30,
      rotateX: 10,
      transition: {
        duration: 0.2
      }
    }
  };

  const contentVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.1,
        duration: 0.4
      }
    }
  };

  const getTechBadgeColor = (category: string) => {
    const colors = {
      languages: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700/50",
      frontend: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700/50",
      backend: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700/50",
      database: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700/50",
      apis_tools: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700/50"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-700/50";
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      languages: "Languages",
      frontend: "Frontend",
      backend: "Backend", 
      database: "Database",
      apis_tools: "APIs & Tools"
    };
    return labels[category as keyof typeof labels] || category;
  };

  if (!project) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="project-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            variants={modalVariants}
            className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-slate-200/50 dark:border-slate-700/50"
            style={{ perspective: "1000px" }}
          >
            {/* Close Button */}
            <motion.button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 transition-all duration-200 shadow-lg"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            {/* Scrollable Content */}
            <div className="max-h-[90vh] overflow-y-auto">
              <motion.div variants={contentVariants}>
                {/* Header Image */}
                <div className="relative h-64 lg:h-80 overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <motion.div
                        className="text-white/90"
                        animate={{ y: [-5, 5, -5] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                        </svg>
                      </motion.div>
                    </div>
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  {/* Project Status and Type Badges */}
                  <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                    <motion.span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg ${
                        project.status === 'completed' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-yellow-500 text-yellow-900'
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {project.status === 'completed' ? 'Completed' : 'Ongoing'}
                    </motion.span>
                    <motion.span
                      className="px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-500 text-white shadow-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {project.type === 'individual' ? 'Solo Project' : 'Team Project'}
                    </motion.span>
                    {project.featured && (
                      <motion.span
                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-yellow-500 text-yellow-900 shadow-lg flex items-center gap-1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Featured
                      </motion.span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 lg:p-10">
                  {/* Title and Basic Info */}
                  <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                      {project.title}
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                      {project.description}
                    </p>
                    
                    {/* Additional Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      {project.project_type_detail && (
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Project Type</h4>
                          <p className="text-slate-600 dark:text-slate-300 text-sm">{project.project_type_detail}</p>
                        </div>
                      )}
                      {project.role && (
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-1">My Role</h4>
                          <p className="text-slate-600 dark:text-slate-300 text-sm">{project.role}</p>
                        </div>
                      )}
                      {project.duration && (
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Duration</h4>
                          <p className="text-slate-600 dark:text-slate-300 text-sm">{project.duration}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Technologies Used */}
                  {project.technologies_used && (
                    <motion.div
                      className="mb-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                        Technologies Used
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(project.technologies_used).map(([category, techs]) => (
                          (techs as string[]).map((tech, index) => (
                            <motion.span
                              key={`${category}-${tech}`}
                              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${getTechBadgeColor(category)}`}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.5 + index * 0.02 }}
                              whileHover={{ scale: 1.05 }}
                              title={getCategoryLabel(category)}
                            >
                              {tech}
                            </motion.span>
                          ))
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Key Features */}
                  {project.key_features && project.key_features.length > 0 && (
                    <motion.div
                      className="mb-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                        Key Features
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {project.key_features.map((feature, index) => (
                          <motion.div
                            key={`feature-${index}`}
                            className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                          >
                            <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0" />
                            <p className="text-slate-700 dark:text-slate-300 text-sm">{feature}</p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* My Contributions */}
                  {project.my_contributions && project.my_contributions.length > 0 && (
                    <motion.div
                      className="mb-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                        My Contributions
                      </h3>
                      <div className="space-y-3">
                        {project.my_contributions.map((contribution, index) => (
                          <motion.div
                            key={`contribution-${index}`}
                            className="flex items-start gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/50"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + index * 0.1 }}
                          >
                            <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0" />
                            <p className="text-slate-700 dark:text-slate-300 text-sm">{contribution}</p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Enhanced Project Gallery */}
                  {project.additional_images && project.additional_images.length > 0 && (
                    <motion.div
                      className="mb-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                          Project Gallery
                        </h3>
                        <motion.span
                          className="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.8 }}
                        >
                          {project.additional_images.length} {project.additional_images.length === 1 ? 'image' : 'images'}
                        </motion.span>
                      </div>

                      {/* Gallery Grid with Masonry-like Layout */}
                      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                        {project.additional_images.map((imageUrl, index) => (
                          <motion.div
                            key={`gallery-${index}`}
                            className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 shadow-md hover:shadow-xl transition-all duration-300"
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{
                              delay: 0.8 + index * 0.1,
                              type: "spring",
                              stiffness: 100,
                              damping: 15
                            }}
                            whileHover={{ y: -4 }}
                            onClick={() => openLightbox(index)}
                          >
                            {/* Loading Skeleton */}
                            {imageLoadingStates[index] !== false && (
                              <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-xl">
                                <div className="w-full h-48 flex items-center justify-center">
                                  <div className="w-8 h-8 border-2 border-slate-400 dark:border-slate-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                              </div>
                            )}

                            {/* Main Image */}
                            <div className="relative overflow-hidden rounded-xl">
                              <img
                                src={imageUrl}
                                alt={`${project.title} screenshot ${index + 1}`}
                                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                                loading="lazy"
                                onLoad={() => handleImageLoad(index)}
                                onError={() => handleImageError(index)}
                              />

                              {/* Error State */}
                              {imageErrors.has(index) && (
                                <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 flex items-center justify-center rounded-xl">
                                  <div className="text-center text-slate-500 dark:text-slate-400">
                                    <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    <p className="text-sm">Failed to load image</p>
                                  </div>
                                </div>
                              )}

                              {/* Hover Overlay */}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <motion.div
                                  className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full p-3 shadow-lg"
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  whileHover={{ scale: 1.1, opacity: 1 }}
                                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                  <svg className="w-6 h-6 text-slate-700 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                  </svg>
                                </motion.div>
                              </div>

                              {/* Image Number Badge */}
                              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {index + 1}
                              </div>
                            </div>

                            {/* Image Caption */}
                            <div className="p-3 bg-white dark:bg-slate-800">
                              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                                Screenshot {index + 1}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Click to view full size
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Gallery Stats */}
                      <motion.div
                        className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                      >
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-300">
                            📸 {project.additional_images.length} high-quality screenshots
                          </span>
                          <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                            Interactive Gallery
                          </span>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <motion.div
                    className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200 dark:border-slate-700"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    {project.github_url && (
                      <motion.div
                        className="flex-1"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant="outline"
                          size="lg"
                          className="w-full border-slate-300 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                        >
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 w-full"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            View Source Code
                          </a>
                        </Button>
                      </motion.div>
                    )}
                    {project.live_url && (
                      <motion.div
                        className="flex-1"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          size="lg"
                          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
                        >
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 w-full"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            View Live Demo
                          </a>
                        </Button>
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Enhanced Lightbox Gallery */}
      <AnimatePresence mode="wait">
        {lightboxOpen && project?.additional_images && (
          <motion.div
            key="lightbox-modal"
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Close Button */}
            <motion.button
              onClick={closeLightbox}
              className="absolute top-6 right-6 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            {/* Navigation Buttons */}
            {project.additional_images.length > 1 && (
              <>
                <motion.button
                  onClick={prevImage}
                  className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200"
                  whileHover={{ scale: 1.1, x: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>

                <motion.button
                  onClick={nextImage}
                  className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200"
                  whileHover={{ scale: 1.1, x: 2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </>
            )}

            {/* Main Image Container */}
            <div className="h-full flex items-center justify-center p-6">
              <motion.div
                className="relative max-w-7xl max-h-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                key={currentImageIndex}
              >
                <img
                  src={project.additional_images[currentImageIndex]}
                  alt={`${project.title} screenshot ${currentImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                />

                {/* Image Info Overlay */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 rounded-b-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center justify-between text-white">
                    <div>
                      <h4 className="text-lg font-semibold mb-1">{project.title}</h4>
                      <p className="text-sm text-white/80">
                        Screenshot {currentImageIndex + 1} of {project.additional_images.length}
                      </p>
                    </div>

                    {/* Image Counter Dots */}
                    <div className="flex gap-2">
                      {project.additional_images.map((_, index) => (
                        <button
                          key={`lightbox-dot-${index}`}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-200 ${
                            index === currentImageIndex
                              ? 'bg-white scale-125'
                              : 'bg-white/40 hover:bg-white/60'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Keyboard Navigation Hint */}
            <motion.div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/80 text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Use ← → arrow keys or click to navigate • Press ESC to close
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}
