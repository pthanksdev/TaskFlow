"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { ListTodo, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token);
      } else {
        const msg = await response.text();
        setError(msg || 'Invalid credentials');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-2 rounded-xl">
          <ListTodo className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">TaskFlow</h1>
      </div>

      <Card className="w-full max-w-md bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Enter your credentials to access your board.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-400">Username</label>
              <Input
                type="text"
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-neutral-950 border-neutral-800"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-400">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-neutral-950 border-neutral-800"
                required
              />
            </div>
            {error && <p className="text-sm text-rose-500">{error}</p>}
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Login'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-neutral-400">
            Don't have an account?{' '}
            <Link href="/register" className="text-indigo-400 hover:underline">
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
