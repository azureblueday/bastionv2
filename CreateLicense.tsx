'use client';

import { useState, FormEvent } from 'react';

interface CreateLicenseProps {
  token: string;
  onSuccess: () => void;
}

export default function CreateLicense({ token, onSuccess }: CreateLicenseProps) {
  const [product, setProduct] = useState('bastion-pro');
  const [userId, setUserId] = useState('');
  const [expiresInDays, setExpiresInDays] = useState('30');
  const [maxActivations, setMaxActivations] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/licenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product,
          userId,
          expiresInDays: parseInt(expiresInDays),
          maxActivations: parseInt(maxActivations),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create license');
      }

      setSuccess(`License created: ${data.license.key}`);
      setUserId('');
      
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-display font-bold text-bastion-text mb-6">
        CREATE NEW LICENSE
      </h2>

      <div className="bg-bastion-surface border border-bastion-border rounded-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-bastion-text mb-2 font-display">
              PRODUCT
            </label>
            <select
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="w-full bg-bastion-bg border border-bastion-border rounded px-4 py-3 text-bastion-text focus:border-bastion-accent focus:outline-none transition-colors font-display"
              disabled={isLoading}
            >
              <option value="bastion-pro">Bastion Pro</option>
              <option value="bastion-enterprise">Bastion Enterprise</option>
              <option value="bastion-starter">Bastion Starter</option>
              <option value="custom-product">Custom Product</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-bastion-text mb-2 font-display">
              USER ID
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full bg-bastion-bg border border-bastion-border rounded px-4 py-3 text-bastion-text focus:border-bastion-accent focus:outline-none transition-colors font-display"
              placeholder="Enter user ID or email"
              required
              disabled={isLoading}
            />
            <p className="mt-2 text-xs text-bastion-muted font-display">
              Identifier for the user this license will be assigned to
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-bastion-text mb-2 font-display">
                EXPIRES IN (DAYS)
              </label>
              <input
                type="number"
                value={expiresInDays}
                onChange={(e) => setExpiresInDays(e.target.value)}
                className="w-full bg-bastion-bg border border-bastion-border rounded px-4 py-3 text-bastion-text focus:border-bastion-accent focus:outline-none transition-colors font-display"
                min="1"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-bastion-text mb-2 font-display">
                MAX ACTIVATIONS
              </label>
              <input
                type="number"
                value={maxActivations}
                onChange={(e) => setMaxActivations(e.target.value)}
                className="w-full bg-bastion-bg border border-bastion-border rounded px-4 py-3 text-bastion-text focus:border-bastion-accent focus:outline-none transition-colors font-display"
                min="1"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {error && (
            <div className="bg-bastion-error bg-opacity-10 border border-bastion-error rounded px-4 py-3 text-bastion-error text-sm font-display">
              ERROR: {error}
            </div>
          )}

          {success && (
            <div className="bg-bastion-accent bg-opacity-10 border border-bastion-accent rounded px-4 py-3 text-bastion-accent text-sm font-display">
              SUCCESS: {success}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-bastion-accent text-bastion-bg font-display font-bold py-3 rounded hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'GENERATING LICENSE...' : 'CREATE LICENSE'}
          </button>
        </form>
      </div>

      <div className="mt-8 bg-bastion-surface border border-bastion-border rounded-lg p-6">
        <h3 className="font-display font-bold text-bastion-text mb-3">
          QUICK PRESETS
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => {
              setExpiresInDays('7');
              setMaxActivations('1');
            }}
            className="px-4 py-2 text-sm font-display bg-bastion-bg border border-bastion-border hover:border-bastion-accent rounded transition-colors text-bastion-text"
          >
            7 DAYS TRIAL
          </button>
          <button
            onClick={() => {
              setExpiresInDays('30');
              setMaxActivations('1');
            }}
            className="px-4 py-2 text-sm font-display bg-bastion-bg border border-bastion-border hover:border-bastion-accent rounded transition-colors text-bastion-text"
          >
            30 DAYS SINGLE
          </button>
          <button
            onClick={() => {
              setExpiresInDays('365');
              setMaxActivations('5');
            }}
            className="px-4 py-2 text-sm font-display bg-bastion-bg border border-bastion-border hover:border-bastion-accent rounded transition-colors text-bastion-text"
          >
            1 YEAR MULTI
          </button>
        </div>
      </div>
    </div>
  );
}
