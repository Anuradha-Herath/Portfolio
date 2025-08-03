
"use client";

import React from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Card, CardContent } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Experience } from "@/lib/types";

const experienceData: Experience[] = [
  {
    id: "1",
    company: "TechCorp Solutions",
    position: "Senior Full Stack Developer",
    startDate: "2023-06",
    endDate: null,
    description:
      "Leading development of enterprise web applications using React, Node.js, and PostgreSQL. Mentoring junior developers and implementing best practices for code quality and performance.",
    technologies: [
      "React",
      "Node.js",
      "TypeScript",
      "PostgreSQL",
      "AWS",
      "Docker",
    ],
    location: "Colombo, Sri Lanka",
  },
  {
    id: "2",
    company: "Digital Innovations Ltd",
    position: "Frontend Developer",
    startDate: "2022-01",
    endDate: "2023-05",
    description:
      "Developed responsive web applications and mobile apps using React and React Native. Collaborated with UI/UX designers to implement pixel-perfect designs and improved user experience.",
    technologies: [
      "React",
      "React Native",
      "JavaScript",
      "Redux",
      "Styled Components",
    ],
    location: "Remote",
  },
  {
    id: "3",
    company: "StartupXYZ",
    position: "Software Developer Intern",
    startDate: "2021-06",
    endDate: "2021-12",
    description:
      "Worked on various features for the company's main product, including API development, database optimization, and frontend enhancements. Gained experience in agile development methodologies.",
    technologies: ["Python", "Django", "MySQL", "Vue.js", "Git"],
    location: "Kandy, Sri Lanka",
  },
];


export function ExperienceSection() {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <section id="experience" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <Heading level={2} className="mb-4">
            My <span className="text-blue-600">Experiences</span>
          </Heading>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Here's my professional journey and the experiences that have shaped
            my career in software development.
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-blue-200 origin-top"
          ></motion.div>

          <div className="space-y-12">
            {experienceData.map((experience, index) => {
              // Animation variants for cards and dots
              const cardVariants = {
                hidden: { opacity: 0, y: 60 },
                visible: { opacity: 1, y: 0 },
              };
              const dotVariants = {
                hidden: { scale: 0, opacity: 0 },
                visible: { scale: 1, opacity: 1 },
              };

              // Use intersection observer for each card
              const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

              return (
                <div
                  key={experience.id}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                  ref={ref}
                >
                  {/* Timeline dot */}
                  <motion.div
                    variants={dotVariants}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    transition={{ duration: 0.5, delay: 0.1 * index, type: "spring", stiffness: 300 }}
                    className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10"
                  ></motion.div>

                  {/* Content */}
                  <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    transition={{ duration: 0.7, delay: 0.1 * index, ease: "easeOut" }}
                    className={`w-full md:w-5/12 ml-16 md:ml-0 ${
                      index % 2 === 0
                        ? "md:mr-auto md:pr-8"
                        : "md:ml-auto md:pl-8"
                    }`}
                  >
                    <Card hover className="h-full">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {experience.position}
                            </h3>
                            <p className="text-lg text-blue-600 font-semibold mb-2">
                              {experience.company}
                            </p>
                            <p className="text-sm text-gray-500 mb-2">
                              📍 {experience.location}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                              {formatDate(experience.startDate)} -{" "}
                              {experience.endDate
                                ? formatDate(experience.endDate)
                                : "Present"}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-700 leading-relaxed mb-4">
                          {experience.description}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {experience.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="inline-block bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
