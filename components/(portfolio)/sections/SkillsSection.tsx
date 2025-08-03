"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Skill } from "@/lib/types";

const skillsData: Skill[] = [
  // Frontend
  { id: "1", name: "React", category: "Frontend", level: "Expert" },
  { id: "2", name: "Next.js", category: "Frontend", level: "Advanced" },
  { id: "3", name: "TypeScript", category: "Frontend", level: "Advanced" },
  { id: "4", name: "JavaScript", category: "Frontend", level: "Expert" },
  { id: "5", name: "Tailwind CSS", category: "Frontend", level: "Advanced" },
  { id: "6", name: "HTML/CSS", category: "Frontend", level: "Expert" },

  // Backend
  { id: "7", name: "Node.js", category: "Backend", level: "Advanced" },
  { id: "8", name: "Express.js", category: "Backend", level: "Advanced" },
  { id: "9", name: "Python", category: "Backend", level: "Intermediate" },
  { id: "10", name: "Django", category: "Backend", level: "Intermediate" },

  // Database
  { id: "11", name: "PostgreSQL", category: "Database", level: "Advanced" },
  { id: "12", name: "MongoDB", category: "Database", level: "Intermediate" },
  { id: "13", name: "MySQL", category: "Database", level: "Advanced" },
  { id: "14", name: "Prisma", category: "Database", level: "Intermediate" },

  // Tools & Others
  { id: "15", name: "Git", category: "Tools", level: "Advanced" },
  { id: "16", name: "Docker", category: "Tools", level: "Intermediate" },
  { id: "17", name: "AWS", category: "Tools", level: "Intermediate" },
  { id: "18", name: "Vercel", category: "Tools", level: "Advanced" },
];

const skillCategories = [
  { name: "Frontend", color: "blue", icon: "🎨" },
  { name: "Backend", color: "green", icon: "⚙️" },
  { name: "Database", color: "purple", icon: "🗄️" },
  { name: "Tools", color: "orange", icon: "🛠️" },
];

const levelColors = {
  Beginner: "bg-red-100 text-red-800",
  Intermediate: "bg-yellow-100 text-yellow-800",
  Advanced: "bg-blue-100 text-blue-800",
  Expert: "bg-green-100 text-green-800",
};

export function SkillsSection() {
  return (
    <section id="skills" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Heading level={2} className="mb-4">
            Technical <span className="text-blue-600">Skills</span>
          </Heading>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Here are the technologies and tools I work with to bring ideas to
            life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skillCategories.map((category) => {
            const categorySkills = skillsData.filter(
              (skill) => skill.category === category.name
            );

            return (
              <Card key={category.name} hover className="h-full">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-3">{category.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {category.name}
                    </h3>
                    <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full"></div>
                  </div>

                  <div className="space-y-3">
                    {categorySkills.map((skill) => (
                      <div
                        key={skill.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="font-medium text-gray-900">
                          {skill.name}
                        </span>
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                            levelColors[skill.level]
                          }`}
                        >
                          {skill.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Skills Grid */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
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
            ].map((tech) => (
              <span
                key={tech}
                className="inline-block bg-gray-100 text-gray-800 text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
