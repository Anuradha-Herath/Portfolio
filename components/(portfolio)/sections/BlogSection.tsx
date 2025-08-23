"use client";

import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { BlogPost } from "@/lib/types";

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Building Scalable React Applications with TypeScript",
    excerpt:
      "Learn how to structure large React applications using TypeScript for better maintainability and developer experience.",
    content: "Full content here...",
    image_url: "/images/blog1.jpg",
    published_at: "2024-01-15",
    tags: ["React", "TypeScript", "Frontend"],
    read_time: 8,
  },
  {
    id: "2",
    title: "Modern Backend Development with Node.js and Express",
    excerpt:
      "Explore best practices for building robust and performant backend APIs using Node.js and Express framework.",
    content: "Full content here...",
    image_url: "/images/blog2.jpg",
    published_at: "2024-01-08",
    tags: ["Node.js", "Express", "Backend"],
    read_time: 12,
  },
  {
    id: "3",
    title: "Database Design Principles for Web Applications",
    excerpt:
      "Understanding the fundamentals of database design and how to optimize your data models for performance.",
    content: "Full content here...",
    image_url: "/images/blog3.jpg",
    published_at: "2024-01-01",
    tags: ["Database", "PostgreSQL", "Design"],
    read_time: 10,
  },
];

export function BlogSection() {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section id="blog" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Heading level={2} className="mb-4">
            Latest Blog <span className="text-blue-600">Posts</span>
          </Heading>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            I write about web development, programming best practices, and
            technology trends. Here are some of my recent articles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card key={post.id} hover className="h-full flex flex-col">
              {/* Blog Image */}
              <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg flex items-center justify-center">
                <div className="text-gray-400 text-center">
                  <svg
                    className="w-16 h-16 mx-auto mb-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M5 19V5H19V19H5M17 17H7V15H17V17M17 13H7V11H17V13M17 9H7V7H17V9Z" />
                  </svg>
                  <p className="text-sm font-medium">Blog Article</p>
                </div>
              </div>

              <CardContent className="flex-1 p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500">
                    {formatDate(post.published_at)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {post.read_time} min read
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-gray-700 leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <Button variant="outline" size="sm" className="w-full">
                  Read More
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Posts
          </Button>
        </div>
      </div>
    </section>
  );
}
