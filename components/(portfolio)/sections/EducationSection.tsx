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
      className="py-20 bg-gray-50"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <Heading level={2} className="mb-4">
            My Educational <span className="text-blue-600">Journey</span>
          </Heading>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            My academic background has provided me with a strong foundation in
            computer science and engineering principles.
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <motion.div
            className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-blue-200"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{ transformOrigin: "top" }}
            viewport={{ once: true }}
          ></motion.div>

          <div className="space-y-12">
            {educationData.map((education, index) => (
              <motion.div
                key={education.id}
                className={`relative flex items-center ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  ease: "easeOut",
                  delay: index * 0.1,
                }}
                viewport={{ once: true, amount: 0.2 }}
              >
                {/* Timeline dot */}
                <motion.div
                  className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    delay: index * 0.1 + 0.2,
                  }}
                  viewport={{ once: true }}
                ></motion.div>

                {/* Content */}
                <motion.div
                  className={`w-full md:w-5/12 ml-16 md:ml-0 ${
                    index % 2 === 0
                      ? "md:mr-auto md:pr-8"
                      : "md:ml-auto md:pl-8"
                  }`}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.7,
                    ease: "easeOut",
                    delay: index * 0.15 + 0.3,
                  }}
                  viewport={{ once: true }}
                >
                  <Card hover className="h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {education.degree}
                          </h3>
                          <p className="text-lg text-blue-600 font-semibold mb-2">
                            {education.institution}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                            {new Date(education.startDate).getFullYear()} -{" "}
                            {new Date(education.endDate).getFullYear()}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 font-medium mb-3">
                        {education.field}
                      </p>
                      {education.grade && (
                        <div className="mb-3">
                          <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                            {education.grade}
                          </span>
                        </div>
                      )}
                      <p className="text-gray-700 leading-relaxed">
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
