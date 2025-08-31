"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Education } from "@/lib/types";
import { Award, CheckCircle } from "lucide-react";
import { useMediaQuery } from 'react-responsive';

// Aurora Glassmorphism Card Component
const AuroraGlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  isMobile?: boolean;
}> = ({ children, className = "", isMobile = false }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 700 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || isMobile) return;
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
      whileHover={isMobile ? {} : { scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Aurora Glow Effect - Disabled on mobile */}
      {!isMobile && (
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
      )}
      
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

  // Detect mobile devices
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        setLoading(true);
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
            end_date: null, // Ongoing education example
            description:
              "Currently pursuing Advanced Level in Physical Science stream with excellent results in Mathematics, Physics, and Chemistry.",
            grade: "Ongoing",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  return (
    <motion.section
      id="education"
      className="py-12 md:py-16 lg:py-20 relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: isMobile ? 0.1 : 0.2, // Faster stagger on mobile
          },
        },
      }}
    >
      {/* Unified Background - Matching Hero Section */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle animated dot grid pattern - Same as Hero */}
        <motion.div
          className="absolute inset-0 opacity-[0.15] dark:opacity-[0.08]"
          style={{
            backgroundImage: `radial-gradient(circle, rgb(99 102 241) 1px, transparent 1px)`,
            backgroundSize: isMobile ? "60px 60px" : "40px 40px",
          }}
          animate={isMobile ? {} : {
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Soft gradient overlay for depth - Same as Hero */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/30 to-indigo-50/20 dark:from-transparent dark:via-slate-900/50 dark:to-purple-950/10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-12 md:mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: isMobile ? 0.5 : 0.7, ease: "easeOut" }}
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

        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner
              size="lg"
              text="Loading education..."
              showDots={true}
            />
          </div>
        ) : educationData.length === 0 ? (
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
              transition={{ duration: isMobile ? 1 : 1.5, ease: "easeOut" }}
              style={{ transformOrigin: "top" }}
              viewport={{ once: true }}
            />

            <div className="space-y-16 md:space-y-24">
              {educationData.map((education, index) => (
                <motion.div
                  key={education.id}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                  initial={{ opacity: 0, y: isMobile ? 40 : 80, rotateX: isMobile ? 0 : 15 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    duration: isMobile ? 0.6 : 1,
                    ease: "easeOut",
                    delay: index * (isMobile ? 0.1 : 0.15),
                  }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  {/* Date on Timeline */}
                  <motion.div
                    className={`absolute left-8 md:left-1/2 transform md:-translate-x-1/2 ${
                      index % 2 === 0 ? "md:-translate-x-32" : "md:translate-x-32"
                    } z-20 ${isMobile ? "top-[-2.5rem]" : "md:top-auto"}`}
                    initial={{ opacity: 0, scale: isMobile ? 0.9 : 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: isMobile ? 0.4 : 0.6,
                      delay: index * (isMobile ? 0.05 : 0.1) + 0.3,
                    }}
                    viewport={{ once: true }}
                  >
                    <div className="bg-gradient-to-r from-[var(--accent)] to-[#5856d6] text-white text-xs md:text-sm font-bold px-3 md:px-4 py-2 rounded-full shadow-lg whitespace-nowrap">
                      {new Date(education.start_date).getFullYear()} - {education.end_date ? new Date(education.end_date).getFullYear() : "Present"}
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
                    animate={isMobile ? {} : { 
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
                      delay: index * (isMobile ? 0.05 : 0.1) + 0.3,
                      boxShadow: isMobile ? {} : {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                    viewport={{ once: true }}
                    whileHover={isMobile ? {} : { scale: 1.3 }}
                  />

                  {/* Connector Line */}
                  <motion.div
                    className={`absolute left-8 md:left-1/2 w-16 md:w-24 h-0.5 bg-gradient-to-r from-[var(--accent)] to-[#5856d6] z-5 ${
                      index % 2 === 0
                        ? "md:ml-3"
                        : "md:-ml-24"
                    }`}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{
                      duration: isMobile ? 0.5 : 0.8,
                      delay: index * (isMobile ? 0.05 : 0.1) + 0.5,
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
                    className={`w-full md:w-5/12 ml-16 md:ml-0 ${
                      index % 2 === 0
                        ? "md:mr-auto md:pr-16"
                        : "md:ml-auto md:pl-16"
                    }`}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: isMobile ? 0.6 : 0.8,
                      ease: "easeOut",
                      delay: index * (isMobile ? 0.1 : 0.15) + 0.6,
                    }}
                    viewport={{ once: true }}
                  >
                    <AuroraGlassCard className="h-full group" isMobile={isMobile}>
                      <CardContent className="p-6 md:p-8">
                        {/* Enhanced Typography Hierarchy */}
                        <div className="mb-4 md:mb-6">
                          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-3 group-hover:text-[var(--accent)] transition-colors duration-300 leading-tight">
                            {education.degree}
                          </h3>
                          <p className="text-lg md:text-xl font-semibold mb-3 md:mb-4 bg-gradient-to-r from-[var(--accent)] to-[#5856d6] bg-clip-text text-transparent">
                            {education.institution}
                          </p>
                          <p className="text-[var(--foreground-secondary)] font-medium text-base md:text-lg mb-3 md:mb-4">
                            {education.field}
                          </p>
                        </div>
                        
                        {/* Enhanced Grade Display with Icons */}
                        {education.grade && (
                          <div className="mb-4 md:mb-6">
                            <div className="flex items-center gap-2 text-emerald-400">
                              <Award className="w-4 h-4 md:w-5 md:h-5" />
                              <span className="font-semibold text-base md:text-lg">{education.grade}</span>
                            </div>
                          </div>
                        )}
                        
                        {/* Enhanced Description */}
                        <p className="text-[var(--foreground-tertiary)] leading-relaxed md:leading-loose text-sm md:text-base">
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
