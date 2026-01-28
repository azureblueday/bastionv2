import { NextRequest } from 'next/server';
import { generateToken, validateAdminCredentials } from '@/lib/auth';
import { apiResponse, apiError } from '@/lib/api';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return apiError('Username and password are required', 400);
    }

    if (!validateAdminCredentials(username, password)) {
      return apiError('Invalid credentials', 401);
    }

    const token = generateToken({
      username,
      isAdmin: true,
    });

    return apiResponse({
      token,
      user: {
        username,
        isAdmin: true,
      },
    });
  } catch (error) {
    return apiError('Internal server error', 500);
  }
}
