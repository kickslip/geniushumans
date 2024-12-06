"use client";

import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const projectSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
});

type ProjectData = z.infer<typeof projectSchema>;

const KanbanBoard = () => {
  const [projects, setProjects] = useState([]);

  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset 
  } = useForm<ProjectData>({
    resolver: zodResolver(projectSchema)
  });

  useEffect(() => {
    // Fetch existing projects
    const fetchProjects = async () => {
      // Implement fetch logic from database
    };
    fetchProjects();
  }, []);

  const onSubmit = async (data: ProjectData) => {
    try {
      const newProject = await createProject({
        ...data,
        status: 'New'
      });
      
      setProjects(prev => [...prev, newProject]);
      reset();
    } catch (error) {
      console.error("Failed to create project", error);
    }
  };

  const renderColumn = (status: string) => {
    const columnProjects = projects.filter(p => p.status === status);

    return (
      <div className="bg-gray-100 p-4 rounded-lg min-h-[400px]">
        <h3 className="font-bold mb-4">{status}</h3>
        {columnProjects.map(project => (
          <Card key={project.id} className="mb-2">
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {project.description}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Project Kanban Board</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2" /> New Project</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input 
                {...register('title')}
                placeholder="Project Title" 
                error={errors.title?.message}
              />
              <Textarea 
                {...register('description')}
                placeholder="Project Description" 
              />
              <Button type="submit">Create Project</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {renderColumn('New')}
        {renderColumn('In Progress')}
        {renderColumn('Completed')}
      </div>
    </div>
  );
};

export default KanbanBoard;