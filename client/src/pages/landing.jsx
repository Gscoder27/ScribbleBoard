import AnimatedBackground from "@/components/animated-background";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import FeaturesSection from "@/components/features-section";
import DemoSection from "@/components/demo-section";
import UseCasesSection from "@/components/use-cases-section";
import ContactSection from "@/components/contact-section";
import PricingSection from "@/components/pricing-section";
import TestimonialsSection from "@/components/testimonials-section";
import Footer from "@/components/footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <AnimatedBackground />
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <DemoSection />
      <UseCasesSection />
      <PricingSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}