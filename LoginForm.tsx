'use client';

import { useState, FormEvent } from 'react';

interface LoginFormProps {
  onLogin: (token: string) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      onLogin(data.token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md relative">
        {/* Glow effect */}
        <div className="absolute -inset-0.5 bg-bastion-accent opacity-20 blur-xl rounded-lg animate-pulse"></div>
        
        <div className="relative bg-bastion-surface border border-bastion-border rounded-lg p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-block">
              <h1 className="font-display text-4xl font-bold text-bastion-accent mb-2 tracking-wider">
                BASTION
              </h1>
              <div className="h-0.5 bg-gradient-to-r from-transparent via-bastion-accent to-transparent"></div>
            </div>
            <p className="text-bastion-muted text-sm mt-3 font-display">
              LICENSE MANAGEMENT SYSTEM
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="username" 
                className="block text-sm font-medium text-bastion-text mb-2 font-display"
              >
                USERNAME
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-bastion-bg border border-bastion-border rounded px-4 py-3 text-bastion-text focus:border-bastion-accent focus:outline-none transition-colors font-display"
                placeholder="Enter username"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-bastion-text mb-2 font-display"
              >
                PASSWORD
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-bastion-bg border border-bastion-border rounded px-4 py-3 text-bastion-text focus:border-bastion-accent focus:outline-none transition-colors font-display"
                placeholder="Enter password"
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="bg-bastion-error bg-opacity-10 border border-bastion-error rounded px-4 py-3 text-bastion-error text-sm font-display">
                ERROR: {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-bastion-accent text-bastion-bg font-display font-bold py-3 rounded hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <span className="relative z-10">
                {isLoading ? 'AUTHENTICATING...' : 'ACCESS SYSTEM'}
              </span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
            </button>
          </form>

          <div className="mt-6 text-center text-bastion-muted text-xs font-display">
            Default: admin / changeme123
          </div>
        </div>
      </div>
    </div>
  );
}
