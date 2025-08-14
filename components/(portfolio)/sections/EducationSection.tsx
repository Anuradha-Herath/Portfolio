"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Education } from "@/lib/types";

const educationData: Education[] = [
  {
    id: "1",
    institution: "University of Moratuwa",
    degree: "Bachelor of Science",
    field: "Computer Science and Engineering",
    startDate: "2020-01",
    endDate: "2024-12",
    description:
      "Focused on software engineering, web development, and computer systems. Graduated with First Class Honors.",
    grade: "First Class Honors",
  },
  {
    id: "2",
    institution: "Royal College Colombo",
    degree: "Advanced Level",
    field: "Physical Science",
    startDate: "2017-01",
    endDate: "2019-12",
    description:
      "Completed Advanced Level in Physical Science stream with excellent results in Mathematics, Physics, and Chemistry.",
    grade: "3 A passes",
  },
];

export function EducationSection() {
  return (
    <motion.section
      id="education"
      className="py-24 bg-[var(--background-secondary)] relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.2,
          },
        },
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <Heading level={2} className="mb-6">
            My Educational <span className="bg-gradient-to-r from-[var(--accent)] to-[#5856d6] bg-clip-text text-transparent">Journey</span>
          </Heading>
          <p className="text-xl text-[var(--foreground-secondary)] max-w-3xl mx-auto leading-relaxed">
            My academic background has provided me with a strong foundation in
            computer science and engineering principles.
          </p>
        </motion.div>

        <div className="relative">
          {/* Premium Timeline line */}
          <motion.div
            className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-[var(--accent)] via-[#5856d6] to-[var(--accent)] opacity-60"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ transformOrigin: "top" }}
            viewport={{ once: true }}
          />

          <div className="space-y-16">
            {educationData.map((education, index) => (
              <motion.div
                key={education.id}
                className={`relative flex items-center ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                  delay: index * 0.1,
                }}
                viewport={{ once: true, amount: 0.2 }}
              >
                {/* Premium Timeline dot */}
                <motion.div
                  className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full border-4 border-[var(--background)] z-10 shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${index % 2 === 0 ? 'var(--accent)' : '#5856d6'} 0%, ${index % 2 === 0 ? '#5856d6' : 'var(--accent)'} 100%)`
                  }}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 15,
                    delay: index * 0.1 + 0.3,
                  }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.3 }}
                />

                {/* Content */}
                <motion.div
                  className={`w-full md:w-5/12 ml-20 md:ml-0 ${
                    index % 2 === 0
                      ? "md:mr-auto md:pr-12"
                      : "md:ml-auto md:pl-12"
                  }`}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.7,
                    ease: "easeOut",
                    delay: index * 0.15 + 0.4,
                  }}
                  viewport={{ once: true }}
                >
                  <Card hover glow className="h-full group">
                    <CardContent className="p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-[var(--foreground)] mb-2 group-hover:text-[var(--accent)] transition-colors duration-300">
                            {education.degree}
                          </h3>
                          <p className="text-xl font-semibold mb-3 bg-gradient-to-r from-[var(--accent)] to-[#5856d6] bg-clip-text text-transparent">
                            {education.institution}
                          </p>
                        </div>
                        <div className="text-right">
                          <motion.span 
                            className="inline-block bg-gradient-to-r from-[var(--accent)] to-[#5856d6] text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg"
                            whileHover={{ scale: 1.05 }}
                          >
                            {new Date(education.startDate).getFullYear()} -{" "}
                            {new Date(education.endDate).getFullYear()}
                          </motion.span>
                        </div>
                      </div>
                      
                      <p className="text-[var(--foreground-secondary)] font-medium mb-4 text-lg">
                        {education.field}
                      </p>
                      
                      {education.grade && (
                        <div className="mb-4">
                          <span className="inline-block bg-green-500/20 text-green-400 text-sm font-semibold px-4 py-2 rounded-full border border-green-500/30">
                            🏆 {education.grade}
                          </span>
                        </div>
                      )}
                      
                      <p className="text-[var(--foreground-tertiary)] leading-relaxed text-base">
                        {education.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
