
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Certification } from "@/lib/types";

const certificationsData: Certification[] = [
  {
    id: "1",
    title: "AWS Certified Developer - Associate",
    issuer: "Amazon Web Services",
    date: "2023-10",
    credentialId: "AWS-DEV-2023-001234",
    url: "https://aws.amazon.com/certification/",
    imageUrl: "/images/aws-cert.png",
  },
  {
    id: "2",
    title: "Professional Scrum Master I (PSM I)",
    issuer: "Scrum.org",
    date: "2023-08",
    credentialId: "PSM-I-2023-567890",
    url: "https://scrum.org/certifications",
    imageUrl: "/images/scrum-cert.png",
  },
  {
    id: "3",
    title: "Google Analytics Certified",
    issuer: "Google",
    date: "2023-06",
    credentialId: "GA-2023-789012",
    url: "https://analytics.google.com/analytics/academy/",
    imageUrl: "/images/google-cert.png",
  },
  {
    id: "4",
    title: "MongoDB Developer Certification",
    issuer: "MongoDB University",
    date: "2023-04",
    credentialId: "MDB-DEV-2023-345678",
    url: "https://university.mongodb.com/",
    imageUrl: "/images/mongodb-cert.png",
  },
  {
    id: "5",
    title: "React Developer Certificate",
    issuer: "Meta (Facebook)",
    date: "2023-02",
    credentialId: "META-REACT-2023-901234",
    url: "https://developers.facebook.com/certifications/",
    imageUrl: "/images/meta-cert.png",
  },
  {
    id: "6",
    title: "Docker Certified Associate",
    issuer: "Docker Inc.",
    date: "2022-12",
    credentialId: "DCA-2022-456789",
    url: "https://docker.com/certification/",
    imageUrl: "/images/docker-cert.png",
  },
];


export function CertificationSection() {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  // Animation variants
  // Use cubic-bezier for 'ease' to match Framer Motion's Easing type
  const ease: [number, number, number, number] = [0.4, 0, 0.2, 1];
  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
  };
  const gridVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
  };

  return (
    <motion.section
      id="certifications"
      className="py-20 bg-white"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease }}
        >
          <Heading level={2} className="mb-4">
            Achievements & <span className="text-blue-600">Certifications</span>
          </Heading>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            I believe in continuous learning and staying updated with the latest
            technologies. Here are some of my professional certifications and
            achievements.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {certificationsData.map((cert) => (
            <motion.div key={cert.id} variants={cardVariants}>
              <Card hover className="h-full">
                <CardContent className="p-6">
                  {/* Certificate Icon/Image */}
                  <div className="h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-blue-600">
                      <svg
                        className="w-10 h-10"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12,15L7.5,10.5L9,9L12,12L15,9L16.5,10.5L12,15M5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3M5,5V19H19V5H5Z" />
                      </svg>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                    {cert.title}
                  </h3>

                  <p className="text-blue-600 font-semibold mb-2">
                    {cert.issuer}
                  </p>

                  <p className="text-gray-500 text-sm mb-3">
                    Earned: {formatDate(cert.date)}
                  </p>

                  {cert.credentialId && (
                    <p className="text-gray-600 text-xs mb-4 font-mono bg-gray-50 p-2 rounded">
                      ID: {cert.credentialId}
                    </p>
                  )}

                  {cert.url && (
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                    >
                      Verify Certificate
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Statistics */}
        <motion.div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease }}
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">6+</div>
            <div className="text-gray-600">Certifications</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">3+</div>
            <div className="text-gray-600">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
            <div className="text-gray-600">Projects Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
            <div className="text-gray-600">Client Satisfaction</div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
