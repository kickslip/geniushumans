"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Database, 
  Code2, 
  Layout, 
  Shield, 
  Server, 
  Workflow 
} from "lucide-react";

const technologies = [
  {
    category: "Frontend",
    icon: <Layout className="h-6 w-6" />,
    items: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "Framer Motion"]
  },
  {
    category: "Backend",
    icon: <Server className="h-6 w-6" />,
    items: ["Node.js", "Prisma ORM", "PostgreSQL", "MongoDB", "REST APIs"]
  },
  {
    category: "Development",
    icon: <Code2 className="h-6 w-6" />,
    items: ["TypeScript", "Zod", "Git", "CI/CD", "Testing"]
  },
  {
    category: "Database",
    icon: <Database className="h-6 w-6" />,
    items: ["PostgreSQL", "NeonDB", "MongoDB", "Redis", "Caching"]
  },
  {
    category: "DevOps",
    icon: <Workflow className="h-6 w-6" />,
    items: ["Vercel", "Docker", "GitHub Actions", "Monitoring", "Analytics"]
  },
  {
    category: "Security",
    icon: <Shield className="h-6 w-6" />,
    items: ["NextAuth.js", "Lucia", "OAuth", "JWT", "HTTPS"]
  }
];

export function TechStackSection() {
  return (
    <section className="py-20" id="tech-stack">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Our Tech Stack</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We use cutting-edge technologies to build scalable, performant applications
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    {tech.icon}
                    <h3 className="font-semibold text-lg">{tech.category}</h3>
                  </div>
                  <ul className="space-y-2">
                    {tech.items.map((item) => (
                      <li key={item} className="text-muted-foreground">
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}