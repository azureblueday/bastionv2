'use client';

import { useState, useEffect } from 'react';
import LoginForm from '@/components/LoginForm';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('bastion_token');
    if (savedToken) {
      setToken(savedToken);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (newToken: string) => {
    localStorage.setItem('bastion_token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('bastion_token');
    setToken(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bastion-bg">
        <div className="text-bastion-accent font-display text-xl animate-pulse">
          INITIALIZING...
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-bastion-bg">
      {!token ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <Dashboard token={token} onLogout={handleLogout} />
      )}
    </main>
  );
}
