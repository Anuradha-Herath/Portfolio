"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
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
  const [lightboxZoom, setLightboxZoom] = useState(1);
  const [lightboxPan, setLightboxPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [transitionDirection, setTransitionDirection] = useState<'left' | 'right' | null>(null);
  
  // Performance optimizations
  const [visibleImages, setVisibleImages] = useState<Set<number>>(new Set());
  const preloadedImagesRef = useRef<Set<number>>(new Set());
  const [isMobile, setIsMobile] = useState(false);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  // Mobile-specific state for touch gestures
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  // Initialize loading states for gallery images
  useEffect(() => {
    if (project?.additional_images) {
      const initialStates: Record<number, boolean> = {};
      project.additional_images.forEach((_, index) => {
        initialStates[index] = true; // Start with loading state
      });
      setImageLoadingStates(initialStates);
      
      // Reset visibility and preloading state
      setVisibleImages(new Set());
      preloadedImagesRef.current = new Set();
    }
  }, [project?.additional_images]);

  // Preload adjacent images for smoother navigation
  const preloadAdjacentImages = useCallback((currentIndex: number) => {
    if (!project?.additional_images) return;

    const imagesToPreload = [];
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : project.additional_images.length - 1;
    const nextIndex = currentIndex < project.additional_images.length - 1 ? currentIndex + 1 : 0;

    if (!preloadedImagesRef.current.has(prevIndex)) {
      imagesToPreload.push(prevIndex);
    }
    if (!preloadedImagesRef.current.has(nextIndex)) {
      imagesToPreload.push(nextIndex);
    }

    imagesToPreload.forEach(index => {
      if (project.additional_images) {
        const img = new Image();
        img.src = project.additional_images[index];
        img.onload = () => {
          preloadedImagesRef.current.add(index);
        };
      }
    });
  }, [project?.additional_images]);

  // Setup intersection observer for lazy loading
  useEffect(() => {
    if (!project?.additional_images || !isOpen) return;

    const observerOptions = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-image-index') || '0');
          setVisibleImages(prev => new Set(prev).add(index));
          
          // Preload adjacent images for better performance
          preloadAdjacentImages(index);
        }
      });
    }, observerOptions);

    // Observe all image containers
    imageRefs.current.forEach((ref, index) => {
      if (ref && observerRef.current) {
        observerRef.current.observe(ref);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      // Cleanup preloaded images
      preloadedImagesRef.current = new Set();
      setVisibleImages(new Set());
    };
  }, [project?.additional_images, isOpen, isMobile, preloadAdjacentImages]);

  // Detect mobile device for performance optimizations
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxZoom(1);
    setLightboxPan({ x: 0, y: 0 });
    setTransitionDirection(null);
    document.body.style.overflow = "unset";
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  const nextImage = useCallback(() => {
    if (project?.additional_images) {
      setTransitionDirection('right');
      setCurrentImageIndex((prev) => 
        (prev + 1) % project.additional_images!.length
      );
      // Reset zoom and pan when changing images
      setLightboxZoom(1);
      setLightboxPan({ x: 0, y: 0 });
    }
  }, [project?.additional_images]);

  const prevImage = useCallback(() => {
    if (project?.additional_images) {
      setTransitionDirection('left');
      setCurrentImageIndex((prev) => 
        prev === 0 ? project.additional_images!.length - 1 : prev - 1
      );
      // Reset zoom and pan when changing images
      setLightboxZoom(1);
      setLightboxPan({ x: 0, y: 0 });
    }
  }, [project?.additional_images]);

  const goToImage = useCallback((index: number) => {
    if (project?.additional_images && index !== currentImageIndex) {
      setTransitionDirection(index > currentImageIndex ? 'right' : 'left');
      setCurrentImageIndex(index);
      // Reset zoom and pan when changing images
      setLightboxZoom(1);
      setLightboxPan({ x: 0, y: 0 });
    }
  }, [project?.additional_images, currentImageIndex]);

  const handleZoomIn = () => {
    setLightboxZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setLightboxZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleZoomReset = () => {
    setLightboxZoom(1);
    setLightboxPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (lightboxZoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - lightboxPan.x, y: e.clientY - lightboxPan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && lightboxZoom > 1) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      // Constrain pan to prevent image from going too far off-screen
      const maxPanX = (lightboxZoom - 1) * 200;
      const maxPanY = (lightboxZoom - 1) * 150;
      setLightboxPan({
        x: Math.max(-maxPanX, Math.min(maxPanX, newX)),
        y: Math.max(-maxPanY, Math.min(maxPanY, newY))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleImageLoad = (index: number) => {
    setImageLoadingStates(prev => ({ ...prev, [index]: false }));
  };

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set(prev).add(index));
    setImageLoadingStates(prev => ({ ...prev, [index]: false }));
  };

  // Touch gesture handlers for mobile swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && project?.additional_images) {
      nextImage();
    }
    if (isRightSwipe && project?.additional_images) {
      prevImage();
    }
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

  // Reset transition direction after animation
  useEffect(() => {
    if (transitionDirection) {
      const timer = setTimeout(() => {
        setTransitionDirection(null);
      }, 300); // Match the slide transition duration
      return () => clearTimeout(timer);
    }
  }, [transitionDirection]);

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
      scale: isMobile ? 0.95 : 0.8, 
      y: isMobile ? 20 : 50,
      rotateX: isMobile ? 0 : -15
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      rotateX: 0,
      transition: {
        type: isMobile ? "tween" : "spring",
        stiffness: isMobile ? undefined : 200,
        damping: isMobile ? undefined : 20,
        mass: isMobile ? undefined : 1,
        duration: isMobile ? 0.2 : undefined
      }
    },
    exit: { 
      opacity: 0, 
      scale: isMobile ? 0.95 : 0.9, 
      y: isMobile ? 20 : 30,
      rotateX: isMobile ? 0 : 10,
      transition: {
        duration: isMobile ? 0.15 : 0.2
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

  // Enhanced lightbox slide variants with direction awareness
  const slideVariants: Variants = {
    enter: (direction: 'left' | 'right' | null) => ({
      x: direction === 'right' ? 1000 : direction === 'left' ? -1000 : 0,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: 'left' | 'right' | null) => ({
      x: direction === 'right' ? -1000 : direction === 'left' ? 1000 : 0,
      opacity: 0,
      scale: 0.8,
    }),
  };

  const slideTransition = {
    type: isMobile ? "tween" as const : "spring" as const,
    stiffness: isMobile ? undefined : 300,
    damping: isMobile ? undefined : 30,
    duration: isMobile ? 0.3 : undefined
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
            className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full mx-4 sm:mx-6 md:mx-auto md:max-w-4xl max-h-[90vh] overflow-hidden border border-slate-200/50 dark:border-slate-700/50"
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
                <div className="relative h-64 lg:h-80 overflow-hidden bg-gradient-to-br from-blue-500 via-purple-500 to-rose-500">
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
                <div className="p-4 sm:p-6 md:p-8 lg:p-10">
                  {/* Title and Basic Info */}
                  <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                      {project.title}
                    </h2>
                    <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                      {project.description}
                    </p>
                    
                    {/* Additional Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-6">
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
                              transition={{ delay: 0.5 + index * (isMobile ? 0.01 : 0.02) }}
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {project.key_features.map((feature, index) => (
                          <motion.div
                            key={`feature-${index}`}
                            className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                          >
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
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
                            className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/50"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + index * 0.1 }}
                          >
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
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
                      <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 sm:gap-4 space-y-3 sm:space-y-4">
                        {project.additional_images.map((imageUrl, index) => (
                          <motion.div
                            key={`gallery-${index}`}
                            ref={(el) => {
                              imageRefs.current[index] = el;
                            }}
                            data-image-index={index}
                            className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 shadow-md hover:shadow-xl transition-all duration-300"
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{
                              delay: isMobile ? 0.8 + index * 0.05 : 0.8 + index * 0.1,
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

                            {/* Main Image - Only render if visible */}
                            {visibleImages.has(index) && (
                              <div className="relative overflow-hidden rounded-xl">
                                <img
                                  src={imageUrl}
                                  alt={`${project.title} screenshot ${index + 1}`}
                                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                                  loading="lazy"
                                  decoding="async"
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
                            )}

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
                        className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                      >
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-300">
                            📸 {project.additional_images.length} high-quality screenshots
                          </span>
                          <span className="text-blue-600 dark:text-blue-400 font-medium">
                            Interactive Gallery
                          </span>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <motion.div
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 border-t border-slate-200 dark:border-slate-700"
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
                          className="w-full border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
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
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
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
      <AnimatePresence mode="wait" custom={transitionDirection}>
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

            {/* Zoom Controls */}
            <motion.div
              className="absolute top-6 left-6 z-20 flex gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.button
                onClick={handleZoomOut}
                disabled={lightboxZoom <= 0.5}
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </motion.button>

              <motion.button
                onClick={handleZoomReset}
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-xs font-semibold">{Math.round(lightboxZoom * 100)}%</span>
              </motion.button>

              <motion.button
                onClick={handleZoomIn}
                disabled={lightboxZoom >= 3}
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </motion.button>
            </motion.div>

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
                className="relative max-w-7xl w-full h-full flex items-center justify-center"
                custom={transitionDirection}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={slideTransition}
                key={currentImageIndex}
              >
                <div
                  className={`relative max-w-full max-h-full overflow-hidden rounded-lg shadow-2xl ${isMobile ? 'cursor-grab' : lightboxZoom > 1 ? 'cursor-grab' : ''} ${isDragging ? 'cursor-grabbing' : ''}`}
                  onMouseDown={!isMobile ? handleMouseDown : undefined}
                  onMouseMove={!isMobile ? handleMouseMove : undefined}
                  onMouseUp={!isMobile ? handleMouseUp : undefined}
                  onMouseLeave={!isMobile ? handleMouseUp : undefined}
                  onTouchStart={isMobile ? handleTouchStart : undefined}
                  onTouchMove={isMobile ? handleTouchMove : undefined}
                  onTouchEnd={isMobile ? handleTouchEnd : undefined}
                  onWheel={!isMobile ? handleWheel : undefined}
                  style={{
                    transform: `scale(${lightboxZoom}) translate(${lightboxPan.x}px, ${lightboxPan.y}px)`,
                    transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                  }}
                >
                  {/* Loading State */}
                  {imageLoadingStates[currentImageIndex] !== false && (
                    <div className="absolute inset-0 bg-slate-800 flex items-center justify-center rounded-lg">
                      <div className="text-center text-white">
                        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-sm">Loading image...</p>
                      </div>
                    </div>
                  )}

                  <img
                    src={project.additional_images[currentImageIndex]}
                    alt={`${project.title} screenshot ${currentImageIndex + 1}`}
                    className="w-full h-full object-contain select-none"
                    style={{
                      maxWidth: '100%',
                      maxHeight: 'calc(100vh - 200px)',
                      width: 'auto',
                      height: 'auto',
                      userSelect: 'none',
                      pointerEvents: 'none',
                    }}
                    onLoad={() => handleImageLoad(currentImageIndex)}
                    onError={() => handleImageError(currentImageIndex)}
                    draggable={false}
                  />

                  {/* Error State */}
                  {imageErrors.has(currentImageIndex) && (
                    <div className="absolute inset-0 bg-slate-800 flex items-center justify-center rounded-lg">
                      <div className="text-center text-white">
                        <svg className="w-16 h-16 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <p className="text-lg font-semibold mb-2">Failed to load image</p>
                        <p className="text-sm text-white/70">Please try again later</p>
                      </div>
                    </div>
                  )}
                </div>

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
                        <motion.button
                          key={`lightbox-dot-${index}`}
                          onClick={() => goToImage(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-200 ${
                            index === currentImageIndex
                              ? 'bg-white scale-125'
                              : 'bg-white/40 hover:bg-white/60'
                          }`}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Enhanced Keyboard Navigation Hint */}
            <motion.div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/80 text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-4">
                {isMobile ? (
                  <>
                    <span>Swipe to navigate</span>
                    <span>•</span>
                    <span>Pinch to zoom</span>
                  </>
                ) : (
                  <>
                    <span>Use ← → arrow keys to navigate</span>
                    <span>•</span>
                    <span>Mouse wheel to zoom</span>
                    <span>•</span>
                    <span>Press ESC to close</span>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}
