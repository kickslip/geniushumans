// app/admin/kanban/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllProjects, updateProjectStatus } from "@/lib/projectActions";
import { ProjectStatus } from "@prisma/client";
import { Trash2 } from "lucide-react";

const columns = [
  ProjectStatus.NEW, 
  ProjectStatus.IN_PROGRESS, 
  ProjectStatus.COMPLETED
];

export default async function AdminKanbanPage() {
  const projects = await getAllProjects();

  return (
    <div className="p-4 bg-background min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {columns.map((column) => (
          <Card key={column}>
            <CardHeader>
              <CardTitle>{column}</CardTitle>
            </CardHeader>
            <CardContent>
              {projects
                .filter((project) => project.status === column)
                .map((project) => (
                  <div
                    key={project.id}
                    className="bg-card p-4 rounded-md shadow-sm mb-4"
                  >
                    <div>
                      <h3 className="font-bold">{project.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {project.description}
                      </p>
                      <p className="text-xs mt-2">
                        By: {project.userId}
                      </p>
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                      {column !== ProjectStatus.COMPLETED && (
                        <form 
                          action={async () => {
                            'use server';
                            await updateProjectStatus(
                              project.id, 
                              column === ProjectStatus.NEW 
                                ? ProjectStatus.IN_PROGRESS 
                                : ProjectStatus.COMPLETED
                            );
                          }}
                        >
                          <Button 
                            variant="outline" 
                            size="sm" 
                            type="submit"
                          >
                            Move
                          </Button>
                        </form>
                      )}
                      <Button 
                        variant="destructive" 
                        size="sm"
                        // Add delete action here if needed
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}