
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Skill } from "@/lib/types";

const skillCategories = [
  { name: "Frontend", color: "blue", icon: "🎨" },
  { name: "Backend", color: "green", icon: "⚙️" },
  { name: "Database", color: "purple", icon: "🗄️" },
  { name: "Tools", color: "orange", icon: "🛠️" },
];

const levelColors = {
  Beginner: "bg-red-500/20 text-red-400 border-red-500/30",
  Intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Advanced: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Expert: "bg-green-500/20 text-green-400 border-green-500/30",
};

export function SkillsSection() {
  const [skillsData, setSkillsData] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('/api/skills');
        if (response.ok) {
          const data = await response.json();
          setSkillsData(data);
        }
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkills();
  }, []);
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
            Technical <span className="bg-gradient-to-r from-[var(--accent)] to-[#5856d6] bg-clip-text text-transparent">Skills</span>
          </Heading>
          <p className="text-xl text-[var(--foreground-secondary)] max-w-3xl mx-auto leading-relaxed">
            Here are the technologies and tools I work with to bring ideas to life.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skillCategories.map((category, i) => {
            const categorySkills = skillsData.filter(
              (skill) => skill.category === category.name
            );

            return (
              <motion.div
                key={category.name}
                whileHover={{ 
                  scale: 1.02, 
                  y: -8,
                  boxShadow: "0 25px 50px -12px rgba(0, 122, 255, 0.25)" 
                }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.1 + i * 0.15, 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20 
                }}
              >
                <Card hover glow className="h-full group">
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <motion.div 
                        className="text-6xl mb-4"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        {category.icon}
                      </motion.div>
                      <h3 className="text-2xl font-bold text-[var(--foreground)] mb-3 group-hover:text-[var(--accent)] transition-colors duration-300">
                        {category.name}
                      </h3>
                      <motion.div 
                        className="w-16 h-1 bg-gradient-to-r from-[var(--accent)] to-[#5856d6] mx-auto rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: 64 }}
                        transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                      />
                    </div>

                    <div className="space-y-4">
                      {categorySkills.map((skill, j) => (
                        <motion.div
                          key={skill.id}
                          className="flex items-center justify-between p-4 bg-[var(--surface)] rounded-xl border border-[var(--border)] hover:border-[var(--border-light)] transition-all duration-300"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, amount: 0.2 }}
                          transition={{ duration: 0.4, delay: 0.2 + j * 0.07 }}
                          whileHover={{ scale: 1.02, x: 4 }}
                        >
                          <span className="font-semibold text-[var(--foreground)]">
                            {skill.name}
                          </span>
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${levelColors[skill.level as keyof typeof levelColors]}`}>
                            {skill.level}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Skills Grid */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-3xl font-bold text-center text-[var(--foreground)] mb-10">
            Other Technologies I Work With
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "React Native",
              "Vue.js",
              "GraphQL",
              "Redis",
              "Socket.io",
              "Jest",
              "Cypress",
              "Figma",
              "Adobe XD",
              "Postman",
              "Jenkins",
              "GitHub Actions",
              "Linux",
              "Nginx",
            ].map((tech, idx) => (
              <motion.span
                key={tech}
                className="inline-block bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground-secondary)] text-sm font-medium px-6 py-3 rounded-full hover:bg-[var(--surface-hover)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-300 cursor-default"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.3, delay: 0.1 + idx * 0.04 }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
