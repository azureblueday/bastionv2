import { nanoid } from 'nanoid';

export interface License {
  id: string;
  key: string;
  product: string;
  userId: string;
  hwid?: string;
  active: boolean;
  expiresAt: Date;
  createdAt: Date;
  lastUsed?: Date;
  maxActivations: number;
  currentActivations: number;
  metadata?: Record<string, any>;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  createdAt: Date;
}

// In-memory database (replace with actual database in production)
class Database {
  private licenses: Map<string, License> = new Map();
  private users: Map<string, User> = new Map();
  private licensesByKey: Map<string, string> = new Map();

  // License operations
  createLicense(data: {
    product: string;
    userId: string;
    expiresAt: Date;
    maxActivations?: number;
  }): License {
    const id = nanoid();
    const key = this.generateLicenseKey();
    
    const license: License = {
      id,
      key,
      product: data.product,
      userId: data.userId,
      active: true,
      expiresAt: data.expiresAt,
      createdAt: new Date(),
      maxActivations: data.maxActivations || 1,
      currentActivations: 0,
    };

    this.licenses.set(id, license);
    this.licensesByKey.set(key, id);
    
    return license;
  }

  getLicense(id: string): License | undefined {
    return this.licenses.get(id);
  }

  getLicenseByKey(key: string): License | undefined {
    const id = this.licensesByKey.get(key);
    return id ? this.licenses.get(id) : undefined;
  }

  getAllLicenses(): License[] {
    return Array.from(this.licenses.values());
  }

  updateLicense(id: string, updates: Partial<License>): License | undefined {
    const license = this.licenses.get(id);
    if (!license) return undefined;

    const updated = { ...license, ...updates };
    this.licenses.set(id, updated);
    return updated;
  }

  deleteLicense(id: string): boolean {
    const license = this.licenses.get(id);
    if (!license) return false;

    this.licensesByKey.delete(license.key);
    this.licenses.delete(id);
    return true;
  }

  // User operations
  createUser(data: { username: string; email?: string }): User {
    const id = nanoid();
    const user: User = {
      id,
      username: data.username,
      email: data.email,
      createdAt: new Date(),
    };

    this.users.set(id, user);
    return user;
  }

  getUser(id: string): User | undefined {
    return this.users.get(id);
  }

  getUserByUsername(username: string): User | undefined {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  // Utility methods
  private generateLicenseKey(): string {
    const segments = 4;
    const segmentLength = 5;
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    
    let key = '';
    for (let i = 0; i < segments; i++) {
      if (i > 0) key += '-';
      for (let j = 0; j < segmentLength; j++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    }
    
    return key;
  }

  // Initialize with sample data
  initialize() {
    // Create a sample user
    const user = this.createUser({
      username: 'testuser',
      email: 'test@example.com',
    });

    // Create sample licenses
    this.createLicense({
      product: 'bastion-pro',
      userId: user.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      maxActivations: 1,
    });

    this.createLicense({
      product: 'bastion-enterprise',
      userId: user.id,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      maxActivations: 5,
    });
  }
}

export const db = new Database();

// Initialize with sample data on first import
if (db.getAllLicenses().length === 0) {
  db.initialize();
}
