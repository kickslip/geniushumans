"use client"

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
}

const columns = ["New Projects", "In Progress", "Completed Projects"];

const KanbanBoard = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      title: "Website Redesign",
      description: "Revamp company website with modern design",
      status: "New Projects",
    },
    {
      id: "2",
      title: "Mobile App Development",
      description: "Create cross-platform mobile application",
      status: "In Progress",
    },
    {
      id: "3",
      title: "SEO Optimization",
      description: "Improve search engine rankings",
      status: "Completed Projects",
    },
  ]);

  const [newProject, setNewProject] = useState({ title: "", description: "" });

  const addProject = () => {
    if (!newProject.title.trim()) return;

    const project: Project = {
      id: String(Date.now()),
      title: newProject.title,
      description: newProject.description,
      status: "New Projects",
    };

    setProjects((prev) => [...prev, project]);
    setNewProject({ title: "", description: "" });
  };

  const moveProject = (projectId: string, newStatus: string) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId ? { ...project, status: newStatus } : project
      )
    );
  };

  const deleteProject = (projectId: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== projectId));
  };

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
};

export default KanbanBoard;











// "use client"

// import React, { useState } from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Plus, Trash2 } from "lucide-react";

// interface Project {
//   id: string;
//   title: string;
//   description: string;
//   status: string;
// }

// const columns = ["New Projects", "In Progress", "Completed Projects"];

// const KanbanBoard = () => {
//   const [projects, setProjects] = useState<Project[]>([
//     {
//       id: "1",
//       title: "Website Redesign",
//       description: "Revamp company website with modern design",
//       status: "New Projects",
//     },
//     {
//       id: "2",
//       title: "Mobile App Development",
//       description: "Create cross-platform mobile application",
//       status: "In Progress",
//     },
//     {
//       id: "3",
//       title: "SEO Optimization",
//       description: "Improve search engine rankings",
//       status: "Completed Projects",
//     },
//   ]);

//   const [newProject, setNewProject] = useState({ title: "", description: "" });

//   const addProject = () => {
//     if (!newProject.title.trim()) return;

//     const project: Project = {
//       id: String(Date.now()),
//       title: newProject.title,
//       description: newProject.description,
//       status: "New Projects",
//     };

//     setProjects((prev) => [...prev, project]);
//     setNewProject({ title: "", description: "" });
//   };

//   const moveProject = (projectId: string, newStatus: string) => {
//     setProjects((prev) =>
//       prev.map((project) =>
//         project.id === projectId ? { ...project, status: newStatus } : project
//       )
//     );
//   };

//   const deleteProject = (projectId: string) => {
//     setProjects((prev) => prev.filter((project) => project.id !== projectId));
//   };

//   return (
//     <div className="p-4 bg-background min-h-screen">
//       {/* Input Section */}
//       <div className="flex flex-col sm:flex-row sm:space-x-4 mb-4 space-y-4 sm:space-y-0 items-end">
//         <input
//           type="text"
//           placeholder="Project Title"
//           value={newProject.title}
//           onChange={(e) =>
//             setNewProject((prev) => ({ ...prev, title: e.target.value }))
//           }
//           className="flex-grow p-2 border rounded"
//         />
//         <input
//           type="text"
//           placeholder="Project Description"
//           value={newProject.description}
//           onChange={(e) =>
//             setNewProject((prev) => ({ ...prev, description: e.target.value }))
//           }
//           className="flex-grow p-2 border rounded"
//         />
//         <Button onClick={addProject} className="flex items-center justify-center">
//           <Plus className="mr-2" /> Add Project
//         </Button>
//       </div>

//       {/* Kanban Columns */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//         {columns.map((column) => (
//           <Card key={column}>
//             <CardHeader>
//               <CardTitle>{column}</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {projects
//                 .filter((project) => project.status === column)
//                 .map((project) => (
//                   <div
//                     key={project.id}
//                     className="bg-card p-4 rounded-md shadow-sm mb-4"
//                   >
//                     <div>
//                       <h3 className="font-bold">{project.title}</h3>
//                       <p className="text-sm text-muted-foreground">
//                         {project.description}
//                       </p>
//                     </div>
//                     <div className="mt-4 flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2">
//                       {column !== "Completed Projects" && (
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() =>
//                             moveProject(
//                               project.id,
//                               columns[columns.indexOf(column) + 1]
//                             )
//                           }
//                         >
//                           Move
//                         </Button>
//                       )}
//                       <Button
//                         variant="destructive"
//                         size="sm"
//                         onClick={() => deleteProject(project.id)}
//                       >
//                         <Trash2 size={16} />
//                       </Button>
//                     </div>
//                   </div>
//                 ))}
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default KanbanBoard;