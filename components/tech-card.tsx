"use client";

import { motion } from "framer-motion";

interface TechCardProps {
  tech: {
    icon: React.ReactNode;
    name: string;
  };
  index: number;
}

export function TechCard({ tech, index }: TechCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex flex-col items-center p-6 bg-card rounded-lg hover:shadow-lg transition-shadow"
    >
      {tech.icon}
      <span className="mt-4 text-sm font-medium">{tech.name}</span>
    </motion.div>
  );
}