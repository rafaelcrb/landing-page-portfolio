import { HeroSection } from '@/components/sections/HeroSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { ContactSection } from '@/components/sections/ContactSection';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ProjectsSection />
      <ContactSection />
    </main>
  );
}

