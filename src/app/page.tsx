import { NavBar } from "@/components/portfolio/nav-bar";
import { Hero } from "@/components/portfolio/hero";
import { About } from "@/components/portfolio/about";
import { Experience } from "@/components/portfolio/experience";
import { Skills } from "@/components/portfolio/skills";
import { Projects } from "@/components/portfolio/projects";
import { Certifications } from "@/components/portfolio/certifications";
import { Contact } from "@/components/portfolio/contact";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <NavBar />
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Projects />
      <Certifications />
      <Contact />
    </main>
  );
}
