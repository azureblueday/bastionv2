'use client';

import { useState } from 'react';

export default function ApiDocs() {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const copyCode = (code: string, endpoint: string) => {
    navigator.clipboard.writeText(code);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.vercel.app';

  const endpoints = [
    {
      name: 'Verify License',
      method: 'POST',
      path: '/api/verify',
      description: 'Verify a license key and optionally bind to hardware ID',
      example: `curl -X POST ${baseUrl}/api/verify \\
  -H "Content-Type: application/json" \\
  -d '{
    "key": "XXXXX-XXXXX-XXXXX-XXXXX",
    "hwid": "optional-hardware-id",
    "product": "bastion-pro"
  }'`,
      response: `{
  "valid": true,
  "license": {
    "product": "bastion-pro",
    "expiresAt": "2025-02-27T...",
    "activations": {
      "current": 1,
      "max": 1
    }
  }
}`,
    },
    {
      name: 'Admin Login',
      method: 'POST',
      path: '/api/auth/login',
      description: 'Authenticate and receive JWT token',
      example: `curl -X POST ${baseUrl}/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "username": "admin",
    "password": "your-password"
  }'`,
      response: `{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "admin",
    "isAdmin": true
  }
}`,
    },
    {
      name: 'List Licenses',
      method: 'GET',
      path: '/api/licenses',
      description: 'Get all licenses (requires admin token)',
      example: `curl -X GET ${baseUrl}/api/licenses \\
  -H "Authorization: Bearer YOUR_TOKEN"`,
      response: `{
  "licenses": [
    {
      "id": "abc123",
      "key": "XXXXX-XXXXX-XXXXX-XXXXX",
      "product": "bastion-pro",
      "active": true,
      ...
    }
  ]
}`,
    },
    {
      name: 'Create License',
      method: 'POST',
      path: '/api/licenses',
      description: 'Create a new license (requires admin token)',
      example: `curl -X POST ${baseUrl}/api/licenses \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "product": "bastion-pro",
    "userId": "user123",
    "expiresInDays": 30,
    "maxActivations": 1
  }'`,
      response: `{
  "license": {
    "id": "abc123",
    "key": "XXXXX-XXXXX-XXXXX-XXXXX",
    "product": "bastion-pro",
    ...
  }
}`,
    },
    {
      name: 'Update License',
      method: 'PATCH',
      path: '/api/licenses/:id',
      description: 'Update license properties (requires admin token)',
      example: `curl -X PATCH ${baseUrl}/api/licenses/abc123 \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "active": false
  }'`,
      response: `{
  "license": {
    "id": "abc123",
    "active": false,
    ...
  }
}`,
    },
    {
      name: 'Delete License',
      method: 'DELETE',
      path: '/api/licenses/:id',
      description: 'Delete a license (requires admin token)',
      example: `curl -X DELETE ${baseUrl}/api/licenses/abc123 \\
  -H "Authorization: Bearer YOUR_TOKEN"`,
      response: `{
  "success": true
}`,
    },
  ];

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl font-display font-bold text-bastion-text mb-2">
          API DOCUMENTATION
        </h2>
        <p className="text-bastion-muted font-display text-sm">
          RESTful API endpoints for license management and verification
        </p>
      </div>

      <div className="bg-bastion-surface border border-bastion-border rounded-lg p-6 mb-8">
        <h3 className="font-display font-bold text-bastion-text mb-3">
          BASE URL
        </h3>
        <div className="bg-bastion-bg border border-bastion-border rounded p-4">
          <code className="text-bastion-accent font-display text-sm">{baseUrl}</code>
        </div>
      </div>

      <div className="space-y-6">
        {endpoints.map((endpoint, index) => (
          <div
            key={index}
            className="bg-bastion-surface border border-bastion-border rounded-lg overflow-hidden"
          >
            <div className="p-6 border-b border-bastion-border">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`px-3 py-1 rounded text-xs font-display font-bold ${
                    endpoint.method === 'GET'
                      ? 'bg-bastion-accent bg-opacity-20 text-bastion-accent'
                      : endpoint.method === 'POST'
                      ? 'bg-blue-500 bg-opacity-20 text-blue-400'
                      : endpoint.method === 'PATCH'
                      ? 'bg-bastion-warning bg-opacity-20 text-bastion-warning'
                      : 'bg-bastion-error bg-opacity-20 text-bastion-error'
                  }`}
                >
                  {endpoint.method}
                </span>
                <h3 className="font-display font-bold text-bastion-text">
                  {endpoint.name}
                </h3>
              </div>
              <code className="text-bastion-muted font-display text-sm">
                {endpoint.path}
              </code>
              <p className="mt-3 text-bastion-text text-sm">{endpoint.description}</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-display font-bold text-bastion-text">
                    REQUEST EXAMPLE
                  </h4>
                  <button
                    onClick={() => copyCode(endpoint.example, `${endpoint.name}-request`)}
                    className="text-xs font-display text-bastion-muted hover:text-bastion-accent transition-colors"
                  >
                    {copiedEndpoint === `${endpoint.name}-request` ? 'COPIED!' : 'COPY'}
                  </button>
                </div>
                <div className="bg-bastion-bg border border-bastion-border rounded p-4 overflow-x-auto">
                  <pre className="text-xs font-display text-bastion-text">
                    {endpoint.example}
                  </pre>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-display font-bold text-bastion-text">
                    RESPONSE EXAMPLE
                  </h4>
                  <button
                    onClick={() => copyCode(endpoint.response, `${endpoint.name}-response`)}
                    className="text-xs font-display text-bastion-muted hover:text-bastion-accent transition-colors"
                  >
                    {copiedEndpoint === `${endpoint.name}-response` ? 'COPIED!' : 'COPY'}
                  </button>
                </div>
                <div className="bg-bastion-bg border border-bastion-border rounded p-4 overflow-x-auto">
                  <pre className="text-xs font-display text-bastion-accent">
                    {endpoint.response}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-bastion-surface border border-bastion-accent rounded-lg p-6">
        <h3 className="font-display font-bold text-bastion-accent mb-3">
          INTEGRATION NOTES
        </h3>
        <ul className="space-y-2 text-sm text-bastion-text font-display">
          <li className="flex items-start gap-2">
            <span className="text-bastion-accent mt-1">▸</span>
            <span>All endpoints return JSON responses</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-bastion-accent mt-1">▸</span>
            <span>Admin endpoints require Bearer token authentication</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-bastion-accent mt-1">▸</span>
            <span>Verification endpoint (/api/verify) is public for client integration</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-bastion-accent mt-1">▸</span>
            <span>HWID binding is automatic on first verification with hwid parameter</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-bastion-accent mt-1">▸</span>
            <span>License keys are format: XXXXX-XXXXX-XXXXX-XXXXX (5-5-5-5)</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
