"use client";

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: Status;
  category?: string;
  dueDate?: string;
  priority: Priority;
  createdAt?: string;
  updatedAt?: string;
}

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  addTask: (task: Partial<Task>) => Promise<void>;
  updateTaskStatus: (task: Task, status: Status) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  refreshTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const { token, isAuthenticated } = useAuth();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  const fetchTasks = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [isAuthenticated, token]);

  const addTask = async (taskData: Partial<Task>) => {
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(taskData),
      });
      if (response.ok) {
        const newTask = await response.json();
        setTasks((prev) => [...prev, newTask]);
      }
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const updateTaskStatus = async (task: Task, newStatus: Status) => {
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...task, status: newStatus }),
      });
      if (response.ok) {
        const updatedTask = await response.json();
        setTasks((prev) => prev.map((t) => (t.id === task.id ? updatedTask : t)));
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const deleteTask = async (id: number) => {
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setTasks((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };


  return (
    <TaskContext.Provider value={{ tasks, loading, addTask, updateTaskStatus, deleteTask, refreshTasks: fetchTasks }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
