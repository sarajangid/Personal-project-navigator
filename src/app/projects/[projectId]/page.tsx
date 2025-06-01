'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type TaskStatus = 'To Do' | 'In Progress' | 'Completed';
type Task = {
  id: string;
  name: string;
  status: TaskStatus;
};

export default function ProjectPage() {
  const params = useParams();
  const projectId = params?.projectId as string;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [error, setError] = useState("");
  const [projectName, setProjectName] = useState("");

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        console.log("Fetching project:", projectId);
  
        const [taskRes, projectRes] = await Promise.all([
          fetch(`/api/projects/${projectId}/tasks`),
          fetch(`/api/projects/${projectId}`)
        ]);
  
        console.log("Task Response:", taskRes.status);
        console.log("Project Response:", projectRes.status);
  
        const tasksData = await taskRes.json();
        const projectData = await projectRes.json();
  
        if (taskRes.ok) {
          const typedTasks: Task[] = tasksData.map((task: any) => ({
            ...task,
            status: task.status as TaskStatus,
          }));
          setTasks(typedTasks);
        }
        if (projectRes.ok) setProjectName(projectData.name);
        if (!taskRes.ok || !projectRes.ok) setError("Failed to load project or tasks");
      } catch (err) {
        setError("Failed to load project or tasks");
      }
    };
  
    if (projectId) fetchProjectData();
  }, [projectId]);
  
  
  const addTask = async () => {
    if (!newTask.trim()) return;

    const res = await fetch(`/api/projects/${projectId}/tasks`, {
      method: "POST",
      body: JSON.stringify({ name: newTask , status: 'To Do'}),
    });

    if (!res.ok) {
      setError("Failed to add task");
      return;
    }

    const created = await res.json();
    setTasks([...tasks, created]);
    setNewTask("");
    setError("");
  };

  const updateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    const res = await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
  
    if (!res.ok) return;
  
    const updated = await res.json();
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status: updated.status } : task))
    );
  };
  

  const deleteTask = async (id: string) => {
    const res = await fetch(`/api/projects/${projectId}/tasks/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) return;

    setTasks(tasks.filter(task => task.id !== id));
  };



  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 capitalize">
      {projectName || 'Loading project...'} - Tasks
      </h1>

      <ul className="space-y-4 mb-6">
        {tasks.map((task) => (
          <li
          key={task.id}
          className="flex items-center justify-between bg-white shadow-lg hover:shadow-xl transition rounded-lg px-4 py-3"
        >
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={task.status === 'Completed'}
              onChange={() =>
                updateTaskStatus(
                  task.id,
                  task.status === 'Completed' ? 'In Progress' : 'Completed'
                )
              }
            />
            <span
              className={`${
                task.status === 'Completed' ? 'line-through text-gray-500' : 'text-black'
              }`}
            >
              {task.name}
            </span>
          </label>
        
          {/* Status Badge */}
          <span
            onClick={() => {
              if (task.status === 'To Do') {
                updateTaskStatus(task.id, 'In Progress');
              } else if (task.status === 'In Progress') {
                updateTaskStatus(task.id, 'To Do');
              }
            }}
            title="Click to toggle status"
            className={`ml-4 px-2 py-1 text-xs font-semibold rounded-full cursor-pointer ${
              task.status === 'To Do'
                ? 'bg-gray-300 text-gray-800'
                : task.status === 'In Progress'
                ? 'bg-yellow-300 text-yellow-800'
                : 'bg-green-300 text-green-900'
            }`}
          >
            {task.status}
          </span>
        
          <button
            onClick={() => deleteTask(task.id)}
            className="text-red-500 hover:text-red-800 font-bold text-xl ml-4"
            title="Delete task"
          >
            &times;
          </button>
        </li>
        
        ))}
      </ul>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="New task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-3 p-2"
        />
        <button
          onClick={addTask}
          style={{ backgroundColor: 'rgb(74, 111, 165)' }}
          className="bg-yellow-500 text-white px-4 py-2 rounded shadow-9xl hover:shadow-lg transition cursor-pointer"
        >
          + Add
        </button>
      </div>

      {error && <p className="text-red-600 mt-4">{error}</p>}
    </main>
  );
}
