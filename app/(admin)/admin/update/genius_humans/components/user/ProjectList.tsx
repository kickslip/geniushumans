"use client";

import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectStatus } from '@prisma/client';
import { getUserProjects } from '@/lib/projectActions';

const STATUS_COLORS = {
  NEW: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800"
};

export function ProjectList() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const userProjects = await getUserProjects();
        setProjects(userProjects);
      } catch (error) {
        console.error("Failed to fetch projects", error);
        setError(error instanceof Error ? error.message : "Failed to load projects");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, []);

  if (isLoading) {
    return <div className="text-muted-foreground">Loading projects...</div>;
  }

  if (error) {
    return <div className="text-destructive">{error}</div>;
  }

  if (projects.length === 0) {
    return <div className="text-muted-foreground">No projects found. Create your first project!</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Projects</h2>
      {projects.map((project) => (
        <Card key={project.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg">{project.title}</CardTitle>
            <Badge 
              className={`${STATUS_COLORS[project.status as ProjectStatus]} px-2 py-1 rounded-full`}
            >
              {project.status.replace('_', ' ')}
            </Badge>
          </CardHeader>
          <CardContent>
            {project.description && (
              <p className="text-muted-foreground">{project.description}</p>
            )}
            <div className="text-sm text-muted-foreground mt-2">
              Created on: {new Date(project.createdAt).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}