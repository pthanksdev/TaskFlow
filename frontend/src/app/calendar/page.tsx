"use client";

import { useTasks } from "@/context/TaskContext";
import { Loader2, Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CalendarPage() {
  const { tasks, loading } = useTasks();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  // Group tasks by dueDate
  const tasksByDate = tasks.reduce((acc, task) => {
    if (!task.dueDate) return acc;
    const date = new Date(task.dueDate).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(task);
    return acc;
  }, {} as Record<string, typeof tasks>);

  const sortedDates = Object.keys(tasksByDate).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Upcoming Deadlines</h1>
        <p className="text-neutral-400">Your tasks organized by their due dates.</p>
      </div>

      {sortedDates.length === 0 ? (
        <div className="text-center py-20 text-neutral-500">
          <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No tasks with due dates found.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedDates.map((date) => (
            <Card key={date} className="bg-neutral-900/50 border-neutral-800 flex flex-col h-full">
              <CardHeader className="pb-3 border-b border-neutral-800">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CalendarIcon className="w-5 h-5 text-indigo-400" />
                  {date}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3 flex-1">
                {tasksByDate[date].map(task => (
                  <div key={task.id} className={`p-3 rounded-xl border ${task.status === 'DONE' ? 'border-neutral-800 bg-neutral-900/30 opacity-60' : 'border-neutral-700 bg-neutral-800/50'}`}>
                    <div className="font-medium text-sm mb-1">{task.title}</div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-[10px] h-5 px-1.5">{task.status}</Badge>
                      {task.priority === 'HIGH' && (
                        <Badge variant="destructive" className="text-[10px] h-5 px-1.5">HIGH</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
