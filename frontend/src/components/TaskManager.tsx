"use client";

import React, { useState } from 'react';
import { Plus, ListTodo, Loader2, Calendar, Trash2 } from 'lucide-react';
import { useTasks, Task, Status, Priority } from '@/context/TaskContext';

export default function TaskManager() {
  const { tasks, loading, addTask, updateTaskStatus, deleteTask } = useTasks();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('MEDIUM');
  const [newTaskCategory, setNewTaskCategory] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    await addTask({
      title: newTaskTitle,
      description: newTaskDescription,
      dueDate: newTaskDueDate || undefined,
      priority: newTaskPriority,
      status: 'TODO',
      category: newTaskCategory || undefined,
    });
    
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskDueDate('');
    setNewTaskPriority('MEDIUM');
    setNewTaskCategory('');
    setIsExpanded(false);
  };



  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      case 'MEDIUM': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'LOW': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      default: return 'text-neutral-400 bg-neutral-400/10 border-neutral-400/20';
    }
  };

  const getColumnTasks = (status: Status) => {
    return tasks
      .filter((t) => t.status === status)
      .filter((t) => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (t.category && t.category.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .sort((a, b) => {
        const pOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
        return pOrder[a.priority] - pOrder[b.priority];
      });
  };

  const renderColumn = (title: string, status: Status) => {
    const columnTasks = getColumnTasks(status);
    return (
      <div className="flex-1 min-w-[320px] max-w-[400px] flex flex-col bg-neutral-900/40 rounded-3xl border border-neutral-800 overflow-hidden">
        <div className="p-4 border-b border-neutral-800 bg-neutral-900/60 backdrop-blur-md flex justify-between items-center">
          <h2 className="font-semibold text-lg text-neutral-200">{title}</h2>
          <span className="bg-neutral-800 text-neutral-400 px-2.5 py-0.5 rounded-full text-xs font-medium">
            {columnTasks.length}
          </span>
        </div>
        
        <div className="flex-1 p-3 overflow-y-auto space-y-3 custom-scrollbar">
          {columnTasks.length === 0 ? (
            <div className="h-24 flex items-center justify-center text-neutral-600 text-sm border-2 border-dashed border-neutral-800/50 rounded-2xl">
              Drop tasks here
            </div>
          ) : (
            columnTasks.map((task) => (
              <div
                key={task.id}
                className="group bg-neutral-950/80 border border-neutral-800 p-4 rounded-2xl hover:border-indigo-500/50 transition-all shadow-sm relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex flex-wrap gap-2 mb-1">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    {task.category && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border text-indigo-300 bg-indigo-500/10 border-indigo-500/20">
                        {task.category}
                      </span>
                    )}
                  </div>
                  <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <h3 className="font-medium text-neutral-100 leading-snug">{task.title}</h3>
                
                {task.description && (
                  <p className="mt-2 text-xs text-neutral-400 line-clamp-2">{task.description}</p>
                )}
                
                {task.dueDate && (
                  <div className="flex items-center gap-1 mt-3 text-[11px] text-neutral-500">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-800/60">
                  {status !== 'TODO' && (
                    <button
                      onClick={() => updateTaskStatus(task, status === 'DONE' ? 'IN_PROGRESS' : 'TODO')}
                      className="text-xs text-neutral-400 hover:text-indigo-400 transition-colors"
                    >
                      ← Move Back
                    </button>
                  )}
                  <div className="flex-1" />
                  {status !== 'DONE' && (
                    <button
                      onClick={() => updateTaskStatus(task, status === 'TODO' ? 'IN_PROGRESS' : 'DONE')}
                      className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                    >
                      Move Forward →
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-indigo-500/30 flex flex-col p-4 md:p-8">
      {/* Background gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] rounded-full bg-indigo-900/10 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-blue-900/10 blur-[100px]" />
      </div>

      <header className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 mt-4">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-3 rounded-2xl shadow-lg shadow-indigo-500/20 border border-indigo-400/20">
            <ListTodo className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
              TaskFlow Board
            </h1>
            <p className="text-neutral-400 text-sm mt-1">Manage your workflow dynamically.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 rounded-xl py-2 px-4 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-indigo-500 min-w-[200px]"
            />
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-6 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>
      </header>

      {isExpanded && (
        <div className="relative z-20 mb-8 bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 p-6 rounded-3xl shadow-2xl animate-in fade-in slide-in-from-top-4">
          <form onSubmit={handleAddTask} className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
               <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Task Title"
                  className="flex-1 bg-neutral-950/50 border border-neutral-800 rounded-xl py-3 px-4 text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value)}
                  placeholder="Category (e.g. Work)"
                  className="w-full md:w-48 bg-neutral-950/50 border border-neutral-800 rounded-xl py-3 px-4 text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
            </div>
            
            <textarea
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder="Detailed description..."
              rows={2}
              className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl py-3 px-4 text-sm text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500 resize-none"
            />
            
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="bg-neutral-950/50 border border-neutral-800 rounded-xl px-4 py-2 text-sm text-neutral-300 focus:outline-none [color-scheme:dark]"
                />
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
                  className="bg-neutral-950/50 border border-neutral-800 rounded-xl px-4 py-2 text-sm text-neutral-300 focus:outline-none"
                >
                  <option value="LOW">Low Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="HIGH">High Priority</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                 <button type="button" onClick={() => setIsExpanded(false)} className="text-neutral-400 hover:text-white px-4">Cancel</button>
                 <button type="submit" disabled={!newTaskTitle.trim()} className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-2 rounded-xl">Save Task</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Kanban Board */}
      <main className="relative z-10 flex-1 flex flex-col md:flex-row gap-6 overflow-x-auto pb-4 custom-scrollbar">
        {loading ? (
          <div className="w-full flex flex-col items-center justify-center text-neutral-500 gap-4 pt-20">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
            <p>Loading your board...</p>
          </div>
        ) : (
          <>
            {renderColumn('To Do', 'TODO')}
            {renderColumn('In Progress', 'IN_PROGRESS')}
            {renderColumn('Done', 'DONE')}
          </>
        )}
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #52525b; }
      `}} />
    </div>
  );
}
