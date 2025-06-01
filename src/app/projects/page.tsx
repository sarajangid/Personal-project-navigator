"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]); //projects is an array of objects with id and name
  const [newProjectName, setNewProjectName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects"); // fetch projects from the API
        if (!response.ok) throw new Error("Failed to load projects");
        const data = await response.json(); //converts to json
        setProjects(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchProjects();
  }, []); //blank list means this runs once 

  //async because it makes an API call to add a new project
  const addProject = async () => {
    if (!newProjectName.trim()) {
      setError("Project name cannot be empty");
      return;
    }

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", //its type json
        },
        body: JSON.stringify({ name: newProjectName }), //stringify converts any input from the user to a string
      });

      if (!response.ok) {
        const err = await response.json();
        setError(err.error || "Failed to add project");
        return;
      }

      const newproject = await response.json();
      setProjects([...projects, newproject]);
      setNewProjectName("");
      setError("");
    } catch (err) {
      setError("Something went wrong");
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const err = await response.json();
        setError(err.error || "Failed to delete project");
        return;
      }

      setProjects(projects.filter((project) => project.id !== id));
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <main className="p-8 max-w-md mx-auto">
      <h2 className="text-xl text-gray-800 mb-3">Welcome back, Alex</h2>
      <p className="text-gray-700 mb-6">
        Here's your list of projects. Add, explore, or manage them as you like!
      </p>

      <ul className="space-y-4 mb-6">
        {projects.map((project) => (
          <li key={project.id} className="relative">
            <Link
              href={`/projects/${project.id}`}
              className="block bg-white shadow-9xl hover:shadow-lg transition rounded-lg px-4 py-3 border cursor-pointer"
            >
              {project.name}
            </Link>
            <button
              onClick={() => deleteProject(project.id)}
              className="absolute top-2 right-3 text-red-500 hover:text-red-800 font-bold text-xl"
              title="Delete project"
            >
              &times;
            </button>
          </li>
        ))}
      </ul>

      <div className="mb-4">
        <input
          type="text"
          placeholder="New project name"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          className="border rounded-lg px-4 py-3 w-full hover:border-yellow-500 focus:border-yellow-500  transition bg-transparent"
        />
      </div>

      {error && <p className="text-red-600 mb-5">{error}</p>}

      <button
        onClick={addProject}
        style={{ backgroundColor: 'rgb(74, 111, 165)' }}
        className="text-white px-4 py-2 rounded-lg shadow-9xl hover:shadow-lg transition cursor-pointer"
      >
        + Add Project
      </button>

      <p className="text-center text-sm text-gray-600 mt-10">
        Tip: Click a project to view tasks, or use the button above to add
        something new.
      </p>
    </main>
  );
}
