"use client"
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit } from 'lucide-react';

// Sample initial data structure for projects
const initialProjects = [
  {
    id: '1',
    title: 'Website Redesign',
    description: 'Revamp company website with modern design',
    status: 'New Projects'
  },
  {
    id: '2',
    title: 'Mobile App Development',
    description: 'Create cross-platform mobile application',
    status: 'In Progress'
  },
  {
    id: '3',
    title: 'SEO Optimization',
    description: 'Improve search engine rankings',
    status: 'Completed Projects'
  }
];

const KanbanBoard = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [newProject, setNewProject] = useState({ title: '', description: '' });

  const columns = ['New Projects', 'In Progress', 'Completed Projects'];

  const addProject = () => {
    if (!newProject.title) return;

    const project = {
      id: String(Date.now()),
      title: newProject.title,
      description: newProject.description,
      status: 'New Projects'
    };

    setProjects([...projects, project]);
    setNewProject({ title: '', description: '' });
  };

  const moveProject = (projectId, newStatus) => {
    setProjects(projects.map(project => 
      project.id === projectId 
        ? { ...project, status: newStatus } 
        : project
    ));
  };

  const deleteProject = (projectId) => {
    setProjects(projects.filter(project => project.id !== projectId));
  };

  return (
    <div className="p-4 bg-secondary/30 min-h-screen">
      <div className="flex space-x-4 mb-4">
        <input 
          type="text"
          placeholder="Project Title"
          value={newProject.title}
          onChange={(e) => setNewProject({...newProject, title: e.target.value})}
          className="flex-grow p-2 border rounded"
        />
        <input 
          type="text"
          placeholder="Project Description"
          value={newProject.description}
          onChange={(e) => setNewProject({...newProject, description: e.target.value})}
          className="flex-grow p-2 border rounded"
        />
        <Button onClick={addProject} className="flex items-center">
          <Plus className="mr-2" /> Add Project
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {columns.map(column => (
          <Card key={column}>
            <CardHeader>
              <CardTitle>{column}</CardTitle>
            </CardHeader>
            <CardContent>
              {projects
                .filter(project => project.status === column)
                .map(project => (
                  <div 
                    key={project.id} 
                    className="bg-white p-3 rounded shadow mb-2 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-bold text-black">{project.title}</h3>
                      <p className="text-sm text-gray-600">{project.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      {column !== 'Completed Projects' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => moveProject(project.id, columns[columns.indexOf(column) + 1])}
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
                ))
              }
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;