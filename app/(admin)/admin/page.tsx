"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { FolderIcon, CogIcon, BriefcaseIcon, GraduationCap, StarIcon, UserIcon, FileTextIcon } from 'lucide-react';

interface DashboardStats {
  projects: number;
  skills: number;
  experiences: number;
  education: number;
  certifications: number;
  testimonials: number;
  blogs: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats>({
    projects: 0,
    skills: 0,
    experiences: 0,
    education: 0,
    certifications: 0,
    testimonials: 0,
    blogs: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all data to get counts
        const endpoints = [
          '/api/projects',
          '/api/skills',
          '/api/experiences',
          '/api/education',
          '/api/certifications',
          '/api/testimonials',
          '/api/blogs',
        ];

        const responses = await Promise.all(
          endpoints.map(endpoint => fetch(endpoint))
        );

        const data = await Promise.all(
          responses.map(response => response.json())
        );

        setStats({
          projects: data[0]?.length || 0,
          skills: data[1]?.length || 0,
          experiences: data[2]?.length || 0,
          education: data[3]?.length || 0,
          certifications: data[4]?.length || 0,
          testimonials: data[5]?.length || 0,
          blogs: data[6]?.length || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'Projects', value: stats.projects, icon: FolderIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Skills', value: stats.skills, icon: CogIcon, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Experiences', value: stats.experiences, icon: BriefcaseIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Education', value: stats.education, icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Certifications', value: stats.certifications, icon: StarIcon, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { title: 'Testimonials', value: stats.testimonials, icon: UserIcon, color: 'text-pink-600', bg: 'bg-pink-50' },
    { title: 'Blog Posts', value: stats.blogs, icon: FileTextIcon, color: 'text-teal-600', bg: 'bg-teal-50' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Manage your portfolio content from here
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bg} dark:bg-slate-700`}>
                    <Icon className={`h-6 w-6 ${stat.color} dark:text-slate-300`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <a
                href="/admin/projects"
                className="block p-3 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                📁 Manage Projects
              </a>
              <a
                href="/admin/skills"
                className="block p-3 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                🛠️ Manage Skills
              </a>
              <a
                href="/admin/experiences"
                className="block p-3 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                💼 Manage Experience
              </a>
              <a
                href="/admin/blogs"
                className="block p-3 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                📝 Manage Blog Posts
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Recent Activity
            </h3>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              <p>No recent activity to display.</p>
              <p className="mt-2">Start by adding some content to your portfolio!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}