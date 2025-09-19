"use client";

import React, { useState, useEffect } from "react";
import { Palette, Code2, Database, Wrench, Sparkles, Smartphone, ServerCog, PenTool } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Heading } from "@/components/ui/Heading";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Skill } from "@/lib/types";

const skillCategories = [
  { name: "All", color: "gray", icon: <Sparkles size={18} className="inline align-text-bottom" /> },
  { name: "Frontend", color: "blue", icon: <Palette size={18} className="inline align-text-bottom" /> },
  { name: "Backend", color: "green", icon: <Code2 size={18} className="inline align-text-bottom" /> },
  { name: "Database", color: "purple", icon: <Database size={18} className="inline align-text-bottom" /> },
  { name: "Tools", color: "orange", icon: <Wrench size={18} className="inline align-text-bottom" /> },
  { name: "Mobile", color: "teal", icon: <Smartphone size={18} className="inline align-text-bottom" /> },
  { name: "DevOps", color: "indigo", icon: <ServerCog size={18} className="inline align-text-bottom" /> },
  { name: "Design", color: "pink", icon: <PenTool size={18} className="inline align-text-bottom" /> },
];

const levelColors = {
  Beginner: "bg-red-500/20 text-red-400 border-red-500/30",
  Intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Advanced: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Expert: "bg-green-500/20 text-green-400 border-green-500/30",
};

const levelDots = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
  Expert: 4,
};

