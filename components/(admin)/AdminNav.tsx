"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  BriefcaseIcon, 
  GraduationCap, 
  CogIcon,
  UserIcon,
  FileTextIcon,
  StarIcon,
  LogOutIcon,
  FolderIcon
} from 'lucide-react';

interface AdminNavProps {
  onLogout: () => void;
}

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Projects', href: '/admin/projects', icon: FolderIcon },
  { name: 'Skills', href: '/admin/skills', icon: CogIcon },
  { name: 'Experience', href: '/admin/experiences', icon: BriefcaseIcon },
  { name: 'Education', href: '/admin/education', icon: GraduationCap },
  { name: 'Certifications', href: '/admin/certifications', icon: StarIcon },
  { name: 'Testimonials', href: '/admin/testimonials', icon: UserIcon },
  { name: 'Blogs', href: '/admin/blogs', icon: FileTextIcon },
];

export function AdminNav({ onLogout }: AdminNavProps) {
  const pathname = usePathname();

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-800 shadow-lg border-r border-slate-200 dark:border-slate-700">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Admin Panel
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                    : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={onLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/50 rounded-lg transition-colors"
          >
            <LogOutIcon className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}