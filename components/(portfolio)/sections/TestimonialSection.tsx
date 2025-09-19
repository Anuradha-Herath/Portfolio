'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { Heading } from '@/components/ui/Heading';
import { Testimonial } from '@/lib/types';

const testimonialsData: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    position: 'Product Manager',
    company: 'TechCorp Solutions',
    content: 'Doomin is an exceptional developer who consistently delivers high-quality work. His attention to detail and problem-solving skills are outstanding. He was instrumental in launching our flagship product ahead of schedule.',
    image_url: '/images/testimonial1.jpg',
    rating: 5
  },
  {
    id: '2',
    name: 'Michael Chen',
    position: 'CTO',
    company: 'Digital Innovations Ltd',
    content: 'Working with Doomin has been a pleasure. He brings both technical expertise and creative thinking to every project. His ability to translate complex requirements into elegant solutions is remarkable.',
    image_url: '/images/testimonial2.jpg',
    rating: 5
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    position: 'UI/UX Designer',
    company: 'Creative Studio',
    content: 'Doomin has an excellent eye for design implementation. He perfectly translated our designs into responsive, interactive web applications. His collaboration and communication skills are top-notch.',
    image_url: '/images/testimonial3.jpg',
    rating: 5
  },
  {
    id: '4',
    name: 'David Thompson',
    position: 'Startup Founder',
    company: 'StartupXYZ',
    content: 'As a startup, we needed someone who could work fast without compromising quality. Doomin exceeded our expectations and helped us build our MVP in record time. Highly recommended!',
    image_url: '/images/testimonial4.jpg',
    rating: 5
  },
  {
    id: '5',
    name: 'Lisa Wang',
    position: 'Project Manager',
    company: 'E-commerce Plus',
    content: 'Doomin\'s full-stack expertise was exactly what our e-commerce platform needed. He optimized our performance and implemented features that significantly improved our user experience.',
    image_url: '/images/testimonial5.jpg',
    rating: 5
  },
  {
    id: '6',
    name: 'Alex Kumar',
    position: 'Lead Developer',
    company: 'FinTech Solutions',
    content: 'I\'ve had the pleasure of working alongside Doomin on several projects. His code quality, architectural decisions, and mentoring abilities make him a valuable team member.',
    image_url: '/images/testimonial6.jpg',
    rating: 5
  }
];

export function TestimonialSection() {
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1 mb-4">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <section id="testimonials" className="py-16 lg:py-20 relative overflow-hidden">
      {/* Unified Background - Matching Other Sections */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle animated dot grid pattern - Same as other sections */}
        <motion.div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `radial-gradient(circle, rgb(99 102 241) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
          animate={{
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Soft gradient overlay for depth - Same as other sections */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-slate-900/50 to-purple-950/10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <Heading level={2} className="mb-4">
            What People Say <span className="text-blue-600">About Me</span>
          </Heading>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Don&apos;t just take my word for it. Here&apos;s what my colleagues, clients, and collaborators have to say about working with me.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial) => (
            <Card key={testimonial.id} hover className="h-full">
              <CardContent className="p-6">
                {/* Quote Icon */}
                <div className="mb-4">
                  <svg className="w-8 h-8 text-blue-600 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                  </svg>
                </div>

                {/* Rating */}
                {renderStars(testimonial.rating)}

                {/* Content */}
                <p className="text-gray-700 leading-relaxed mb-6 italic">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mr-4">
                    <div className="text-blue-600 font-bold text-lg">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {testimonial.position}
                    </p>
                    <p className="text-sm text-blue-600 font-medium">
                      {testimonial.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-blue-600 text-white rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Work Together?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Join these satisfied clients and let&apos;s create something amazing together.
            </p>
            <button
              onClick={() => {
                const element = document.querySelector('#contact');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Your Project
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}