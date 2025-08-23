"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { Heading } from '@/components/ui/Heading';
import { Certification } from '@/lib/types';

export function CertificationSection() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [courseCertifications, setCourseCertifications] = useState<Certification[]>([]);
  const [competitionCertifications, setCompetitionCertifications] = useState<Certification[]>([]);
  const [activeTab, setActiveTab] = useState<'course' | 'competition'>('course');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCertifications();
  }, []);

  useEffect(() => {
    // Filter certifications by category
    setCourseCertifications(certifications.filter(cert => cert.category === 'course'));
    setCompetitionCertifications(certifications.filter(cert => cert.category === 'competition'));
  }, [certifications]);

  const fetchCertifications = async () => {
    try {
      const response = await fetch('/api/certifications');
      if (response.ok) {
        const data = await response.json();
        setCertifications(data);
      } else {
        console.error('Failed to fetch certifications');
      }
    } catch (error) {
      console.error('Error fetching certifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  // Animation variants
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

  const currentCertifications = activeTab === 'course' ? courseCertifications : competitionCertifications;

  return (
    <motion.section
      id="certifications"
      className="py-24 bg-[var(--background)] relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease }}
        >
          <Heading level={2} className="mb-6">
            Achievements & <span className="bg-gradient-to-r from-[var(--accent)] to-[#5856d6] bg-clip-text text-transparent">Certifications</span>
          </Heading>
          <p className="text-xl text-[var(--foreground-secondary)] max-w-3xl mx-auto leading-relaxed">
            I believe in continuous learning and staying updated with the latest
            technologies. Here are my professional certifications and competition achievements.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease }}
        >
          <div className="flex space-x-1 bg-[var(--background-tertiary)] p-1 rounded-xl border border-[var(--border)] glass shadow-lg">
            <button
              onClick={() => setActiveTab('course')}
              className={`relative px-7 py-3 rounded-lg text-sm font-semibold focus:outline-none overflow-hidden
                transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
                ${activeTab === 'course'
                  ? 'text-blue-300 shadow-md scale-105 z-10'
                  : 'text-[var(--foreground-tertiary)] hover:text-blue-200'}
              `}
              style={{
                background: activeTab === 'course'
                  ? 'linear-gradient(135deg, rgba(0,122,255,0.12) 0%, rgba(88,86,214,0.10) 100%)'
                  : 'transparent',
                boxShadow: activeTab === 'course' ? '0 4px 24px 0 rgba(0,122,255,0.10)' : 'none',
                border: activeTab === 'course' ? '1.5px solid var(--accent)' : '1.5px solid transparent',
                transition: 'all 0.5s cubic-bezier(0.4,0,0.2,1)',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
              onMouseLeave={e => e.currentTarget.style.transform = activeTab === 'course' ? 'scale(1.05)' : 'scale(1)'}
            >
              <span className="relative z-10">Course Certifications ({courseCertifications.length})</span>
              {activeTab === 'course' && (
                <motion.span
                  layoutId="cert-tab-bg"
                  className="absolute inset-0 rounded-lg pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,122,255,0.18) 0%, rgba(88,86,214,0.14) 100%)',
                    zIndex: 0,
                  }}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('competition')}
              className={`relative px-7 py-3 rounded-lg text-sm font-semibold focus:outline-none overflow-hidden
                transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
                ${activeTab === 'competition'
                  ? 'text-green-300 shadow-md scale-105 z-10'
                  : 'text-[var(--foreground-tertiary)] hover:text-green-200'}
              `}
              style={{
                background: activeTab === 'competition'
                  ? 'linear-gradient(135deg, rgba(0,255,122,0.10) 0%, rgba(0,122,255,0.10) 100%)'
                  : 'transparent',
                boxShadow: activeTab === 'competition' ? '0 4px 24px 0 rgba(0,255,122,0.10)' : 'none',
                border: activeTab === 'competition' ? '1.5px solid #22c55e' : '1.5px solid transparent',
                transition: 'all 0.5s cubic-bezier(0.4,0,0.2,1)',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
              onMouseLeave={e => e.currentTarget.style.transform = activeTab === 'competition' ? 'scale(1.05)' : 'scale(1)'}
            >
              <span className="relative z-10">Competition Certificates ({competitionCertifications.length})</span>
              {activeTab === 'competition' && (
                <motion.span
                  layoutId="cert-tab-bg"
                  className="absolute inset-0 rounded-lg pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(34,197,94,0.18) 0%, rgba(0,122,255,0.12) 100%)',
                    zIndex: 0,
                  }}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </button>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-[var(--foreground-secondary)]">Loading certifications...</p>
          </div>
        ) : (
          <>
            {/* Certifications Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={gridVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              key={activeTab}
            >
              {currentCertifications.map((cert) => (
                <motion.div key={cert.id} variants={cardVariants}>
                    <Card hover className="h-full group card-premium border border-[var(--border)] bg-[var(--surface)]">
                      <CardContent className="p-6">
                        {/* Certificate Image or Icon */}
                        {cert.image_url ? (
                          <div className="mb-4 group-hover:scale-105 transition-transform duration-300">
                            <img 
                              src={cert.image_url} 
                              alt={`${cert.title} certificate`}
                              className="w-full h-48 object-cover rounded-lg shadow-sm bg-[var(--background-tertiary)]"
                            />
                          </div>
                        ) : (
                          <div className={`h-20 bg-gradient-to-br ${
                            activeTab === 'course' 
                              ? 'from-[var(--background-tertiary)] to-[var(--surface)]' 
                              : 'from-[var(--background-secondary)] to-[var(--surface-hover)]'
                          } rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300`}>
                            <div className={activeTab === 'course' ? 'text-blue-400' : 'text-green-400'}>
                              {activeTab === 'course' ? (
                                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
                                </svg>
                              ) : (
                                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M5,16L3,5H1V3H4L6,14H18.5L19.5,7H8.5V5H21L19,17H5M6,20A1,1 0 0,0 7,21A1,1 0 0,0 8,20A1,1 0 0,0 7,19A1,1 0 0,0 6,20M16,20A1,1 0 0,0 17,21A1,1 0 0,0 18,20A1,1 0 0,0 17,19A1,1 0 0,0 16,20Z" />
                                </svg>
                              )}
                            </div>
                          </div>
                        )}

                      <h3 className="text-lg font-bold text-[var(--foreground)] mb-2 leading-tight line-clamp-2">
                        {cert.title}
                      </h3>

                      <p className={`font-semibold mb-2 ${
                        activeTab === 'course' ? 'text-blue-400' : 'text-green-400'
                      }`}>
                        {cert.issuer}
                      </p>

                      <p className="text-[var(--foreground-tertiary)] text-sm mb-3">
                        Earned: {formatDate(cert.date)}
                      </p>

                      {cert.description && (
                        <p className="text-[var(--foreground-secondary)] text-sm mb-3 line-clamp-2">
                          {cert.description}
                        </p>
                      )}

                      {cert.credential_id && (
                        <p className="text-[var(--foreground-tertiary)] text-xs mb-4 font-mono bg-[var(--background-tertiary)] p-2 rounded">
                          ID: {cert.credential_id}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 mt-auto">
                        {cert.url && (
                          <a
                            href={cert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              activeTab === 'course'
                                ? 'bg-[var(--background-tertiary)] text-blue-400 hover:bg-[var(--surface-hover)]'
                                : 'bg-[var(--background-tertiary)] text-green-400 hover:bg-[var(--surface-hover)]'
                            }`}
                          >
                            Verify Certificate
                          </a>
                        )}
                        {cert.certificate_file_url && (
                          <a
                            href={cert.certificate_file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--background-tertiary)] text-purple-400 hover:bg-[var(--surface-hover)] transition-colors"
                          >
                            View Certificate
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Empty State */}
            {currentCertifications.length === 0 && (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-[var(--foreground-secondary)] text-lg">
                  No {activeTab === 'course' ? 'course certifications' : 'competition certificates'} available.
                </p>
              </motion.div>
            )}
          </>
        )}

        {/* Statistics */}
        <motion.div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease }}
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {courseCertifications.length}
            </div>
            <div className="text-gray-600">Course Certifications</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {competitionCertifications.length}
            </div>
            <div className="text-gray-600">Competition Certificates</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {certifications.length}
            </div>
            <div className="text-gray-600">Total Achievements</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">100%</div>
            <div className="text-gray-600">Commitment to Learning</div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
