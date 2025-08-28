import { HeroSection } from '@/components/(portfolio)/sections/HeroSection';
import { EducationSection } from '@/components/(portfolio)/sections/EducationSection';
import { ExperienceSection } from '@/components/(portfolio)/sections/ExperienceSection';
import { ProjectsSection } from '@/components/(portfolio)/sections/ProjectsSection';
import { SkillsSection } from '@/components/(portfolio)/sections/SkillsSection';
import { CertificationSection } from '@/components/(portfolio)/sections/CertificationSection';
// import { BlogSection } from '@/components/(portfolio)/sections/BlogSection';
import { ContactSection } from '@/components/(portfolio)/sections/ContactSection';

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <HeroSection />
      <EducationSection />
      <ExperienceSection />
      <ProjectsSection />
      <SkillsSection />
      <CertificationSection />
      {/* <BlogSection /> */}
      <ContactSection />
    </div>
  );
}