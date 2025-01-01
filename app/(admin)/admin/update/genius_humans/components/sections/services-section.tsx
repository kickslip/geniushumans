"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Code,
  Smartphone,
  Globe,
  Cloud,
  Shield,
  BarChart
} from "lucide-react";

const services = [
  {
    title: "Web Development",
    description: "Full-stack web applications using modern technologies like Next.js, React, and Node.js",
    icon: <Globe className="h-6 w-6" />
  },
  {
    title: "Mobile Development",
    description: "Cross-platform mobile apps using React Native and native technologies",
    icon: <Smartphone className="h-6 w-6" />
  },
  {
    title: "API Development",
    description: "RESTful and GraphQL APIs with robust authentication and authorization",
    icon: <Code className="h-6 w-6" />
  },
  {
    title: "Cloud Solutions",
    description: "Scalable cloud infrastructure using AWS, Google Cloud, or Azure",
    icon: <Cloud className="h-6 w-6" />
  },
  {
    title: "Security & Testing",
    description: "Comprehensive security audits and automated testing solutions",
    icon: <Shield className="h-6 w-6" />
  },
  {
    title: "Analytics & Monitoring",
    description: "Custom analytics solutions and real-time monitoring systems",
    icon: <BarChart className="h-6 w-6" />
  }
];

export function ServicesSection() {
  return (
    <section className="py-20" id="services">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Our Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive development solutions for your business needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    {service.icon}
                    <h3 className="font-semibold text-lg">{service.title}</h3>
                  </div>
                  <p className="text-muted-foreground">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}