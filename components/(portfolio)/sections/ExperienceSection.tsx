"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Card, CardContent } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Experience } from "@/lib/types";

// Featured Experience Component for single experience showcase
const FeaturedExperience: React.FC<{
  experience: Experience;
  formatDate: (date: string) => string;
}> = ({ experience, formatDate }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
    rootMargin: "-50px 0px",
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as const,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  const techVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (index: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.8 + index * 0.1,
        duration: 0.4,
        type: "spring" as const,
        stiffness: 200,
      },
    }),
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="relative"
    >
      {/* Floating decorative elements */}
      <motion.div
        className="absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -bottom-10 -right-10 w-16 h-16 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.2, 0.4],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        <Card className="group relative overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl">
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 via-indigo-500/8 to-purple-500/8 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Subtle animated border */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/25 via-indigo-500/25 to-purple-500/25 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

          <CardContent className="relative p-8 lg:p-12">
            {/* Header with enhanced visual hierarchy */}
            <motion.div variants={itemVariants} className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-6">
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
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0H8m8 0v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6"
                  />
                </svg>
              </div>

              <motion.h3
                className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight"
                variants={itemVariants}
              >
                {experience.position}
              </motion.h3>

              <motion.div
                className="flex items-center justify-center gap-2 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4"
                variants={itemVariants}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h4a2 2 0 012 2v2a2 2 0 01-2 2H8a2 2 0 01-2-2v-2z"
                    clipRule="evenodd"
                  />
                </svg>
                {experience.company}
              </motion.div>

              <motion.div
                className="flex items-center justify-center gap-4 text-slate-600 dark:text-slate-400 mb-6"
                variants={itemVariants}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium">{experience.location}</span>
                </div>

                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold rounded-full border border-blue-200/50 dark:border-blue-700/50">
                    {formatDate(experience.start_date)} -{" "}
                    {experience.end_date ? formatDate(experience.end_date) : "Present"}
                  </span>
                </div>
              </motion.div>
            </motion.div>

            {/* Description with enhanced styling */}
            <motion.div
              variants={itemVariants}
              className="mb-8"
            >
              <div className="relative">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full opacity-30" />
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg pl-6 italic">
                  &quot;{experience.description}&quot;
                </p>
              </div>
            </motion.div>

            {/* Technologies with enhanced animations */}
            <motion.div variants={itemVariants} className="mb-6">
              <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Technologies Used
              </h4>
              <div className="flex flex-wrap gap-3">
                {experience.technologies.map((tech, techIndex) => (
                  <motion.span
                    key={tech}
                    custom={techIndex}
                    variants={techVariants}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-full border border-slate-200 dark:border-slate-600 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800/50 dark:hover:to-indigo-800/50 hover:border-blue-400 dark:hover:border-indigo-400 hover:text-blue-800 dark:hover:text-indigo-200 transition-all duration-300 shadow-sm hover:shadow-md"
                    whileHover={{
                      scale: 1.05,
                      y: -2,
                      transition: { type: "spring", stiffness: 300, damping: 20 }
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mr-2 animate-pulse" />
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Achievement indicator */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 text-sm"
            >
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Professional Experience</span>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export function ExperienceSection() {
  const [experienceData, setExperienceData] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await fetch('/api/experiences');
        if (response.ok) {
          const data = await response.json();
          setExperienceData(data);
        }
      } catch (error) {
        console.error('Error fetching experiences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <section
      id="experience"
      className="py-16 lg:py-20 relative overflow-hidden"
    >
      {/* Enhanced Background with floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated dot grid pattern */}
        <motion.div
          className="absolute inset-0 opacity-[0.08] dark:opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle, rgb(99 102 241) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
          animate={{
            opacity: [0.08, 0.15, 0.08],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-20 left-10 w-2 h-2 bg-blue-500/30 rounded-full"
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-32 right-16 w-3 h-3 bg-indigo-500/20 rounded-full"
          animate={{
            y: [0, 25, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Soft gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-indigo-50/10 dark:from-transparent dark:via-slate-900/30 dark:to-purple-950/5" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1] as const,
            delay: 0.1,
          }}
          className="text-center mb-16 lg:mb-20"
        >
          <Heading
            level={2}
            className="mb-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
          >
            Professional{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Experience
            </span>
          </Heading>
          <motion.p
            className="text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Showcasing my professional journey and technical expertise in software development
          </motion.p>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* No Experience State */}
        {!isLoading && experienceData.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-600 dark:text-slate-300 text-lg">
              No experience data available at the moment.
            </p>
          </div>
        )}

        {/* Featured Experience Display */}
        {!isLoading && experienceData.length > 0 && (
          <div className="space-y-16">
            {experienceData.slice(0, 1).map((experience) => (
              <FeaturedExperience
                key={experience.id}
                experience={experience}
                formatDate={formatDate}
              />
            ))}

            {/* Additional experiences (if any) with simpler layout */}
            {experienceData.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mt-16"
              >
                <h3 className="text-xl font-semibold text-center text-slate-700 dark:text-slate-300 mb-8">
                  Additional Experience
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {experienceData.slice(1).map((experience) => (
                    <Card key={experience.id} className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                        {experience.position}
                      </h4>
                      <p className="text-blue-600 dark:text-blue-400 mb-2">
                        {experience.company}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                        {formatDate(experience.start_date)} - {experience.end_date ? formatDate(experience.end_date) : "Present"}
                      </p>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        {experience.description}
                      </p>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
