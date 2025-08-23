"use client";

import React, { useState, useEffect } from "react";
import { Palette, Code2, Database, Wrench, Sparkles, Smartphone, ServerCog, PenTool } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Heading } from "@/components/ui/Heading";
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
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch("/api/skills");
        if (response.ok) {
          const data = await response.json();
          setSkillsData(data);
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const filteredSkills =
    activeFilter === "All"
      ? skillsData
      : skillsData.filter((skill) => skill.category === activeFilter);

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
      className="py-24 bg-[var(--background)] relative overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {/* Premium Background Effects */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 right-1/4 w-72 h-72 bg-[var(--accent)]/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#5856d6]/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-20"
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
          <p className="text-xl text-[var(--foreground-secondary)] max-w-3xl mx-auto leading-relaxed">
            Here are the technologies and tools I work with to bring ideas to
            life.
          </p>
        </motion.div>

        {/* Filter Controls */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
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
                className={`relative px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 border-2 ${
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
                whileHover={{ scale: 1.05, y: -2 }}
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

        {/* Skills Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4"
          layout
        >
          <AnimatePresence mode="wait">
            {filteredSkills.map((skill, index) => (
              <motion.div
                key={skill.id}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.02,
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
                className="group"
              >
                <motion.div
                  className="relative bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 h-full flex flex-col items-center justify-between text-center hover:border-[var(--accent)] transition-all duration-300 cursor-default overflow-hidden shadow-lg hover:shadow-2xl min-w-0"
                  whileHover={{
                    scale: 1.05,
                    y: -8,
                    boxShadow: "0 20px 40px -8px rgba(0, 122, 255, 0.3)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Skill Icon */}
                  <motion.div
                    className="w-20 h-20 mb-2 flex items-center justify-center relative transition-all duration-300"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  >
                    {/* Subtle highlight behind icon */}
                    <span
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-[var(--accent)]/60 blur-3xl z-0"
                      aria-hidden="true"
                    />
                    {/* White background for icon visibility */}
                    <span
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 shadow-md z-10"
                      aria-hidden="true"
                    />
                    {skill.icon &&
                      (skill.icon.startsWith("http") ? (
                        <img
                          src={skill.icon}
                          alt={`${skill.name} icon`}
                          className="w-12 h-12 object-contain relative z-20"
                        />
                      ) : (
                        <span className="text-4xl relative z-20">{skill.icon}</span>
                      ))}
                  </motion.div>

                  {/* Skill Name */}
                  <h3 className="font-semibold text-[var(--foreground)] text-base mb-1 group-hover:text-[var(--accent)] transition-colors duration-300">
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

                  {/* Hover Glow Effect */}
                  <motion.div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--accent)]/5 to-[#5856d6]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Skills Count Display */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-sm text-[var(--foreground-secondary)]">
            Showing {filteredSkills.length}{" "}
            {activeFilter === "All"
              ? "skills"
              : `${activeFilter.toLowerCase()} skills`}
          </span>
        </motion.div>

      </div>
    </motion.section>
  );
}
