"use client";

import { motion } from "framer-motion";
import { PricingCard } from "@/components/pricing-card";

const packages = [
  {
    title: "Startup Team",
    price: 7500,
    description: "Perfect for startups and small projects",
    features: [
      "1 x Junior Full Stack Developer (2+ years)",
      "1 x UI/UX Engineer or DevOps Engineer",
      "40 hours per week",
      "Code Reviews",
      "Weekly Progress Reports",
      "Direct Communication Channel"
    ],
    isPopular: false
  },
  {
    title: "Professional Team",
    price: 9500,
    description: "Ideal for growing businesses",
    features: [
      "1 x Junior Full Stack Developer (2+ years)",
      "1 x Senior Full Stack Lead (5+ years)",
      "1 x UI/UX Engineer or DevOps Engineer",
      "40 hours per week",
      "Priority Support",
      "Technical Architecture Design",
      "Comprehensive Documentation"
    ],
    isPopular: true
  },
  {
    title: "Enterprise Team",
    price: 12500,
    description: "For large-scale enterprise projects",
    features: [
      "1 x Junior Full Stack Developer (2+ years)",
      "1 x Senior Full Stack Lead (5+ years)",
      "1 x UI/UX Engineer",
      "1 x DevOps Engineer or Project Manager",
      "40 hours per week",
      "24/7 Priority Support",
      "Custom Integration Solutions",
      "Technical Architecture Design",
      "Comprehensive Documentation"
    ],
    isPopular: false
  }
];

export function PricingSection() {
  return (
    <section className="py-20 bg-secondary/20" id="pricing">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Pricing Plans</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect team composition for your project
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <PricingCard {...pkg} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}