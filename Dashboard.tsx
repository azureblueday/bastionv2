'use client';

import { useState, useEffect } from 'react';
import LicenseList from './LicenseList';
import CreateLicense from './CreateLicense';
import ApiDocs from './ApiDocs';

interface DashboardProps {
  token: string;
  onLogout: () => void;
}

type Tab = 'licenses' | 'create' | 'api';

export default function Dashboard({ token, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('licenses');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleLicenseCreated = () => {
    setRefreshTrigger(prev => prev + 1);
    setActiveTab('licenses');
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-bastion-surface border-b border-bastion-border sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="font-display text-2xl font-bold text-bastion-accent tracking-wider">
                BASTION
              </h1>
              <div className="hidden sm:block h-6 w-px bg-bastion-border"></div>
              <span className="hidden sm:block text-bastion-muted text-sm font-display">
                CONTROL PANEL
              </span>
            </div>
            
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm font-display font-medium text-bastion-text hover:text-bastion-accent border border-bastion-border hover:border-bastion-accent rounded transition-colors"
            >
              LOGOUT
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-bastion-surface border-b border-bastion-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('licenses')}
              className={`py-4 px-1 font-display text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'licenses'
                  ? 'border-bastion-accent text-bastion-accent'
                  : 'border-transparent text-bastion-muted hover:text-bastion-text'
              }`}
            >
              LICENSES
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`py-4 px-1 font-display text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'create'
                  ? 'border-bastion-accent text-bastion-accent'
                  : 'border-transparent text-bastion-muted hover:text-bastion-text'
              }`}
            >
              CREATE NEW
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`py-4 px-1 font-display text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'api'
                  ? 'border-bastion-accent text-bastion-accent'
                  : 'border-transparent text-bastion-muted hover:text-bastion-text'
              }`}
            >
              API DOCS
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'licenses' && (
          <LicenseList token={token} refreshTrigger={refreshTrigger} />
        )}
        {activeTab === 'create' && (
          <CreateLicense token={token} onSuccess={handleLicenseCreated} />
        )}
        {activeTab === 'api' && <ApiDocs />}
      </main>
    </div>
  );
}
