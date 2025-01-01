// app/projects/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createProject, getUserProjects } from "@/lib/projectActions";
import { ProjectStatus } from "@prisma/client";

export default async function UserProjectsPage() {
  const projects = await getUserProjects();

  // Wrap the createProject action to ensure it returns void
  const handleCreateProject = async (formData: FormData) => {
    'use server';
    await createProject(formData);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Projects</h1>
      
      <form action={handleCreateProject} className="mb-6 space-y-4">
        <input 
          type="text" 
          name="title" 
          placeholder="Project Title" 
          required 
          className="w-full p-2 border rounded"
        />
        <textarea 
          name="description" 
          placeholder="Project Description" 
          className="w-full p-2 border rounded"
        />
        <Button type="submit">Create Project</Button>
      </form>

      <div className="grid md:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                {project.description}
              </p>
              <div className="flex justify-between items-center">
                <span className={`
                  px-2 py-1 rounded text-xs font-medium
                  ${project.status === ProjectStatus.NEW && 'bg-blue-100 text-blue-800'}
                  ${project.status === ProjectStatus.IN_PROGRESS && 'bg-yellow-100 text-yellow-800'}
                  ${project.status === ProjectStatus.COMPLETED && 'bg-green-100 text-green-800'}
                `}>
                  {project.status}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}