export function SkillsSection() {
  const [skillsData, setSkillsData] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [visibleSkills, setVisibleSkills] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Set initial visible skills based on device type
      if (!mobile) {
        setVisibleSkills(999); // Show all skills on desktop
      } else {
        setVisibleSkills(8); // Show fewer skills on mobile
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/skills");
        if (response.ok) {
          const data = await response.json();
          setSkillsData(data);
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  // Reset visible skills when filter changes
  useEffect(() => {
    if (!isMobile) {
      setVisibleSkills(999); // Show all skills on desktop
    } else {
      setVisibleSkills(8); // Show fewer skills on mobile
    }
  }, [activeFilter, isMobile]);

  const loadMoreSkills = () => {
    if (isLoadingMore || !isMobile) return; // Only allow load more on mobile
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleSkills(prev => prev + 8); // Load 8 more skills on mobile
      setIsLoadingMore(false);
    }, 300); // Small delay for smooth UX
  };

  const levelOrder = ["Expert", "Advanced", "Intermediate", "Beginner"];
  const allFilteredSkills =
    (activeFilter === "All"
      ? skillsData
      : skillsData.filter((skill) => skill.category === activeFilter)
    ).slice().sort((a, b) => levelOrder.indexOf(a.level) - levelOrder.indexOf(b.level));

  const filteredSkills = allFilteredSkills.slice(0, visibleSkills);
  const hasMoreSkills = isMobile && allFilteredSkills.length > visibleSkills; // Only show load more button on mobile

  const renderProficiencyDots = (level: string) => {
    const totalDots = 4;
    const filledDots = levelDots[level as keyof typeof levelDots];

    return (
      <div className="flex gap-1 mt-2">
        {Array.from({ length: totalDots }).map((_, index) => (
          <motion.div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index < filledDots
                ? level === "Beginner"
                  ? "bg-red-400"
                  : level === "Intermediate"
                  ? "bg-yellow-400"
                  : level === "Advanced"
                  ? "bg-blue-400"
                  : "bg-green-400"
                : "bg-gray-600/30"
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 400 }}
          />
        ))}
      </div>
    );
  };

  return (
    <motion.section
      id="skills"
      className="relative py-12 sm:py-16 lg:py-20 overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
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
            opacity: [0.08, 0.15, 0.08],
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12 sm:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Heading level={2} className="mb-6">
            Technical{" "}
            <span className="bg-gradient-to-r from-[var(--accent)] to-[#5856d6] bg-clip-text text-transparent">
              Skills
            </span>
          </Heading>
          <p className="text-lg sm:text-xl text-[var(--foreground-secondary)] max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
            Here are the technologies and tools I work with to bring ideas to
            life.
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-8">
            {/* Skeleton Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {[
                { width: "60px" },
                { width: "80px" },
                { width: "70px" },
                { width: "90px" },
                { width: "75px" },
                { width: "85px" }
              ].map((item, index) => (
                <div
                  key={index}
                  className="px-6 py-3 rounded-full bg-gray-700 animate-pulse"
                  style={{ width: item.width, height: '40px' }}
                />
              ))}
            </div>

            {/* Skeleton Skills Grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {Array.from({ length: 12 }).map((_, index) => (
                <motion.div
                  key={index}
                  className="bg-slate-800/10 border border-slate-700/20 rounded-2xl p-4 h-32 flex flex-col items-center justify-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="w-16 h-16 bg-gray-700 rounded-full mb-3 animate-pulse" />
                  <div className="w-20 h-4 bg-gray-700 rounded mb-2 animate-pulse" />
                  <div className="flex gap-1">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-gray-700 rounded-full animate-pulse" />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Filter Controls */}
        {!loading && (
          <motion.div
            className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 px-2 sm:px-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {skillCategories
              .filter((category) =>
                category.name === "All"
                  ? true
                  : skillsData.some((skill) => skill.category === category.name)
              )
              .map((category, index) => (
                <motion.button
                  key={category.name}
                  onClick={() => setActiveFilter(category.name)}
                  className={`relative px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 border-2 ${
                    activeFilter === category.name
                      ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-lg"
                      : "bg-[var(--surface)] text-[var(--foreground-secondary)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  }`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 300,
                  }}
                  whileHover={isMobile ? {} : { scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}

                  {activeFilter === category.name && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-[var(--accent)]/20"
                      layoutId="activeFilter"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
          </motion.div>
        )}

        {/* Skills Grid */}
        {!loading && (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4"
            layout
          >
            <AnimatePresence mode="sync">
              {filteredSkills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  transition={{
                    duration: isMobile ? 0.2 : 0.3,
                    delay: isMobile ? index * 0.01 : index * 0.02,
                    type: "spring",
                    stiffness: isMobile ? 400 : 300,
                    damping: 25,
                  }}
                  className="group"
                >
                  <motion.div
                    className="relative bg-slate-800/10 border border-slate-700/20 rounded-2xl p-3 sm:p-4 h-full flex flex-col items-center justify-between text-center hover:border-[var(--accent)]/40 transition-all duration-300 cursor-default overflow-hidden shadow-lg hover:shadow-2xl min-w-0"
                    whileHover={isMobile ? {} : {
                      scale: 1.05,
                      y: -8,
                      boxShadow: "0 20px 40px -8px rgba(0, 122, 255, 0.3)",
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Skill Icon */}
                    <motion.div
                      className="w-16 sm:w-20 h-16 sm:h-20 mb-2 flex items-center justify-center relative transition-all duration-300"
                      whileHover={isMobile ? {} : { rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                      {/* Subtle highlight behind icon */}
                      <span
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 sm:w-32 h-24 sm:h-32 rounded-full bg-[var(--accent)]/60 blur-3xl z-0"
                        aria-hidden="true"
                      />
                      {/* White background for icon visibility */}
                      <span
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-gray-800 shadow-md z-10"
                        aria-hidden="true"
                      />
                      {skill.icon &&
                        (skill.icon.startsWith("http") ? (
                          <img
                            src={skill.icon}
                            alt={`${skill.name} icon`}
                            className="w-10 sm:w-12 h-10 sm:h-12 object-contain relative z-20"
                          />
                        ) : (
                          <span className="text-3xl sm:text-4xl relative z-20">{skill.icon}</span>
                        ))}
                    </motion.div>

                    {/* Skill Name */}
                    <h3 className="font-semibold text-[var(--foreground)] text-sm sm:text-base mb-1 group-hover:text-[var(--accent)] transition-colors duration-300">
                      {skill.name}
                    </h3>

                    {/* Proficiency Dots */}
                    {renderProficiencyDots(skill.level)}

                    {/* Level Text (Hidden, appears on hover) */}
                    <motion.div
                      className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--surface)] to-transparent pt-6 pb-2"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-xs font-medium text-[var(--foreground-secondary)]">
                        {skill.level}
                      </span>
                    </motion.div>

                    {/* Hover Glow Effect Removed */}
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Load More Button */}
        {!loading && hasMoreSkills && (
          <motion.div
            className="flex justify-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.button
              onClick={loadMoreSkills}
              disabled={isLoadingMore}
              className="relative px-6 py-3 bg-[var(--accent)] text-white rounded-full font-semibold text-sm hover:bg-[var(--accent)]/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden min-w-[200px]"
              whileHover={!isLoadingMore ? { scale: 1.05 } : {}}
              whileTap={!isLoadingMore ? { scale: 0.95 } : {}}
              animate={isLoadingMore ? { scale: [1, 1.02, 1] } : {}}
              transition={isLoadingMore ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } : {}}
            >
              <AnimatePresence mode="wait">
                {isLoadingMore ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <LoadingSpinner size="sm" />
                    Loading...
                  </motion.div>
                ) : (
                  <motion.div
                    key="loadmore"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    Load More Skills ({allFilteredSkills.length - visibleSkills} remaining)
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        )}

        {/* Skills Count Display */}
        {!loading && (
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-sm text-[var(--foreground-secondary)]">
              Showing {filteredSkills.length} of {allFilteredSkills.length}{" "}
              {activeFilter === "All"
                ? "skills"
                : `${activeFilter.toLowerCase()} skills`}
            </span>
          </motion.div>
        )}

      </div>
    </motion.section>
  );
}
