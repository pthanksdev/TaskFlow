"use client";

import { useTasks } from "@/context/TaskContext";
import { Loader2, TrendingUp, CheckCircle2, Clock, ListTodo } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const { tasks, loading } = useTasks();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'DONE').length;
  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  
  const highPriority = tasks.filter(t => t.priority === 'HIGH' && t.status !== 'DONE').length;
  const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-neutral-400">Track your productivity and task metrics.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-neutral-900/50 border-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-400">Total Tasks</CardTitle>
            <ListTodo className="h-4 w-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalTasks}</div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900/50 border-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-400">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-400">{completionRate}%</div>
            <p className="text-xs text-neutral-500 mt-1">{completedTasks} of {totalTasks} finished</p>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900/50 border-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-400">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">{inProgress}</div>
            <p className="text-xs text-neutral-500 mt-1">Actively working on</p>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900/50 border-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-400">Urgent Tasks</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-400">{highPriority}</div>
            <p className="text-xs text-neutral-500 mt-1">High priority uncompleted</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
