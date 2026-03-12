import type { Metadata } from "next"
import { Hero } from "@/components/landing/hero"
import { ProblemSection } from "@/components/landing/problem-section"
import { HowItWorks } from "@/components/landing/how-it-works"
import { FeaturesGrid } from "@/components/landing/features-grid"
import { PricingCards } from "@/components/landing/pricing-cards"
import { FaqSection } from "@/components/landing/faq-section"
import { Footer } from "@/components/landing/footer"

export const metadata: Metadata = {
  title: "OrçaFlow — Orçamentos que fecham, não ficam no vácuo",
  description:
    "Organize orçamentos, automatize follow-ups e cobre pelo WhatsApp. O sistema para empresas de comunicação visual.",
}

export default function Home() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <HowItWorks />
      <FeaturesGrid />
      <PricingCards />
      <FaqSection />
      <Footer />
    </>
  )
}
