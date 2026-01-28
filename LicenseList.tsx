'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface License {
  id: string;
  key: string;
  product: string;
  userId: string;
  hwid?: string;
  active: boolean;
  expiresAt: string;
  createdAt: string;
  lastUsed?: string;
  maxActivations: number;
  currentActivations: number;
}

interface LicenseListProps {
  token: string;
  refreshTrigger: number;
}

export default function LicenseList({ token, refreshTrigger }: LicenseListProps) {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);

  useEffect(() => {
    fetchLicenses();
  }, [refreshTrigger]);

  const fetchLicenses = async () => {
    try {
      const response = await fetch('/api/licenses', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch licenses');
      }

      const data = await response.json();
      setLicenses(data.licenses);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLicenseStatus = async (license: License) => {
    try {
      const response = await fetch(`/api/licenses/${license.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ active: !license.active }),
      });

      if (!response.ok) {
        throw new Error('Failed to update license');
      }

      fetchLicenses();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const deleteLicense = async (id: string) => {
    if (!confirm('Are you sure you want to delete this license?')) {
      return;
    }

    try {
      const response = await fetch(`/api/licenses/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete license');
      }

      fetchLicenses();
      setSelectedLicense(null);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-bastion-accent font-display text-lg animate-pulse">
          LOADING LICENSES...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-bastion-error bg-opacity-10 border border-bastion-error rounded-lg px-6 py-4 text-bastion-error font-display">
        ERROR: {error}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-bastion-text">
          ALL LICENSES
          <span className="ml-3 text-bastion-muted text-lg">({licenses.length})</span>
        </h2>
        <button
          onClick={fetchLicenses}
          className="px-4 py-2 text-sm font-display font-medium text-bastion-accent border border-bastion-accent hover:bg-bastion-accent hover:text-bastion-bg rounded transition-colors"
        >
          REFRESH
        </button>
      </div>

      <div className="grid gap-4">
        {licenses.length === 0 ? (
          <div className="bg-bastion-surface border border-bastion-border rounded-lg px-6 py-12 text-center">
            <p className="text-bastion-muted font-display">No licenses found</p>
          </div>
        ) : (
          licenses.map((license) => (
            <div
              key={license.id}
              className="bg-bastion-surface border border-bastion-border rounded-lg p-6 hover:border-bastion-accent transition-colors group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        license.active ? 'bg-bastion-accent' : 'bg-bastion-error'
                      } animate-pulse`}
                    ></span>
                    <span className="font-display text-lg font-bold text-bastion-text">
                      {license.product}
                    </span>
                    {new Date(license.expiresAt) < new Date() && (
                      <span className="px-2 py-1 text-xs font-display bg-bastion-error bg-opacity-20 text-bastion-error rounded">
                        EXPIRED
                      </span>
                    )}
                  </div>

                  <div className="font-display text-sm text-bastion-muted space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-bastion-text">KEY:</span>
                      <code className="text-bastion-accent">{license.key}</code>
                      <button
                        onClick={() => copyToClipboard(license.key)}
                        className="text-bastion-muted hover:text-bastion-accent transition-colors"
                        title="Copy key"
                      >
                        📋
                      </button>
                    </div>
                    <div>
                      <span className="text-bastion-text">USER ID:</span>{' '}
                      {license.userId}
                    </div>
                    <div>
                      <span className="text-bastion-text">ACTIVATIONS:</span>{' '}
                      {license.currentActivations}/{license.maxActivations}
                    </div>
                    {license.hwid && (
                      <div>
                        <span className="text-bastion-text">HWID:</span>{' '}
                        <code className="text-bastion-accent text-xs">{license.hwid}</code>
                      </div>
                    )}
                    <div>
                      <span className="text-bastion-text">EXPIRES:</span>{' '}
                      {formatDistanceToNow(new Date(license.expiresAt), {
                        addSuffix: true,
                      })}
                    </div>
                    {license.lastUsed && (
                      <div>
                        <span className="text-bastion-text">LAST USED:</span>{' '}
                        {formatDistanceToNow(new Date(license.lastUsed), {
                          addSuffix: true,
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex lg:flex-col gap-2">
                  <button
                    onClick={() => toggleLicenseStatus(license)}
                    className={`px-4 py-2 text-sm font-display font-medium rounded transition-colors ${
                      license.active
                        ? 'bg-bastion-warning bg-opacity-20 text-bastion-warning hover:bg-opacity-30'
                        : 'bg-bastion-accent bg-opacity-20 text-bastion-accent hover:bg-opacity-30'
                    }`}
                  >
                    {license.active ? 'DISABLE' : 'ENABLE'}
                  </button>
                  <button
                    onClick={() => deleteLicense(license.id)}
                    className="px-4 py-2 text-sm font-display font-medium bg-bastion-error bg-opacity-20 text-bastion-error hover:bg-opacity-30 rounded transition-colors"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
