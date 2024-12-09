"use client";

import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createProject } from '@/lib/projectActions';

export function ProjectForm() {
  return (
    <form 
      action={async (formData: FormData) => {
        const result = await createProject(formData);
        
        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
      }}
      className="space-y-4 bg-secondary p-6 rounded-lg"
    >
      <h2 className="text-xl font-bold mb-4">Create New Project</h2>
      <div>
        <label htmlFor="title" className="block mb-2">Project Title</label>
        <Input 
          type="text" 
          name="title" 
          id="title"
          required 
          placeholder="Enter project title" 
        />
      </div>
      <div>
        <label htmlFor="description" className="block mb-2">Description (Optional)</label>
        <Textarea 
          name="description" 
          id="description"
          placeholder="Enter project description" 
        />
      </div>
      <Button 
        type="submit" 
        className="w-full"
      >
        Create Project
      </Button>
    </form>
  );
}