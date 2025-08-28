"use client";

import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Card, CardContent } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Experience } from "@/lib/types";

// Separate component for individual experience items to handle useInView properly
const ExperienceItem: React.FC<{
  experience: Experience;
  index: number;
  formatDate: (date: string) => string;
}> = ({ experience, index, formatDate }) => {
  const isEven = index % 2 === 0;
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
    rootMargin: "-50px 0px",
  });

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
        mass: 1,
      },
    },
  };

  const dotVariants = {
    hidden: {
      scale: 0,
      opacity: 0,
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 15,
        delay: 0.1,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={`relative flex items-center ${
        isEven ? "lg:flex-row" : "lg:flex-row-reverse"
      }`}
      variants={cardVariants}
    >
      {/* Timeline Dot */}
      <motion.div
        variants={dotVariants}
        className="absolute left-8 lg:left-1/2 lg:transform lg:-translate-x-1/2 z-20"
      >
        <div className="relative">
          <motion.div
            className="w-4 h-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-lg border-4 border-white dark:border-slate-900"
            whileHover={{
              scale: 1.2,
              boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)",
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 15,
            }}
          />
          <div className="absolute inset-0 w-4 h-4 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full animate-ping opacity-20"></div>
        </div>
      </motion.div>

      {/* Experience Card */}
      <motion.div
        className={`w-full lg:w-5/12 ml-16 lg:ml-0 ${
          isEven ? "lg:pr-12" : "lg:pl-12"
        }`}
        whileHover={{
          scale: 1.02,
          transition: {
            type: "spring",
            stiffness: 200,
            damping: 15,
          },
        }}
      >
        <Card className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl">
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <CardContent className="relative p-6 lg:p-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div className="flex-1">
                <motion.h3
                  className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight leading-tight"
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  {experience.position}
                </motion.h3>

                <motion.p
                  className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  {experience.company}
                </motion.p>

                <motion.div
                  className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {experience.location}
                </motion.div>
              </div>

              <motion.div
                className="flex-shrink-0"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold rounded-full border border-blue-200/50 dark:border-blue-700/50">
                  {formatDate(experience.start_date)} -{" "}
                  {experience.end_date
                    ? formatDate(experience.end_date)
                    : "Present"}
                </span>
              </motion.div>
            </div>

            {/* Description */}
            <motion.p
              className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6 text-base"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {experience.description}
            </motion.p>

            {/* Technologies */}
            <motion.div
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {experience.technologies.map((tech, techIndex) => (
                <motion.span
                  key={tech}
                  className="inline-flex items-center px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-full border border-slate-200 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{
                    delay: 0.6 + techIndex * 0.05,
                    duration: 0.3,
                    type: "spring",
                    stiffness: 200,
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const timelineVariants = {
    hidden: { scaleY: 0, opacity: 0 },
    visible: {
      scaleY: 1,
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <section
      id="experience"
      className="py-16 lg:py-20 relative overflow-hidden"
    >
      {/* Unified Background - Matching Education Section */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle animated dot grid pattern - Same as Education */}
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

        {/* Soft gradient overlay for depth - Same as Education */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/30 to-indigo-50/20 dark:from-transparent dark:via-slate-900/50 dark:to-purple-950/10" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
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
            My journey through the world of software development, from
            internship to senior roles
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

        {/* Timeline Container */}
        {!isLoading && experienceData.length > 0 && (
        <div className="relative">
          {/* Desktop Timeline Line */}
          <motion.div
            variants={timelineVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 origin-top"
          >
            <div className="h-full bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 rounded-full shadow-lg"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/30 via-indigo-500/30 to-purple-500/30 blur-sm rounded-full"></div>
          </motion.div>

          {/* Mobile Timeline Line */}
          <motion.div
            variants={timelineVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="lg:hidden absolute left-8 h-full w-0.5 origin-top"
          >
            <div className="h-full bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 rounded-full"></div>
          </motion.div>

          {/* Experience Items */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="space-y-16 lg:space-y-20"
          >
            {experienceData.map((experience, index) => (
              <ExperienceItem
                key={experience.id}
                experience={experience}
                index={index}
                formatDate={formatDate}
              />
            ))}
          </motion.div>
        </div>
        )}
      </div>
    </section>
  );
}
