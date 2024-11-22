
import { HeroSection } from "@/components/sections/hero-section";
import { ServicesSection } from "@/components/sections/services-section";
import { TechStackSection } from "@/components/sections/tech-stack-section";
import { TechStackSlider } from "@/components/sections/tech-stack-slider";
import { PricingSection } from "@/components/sections/pricing-section";
import { ContactSection } from "@/components/sections/contact-section";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ServicesSection />
      <TechStackSection />
      <PricingSection />
      <ContactSection />
      <TechStackSlider />

    </main>
  );
}