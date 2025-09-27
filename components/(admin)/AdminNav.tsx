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
  FolderIcon,
  MailIcon,
  ShieldIcon
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
  { name: 'Messages', href: '/admin/messages', icon: MailIcon },
  { name: 'Blocked IPs', href: '/admin/blocked-ips', icon: ShieldIcon },
];

export function AdminNav({ onLogout }: AdminNavProps) {
  const pathname = usePathname();

  return (
    <div className="fixed inset-y-0 left-0 w-64 shadow-lg border-r" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
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
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors`}
                style={{
                  backgroundColor: isActive ? 'var(--accent)' : 'transparent',
                  color: isActive ? 'white' : 'var(--foreground-secondary)',
                  border: isActive ? 'none' : '1px solid transparent'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={onLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors"
            style={{
              color: '#ef4444', // red color for logout
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <LogOutIcon className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}