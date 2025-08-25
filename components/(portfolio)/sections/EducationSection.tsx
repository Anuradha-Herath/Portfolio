"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Education } from "@/lib/types";
import { Award, CheckCircle } from "lucide-react";

// Aurora Glassmorphism Card Component
const AuroraGlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 700 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Aurora Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${x}px ${y}px, rgba(120, 119, 198, 0.3), transparent 40%)`,
          x,
          y,
        }}
        animate={{ opacity: [0, 0.6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Glass Card */}
      <div className="relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl">
        {children}
      </div>
    </motion.div>
  );
};

export function EducationSection() {
  const [educationData, setEducationData] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const response = await fetch("/api/education");
        if (response.ok) {
          const data = await response.json();
          setEducationData(data);
        }
      } catch (error) {
        console.error("Error fetching education:", error);
        // Fallback to hardcoded data if API fails
        setEducationData([
          {
            id: "1",
            institution: "University of Moratuwa",
            degree: "Bachelor of Science",
            field: "Computer Science and Engineering",
            start_date: "2020-01",
            end_date: "2024-12",
            description:
              "Focused on software engineering, web development, and computer systems. Graduated with First Class Honors.",
            grade: "First Class Honors",
          },
          {
            id: "2",
            institution: "Royal College Colombo",
            degree: "Advanced Level",
            field: "Physical Science",
            start_date: "2017-01",
            end_date: "2020-12",
            description:
              "Completed Advanced Level in Physical Science stream with excellent results in Mathematics, Physics, and Chemistry.",
            grade: "3 A passes",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  if (loading) {
    return (
      <section id="education" className="py-24 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      id="education"
      className="py-16 lg:py-20 relative overflow-hidden"
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
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(120, 119, 198, 0.4) 1px, transparent 0)`,
          backgroundSize: '30px 30px'
        }} />
      </div>

      {/* Floating Aurora Effects */}
      <motion.div
        className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        animate={{
          x: [0, -120, 0],
          y: [0, 80, 0],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

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

        {educationData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--foreground-secondary)]">No education data available.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Enhanced Timeline line */}
            <motion.div
              className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-[var(--accent)] via-[#5856d6] to-[var(--accent)] opacity-80"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{ transformOrigin: "top" }}
              viewport={{ once: true }}
            />

            <div className="space-y-24">
              {educationData.map((education, index) => (
                <motion.div
                  key={education.id}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                  initial={{ opacity: 0, y: 80, rotateX: 15 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    duration: 1,
                    ease: "easeOut",
                    delay: index * 0.15,
                  }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  {/* Date on Timeline */}
                  <motion.div
                    className={`absolute left-8 md:left-1/2 transform md:-translate-x-1/2 ${
                      index % 2 === 0 ? "md:-translate-x-32" : "md:translate-x-32"
                    } z-20`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1 + 0.3,
                    }}
                    viewport={{ once: true }}
                  >
                    <div className="bg-gradient-to-r from-[var(--accent)] to-[#5856d6] text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg whitespace-nowrap">
                      {new Date(education.start_date).getFullYear()} - {new Date(education.end_date).getFullYear()}
                    </div>
                  </motion.div>

                  {/* Enhanced Timeline dot with pulse */}
                  <motion.div
                    className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full border-4 border-[var(--background)] z-10 shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${index % 2 === 0 ? 'var(--accent)' : '#5856d6'} 0%, ${index % 2 === 0 ? '#5856d6' : 'var(--accent)'} 100%)`
                    }}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    animate={{ 
                      boxShadow: [
                        `0 0 0 0 ${index % 2 === 0 ? 'rgba(99, 102, 241, 0.4)' : 'rgba(88, 86, 214, 0.4)'}`,
                        `0 0 0 10px ${index % 2 === 0 ? 'rgba(99, 102, 241, 0)' : 'rgba(88, 86, 214, 0)'}`,
                        `0 0 0 0 ${index % 2 === 0 ? 'rgba(99, 102, 241, 0)' : 'rgba(88, 86, 214, 0)'}`
                      ]
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 15,
                      delay: index * 0.1 + 0.3,
                      boxShadow: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.3 }}
                  />

                  {/* Connector Line */}
                  <motion.div
                    className={`absolute left-8 md:left-1/2 w-20 md:w-24 h-0.5 bg-gradient-to-r from-[var(--accent)] to-[#5856d6] z-5 ${
                      index % 2 === 0
                        ? "md:ml-3"
                        : "md:-ml-24"
                    }`}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.1 + 0.5,
                      ease: "easeOut"
                    }}
                    style={{ 
                      transformOrigin: index % 2 === 0 ? "left" : "right",
                      top: "50%"
                    }}
                    viewport={{ once: true }}
                  />

                  {/* Content */}
                  <motion.div
                    className={`w-full md:w-5/12 ml-20 md:ml-0 ${
                      index % 2 === 0
                        ? "md:mr-auto md:pr-16"
                        : "md:ml-auto md:pl-16"
                    }`}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.8,
                      ease: "easeOut",
                      delay: index * 0.15 + 0.6,
                    }}
                    viewport={{ once: true }}
                  >
                    <AuroraGlassCard className="h-full group">
                      <CardContent className="p-8">
                        {/* Enhanced Typography Hierarchy */}
                        <div className="mb-6">
                          <h3 className="text-3xl font-bold text-white mb-3 group-hover:text-[var(--accent)] transition-colors duration-300 leading-tight">
                            {education.degree}
                          </h3>
                          <p className="text-xl font-semibold mb-4 bg-gradient-to-r from-[var(--accent)] to-[#5856d6] bg-clip-text text-transparent">
                            {education.institution}
                          </p>
                          <p className="text-[var(--foreground-secondary)] font-medium text-lg mb-4">
                            {education.field}
                          </p>
                        </div>
                        
                        {/* Enhanced Grade Display with Icons */}
                        {education.grade && (
                          <div className="mb-6">
                            <div className="flex items-center gap-2 text-emerald-400">
                              <Award className="w-5 h-5" />
                              <span className="font-semibold text-lg">{education.grade}</span>
                            </div>
                          </div>
                        )}
                        
                        {/* Enhanced Description */}
                        <p className="text-[var(--foreground-tertiary)] leading-loose text-base">
                          {education.description}
                        </p>
                      </CardContent>
                    </AuroraGlassCard>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}
