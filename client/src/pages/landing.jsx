import AnimatedBackground from "@/components/animated-background";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import FeaturesSection from "@/components/features-section";
import DemoSection from "@/components/demo-section";
import UseCasesSection from "@/components/use-cases-section";
import ContactSection from "@/components/contact-section";

export default function Landing() {
  return (
    <div className="bg-gray-50 overflow-x-hidden">
      <AnimatedBackground />
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <DemoSection />
      <UseCasesSection />
      <ContactSection />
    </div>
  );
}