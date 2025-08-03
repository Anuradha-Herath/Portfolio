import { HeroSection } from '@/components/(portfolio)/sections/HeroSection';
import { EducationSection } from '@/components/(portfolio)/sections/EducationSection';
import { ExperienceSection } from '@/components/(portfolio)/sections/ExperienceSection';
import { ProjectsSection } from '@/components/(portfolio)/sections/ProjectsSection';
import { SkillsSection } from '@/components/(portfolio)/sections/SkillsSection';
import { CertificationSection } from '@/components/(portfolio)/sections/CertificationSection';
import { TestimonialSection } from '@/components/(portfolio)/sections/TestimonialSection';
import { BlogSection } from '@/components/(portfolio)/sections/BlogSection';
import { ContactSection } from '@/components/(portfolio)/sections/ContactSection';

export default function PortfolioPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <EducationSection />
      <ExperienceSection />
      <ProjectsSection />
      <SkillsSection />
      <CertificationSection />
      <TestimonialSection />
      <BlogSection />
      <ContactSection />
    </div>
  );
}