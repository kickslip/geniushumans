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
      {/* Input Section */}
      <div className="flex flex-col sm:flex-row sm:space-x-4 mb-4 space-y-4 sm:space-y-0 items-end">
        <input
          type="text"
          placeholder="Project Title"
          value={newProject.title}
          onChange={(e) =>
            setNewProject((prev) => ({ ...prev, title: e.target.value }))
          }
          className="flex-grow p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Project Description"
          value={newProject.description}
          onChange={(e) =>
            setNewProject((prev) => ({ ...prev, description: e.target.value }))
          }
          className="flex-grow p-2 border rounded"
        />
        <Button onClick={addProject} className="flex items-center justify-center">
          <Plus className="mr-2" /> Add Project
        </Button>
      </div>

      {/* Kanban Columns */}
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
                      {column !== "Completed Projects" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            moveProject(
                              project.id,
                              columns[columns.indexOf(column) + 1]
                            )
                          }
                        >
                          Move
                        </Button>
                      )}
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => deleteProject(project.id)}
                      >
                        <Trash2 className="sm:w-4 md:w-5 lg:w-6 sm:h-4 md:h-5 lg:h-6" />
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