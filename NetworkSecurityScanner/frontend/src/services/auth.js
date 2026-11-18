import apiClient, {
  fetchCsrfToken,
  API_LOGIN,
  API_LOGOUT,
  API_ME,
  API_REGISTER,
  API_PROFILE,
  API_SUPABASE_LOGIN,
} from './api';

/**
 * Custom error class for authentication errors
 */
export class AuthError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
  }
}

/**
 * Authentication service handling login, logout, registration, and profile management.
 * Supports both Django session auth and Supabase JWT auth.
 * All methods throw AuthError on failure with relevant status codes.
 */
export const authService = {
  /** Clear authentication state and redirect to login. */
  logout: async () => {
    await apiClient.post(API_LOGOUT);
  },

  /** Login with Supabase JWT access token. */
  supabaseLogin: async (accessToken) => {
    await fetchCsrfToken();
    const response = await apiClient.post(API_SUPABASE_LOGIN, {
      access_token: accessToken,
    });
    if (response.status >= 400) {
      const errorData = response.data || { message: 'Supabase login failed' };
      throw new AuthError(errorData.error || errorData.detail || 'Supabase login failed', response.status);
    }
    return response.data;
  },

  /** Authenticate user with Supabase credentials (email/password) and get JWT token. */
  supabaseAuth: async (email, password) => {
    const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new AuthError('Supabase configuration missing (REACT_APP_SUPABASE_URL/ANON_KEY)', 500);
    }

    // Step 1: Get Supabase session token using email/password
    const supabaseResp = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'apikey': supabaseAnonKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    if (!supabaseResp.ok) {
      const errorData = await supabaseResp.json();
      throw new AuthError(
        errorData.message || 'Authentication failed',
        supabaseResp.status
      );
    }

    const supabaseData = await supabaseResp.json();
    if (!supabaseData.session?.access_token) {
      throw new AuthError('No access token in Supabase response', 500);
    }

    // Step 2: Login with the Supabase JWT token via our Django endpoint
    return authService.supabaseLogin(supabaseData.session.access_token);
  },

  /** Login with Django credentials (username/password). */
  login: async (username, password) => {
    await fetchCsrfToken();
    const response = await apiClient.post(API_LOGIN, {
      username,
      password,
    });
    if (response.status >= 400) {
      const errorData = response.data || { error: 'Login failed' };
      throw new AuthError(errorData.error || errorData.detail || 'Invalid credentials', response.status);
    }
    return response.data;
  },

  /** Retrieve current authenticated user profile. */
  getMe: async () => {
    const response = await apiClient.get(API_ME);
    if (response.status === 401) {
      // Clear invalid session
      await authService.logout();
    }
    return response.data;
  },

  register: async (username, email, password) => {
    const response = await apiClient.post(API_REGISTER, {
      username,
      email,
      password,
    });
    if (response.status >= 400) {
      const errorData = response.data || { error: 'Registration failed' };
      throw new AuthError(errorData.error || errorData.detail || 'Registration failed', response.status);
    }
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await apiClient.put(API_PROFILE, data);
    if (response.status >= 400) {
      const errorData = response.data || { error: 'Profile update failed' };
      throw new AuthError(errorData.error || errorData.detail || 'Profile update failed', response.status);
    }
    return response.data;
  },
};