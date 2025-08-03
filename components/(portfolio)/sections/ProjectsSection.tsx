"use client";
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Project } from "@/lib/types";

const projectsData: Project[] = [
  {
    id: "1",
    title: "E-Commerce Platform",
    description:
      "A full-stack e-commerce solution with React frontend, Node.js backend, and PostgreSQL database. Features include user authentication, product catalog, shopping cart, and payment integration.",
    imageUrl: "/images/project1.jpg",
    technologies: ["React", "Node.js", "PostgreSQL", "Stripe", "Tailwind CSS"],
    githubUrl: "https://github.com/username/ecommerce",
    liveUrl: "https://ecommerce-demo.com",
    featured: true,
  },
  {
    id: "2",
    title: "Task Management App",
    description:
      "A collaborative task management application built with Next.js and Prisma. Includes real-time updates, team collaboration features, and detailed analytics dashboard.",
    imageUrl: "/images/project2.jpg",
    technologies: ["Next.js", "Prisma", "Socket.io", "TypeScript", "Chakra UI"],
    githubUrl: "https://github.com/username/task-manager",
    liveUrl: "https://taskapp-demo.com",
    featured: true,
  },
  {
    id: "3",
    title: "Weather App",
    description:
      "A responsive weather application with location-based forecasts, interactive maps, and detailed weather analytics. Built with React and integrated with multiple weather APIs.",
    imageUrl: "/images/project3.jpg",
    technologies: ["React", "OpenWeather API", "Chart.js", "CSS Modules"],
    githubUrl: "https://github.com/username/weather-app",
    liveUrl: "https://weather-demo.com",
    featured: false,
  },
  {
    id: "4",
    title: "Blog Platform",
    description:
      "A modern blog platform with markdown support, SEO optimization, and content management system. Features include commenting, social sharing, and newsletter integration.",
    imageUrl: "/images/project4.jpg",
    technologies: ["Next.js", "MDX", "Contentful", "Vercel"],
    githubUrl: "https://github.com/username/blog-platform",
    liveUrl: "https://blog-demo.com",
    featured: false,
  },
  {
    id: "5",
    title: "Portfolio Website",
    description:
      "A personal portfolio website showcasing projects, skills, and experience. Built with modern technologies and optimized for performance and SEO.",
    imageUrl: "/images/project5.jpg",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    githubUrl: "https://github.com/username/portfolio",
    liveUrl: "https://portfolio-demo.com",
    featured: false,
  },
  {
    id: "6",
    title: "Chat Application",
    description:
      "Real-time chat application with multiple rooms, file sharing, and emoji support. Built with Socket.io for real-time communication and MongoDB for data persistence.",
    imageUrl: "/images/project6.jpg",
    technologies: ["React", "Socket.io", "MongoDB", "Express", "Material-UI"],
    githubUrl: "https://github.com/username/chat-app",
    liveUrl: "https://chat-demo.com",
    featured: false,
  },
];

export function ProjectsSection() {
  return (
    <section id="projects" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Heading level={2} className="mb-4">
            Featured <span className="text-blue-600">Projects</span>
          </Heading>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Here are some of my recent projects that showcase my skills and
            experience in web development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsData.map((project) => (
            <Card key={project.id} hover className="h-full flex flex-col">
              {/* Project Image */}
              <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg flex items-center justify-center">
                <div className="text-gray-400 text-center">
                  <svg
                    className="w-16 h-16 mx-auto mb-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                  <p className="text-sm font-medium">{project.title}</p>
                </div>
              </div>

              <CardContent className="flex-1 p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">
                    {project.title}
                  </h3>
                  {project.featured && (
                    <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </div>

                <p className="text-gray-700 leading-relaxed mb-4">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <div className="flex gap-3 w-full">
                  {project.githubUrl && (
                    <Button variant="outline" size="sm" className="flex-1">
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        Code
                      </a>
                    </Button>
                  )}
                  {project.liveUrl && (
                    <Button size="sm" className="flex-1">
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
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
                        Live Demo
                      </a>
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Projects
          </Button>
        </div>
      </div>
    </section>
  );
}
