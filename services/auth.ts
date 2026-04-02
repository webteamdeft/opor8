
import { api } from './api';
import { User, Role } from '../types';

/**
 * Custom Authentication Service
 * Interacts with the backend API for all user-related operations.
 */

let authListeners: ((user: User | null) => void)[] = [];

export const authService = {
  async signUp(email: string, password: string, name: string): Promise<User> {
    const payload = {
      email,
      password,
      fullName: name,
      deviceToken: 'sdlkfj',
      deviceType: 'web',
    };

    const response = await api.post('/user/signUp', payload);
    const rootData = response?.data || response;

    let token = rootData?.token || rootData?.accessToken;
    if (!token && rootData?.data?.token?.accessToken) {
      token = rootData.data.token.accessToken;
    } else if (typeof token === 'object' && token?.accessToken) {
      token = token.accessToken;
    }

    let rawUser = rootData?.user || rootData?.data?.user;

    if (token && typeof token === 'string') {
      localStorage.setItem('op8_token', token);

      if (!rawUser) {
        console.log('[AuthService] User data missing in SignUp response, fetching profile...');
        const profileResponse = await api.get('/user/profile', {
          'Authorization': `Bearer ${token}`
        });
        const pData = profileResponse?.data || profileResponse;
        rawUser = pData?.user || pData;
      }
    }

    const mappedUser = this.mapUser(rawUser);
    this.notifyListeners(mappedUser);
    return mappedUser;
  },

  async signIn(email: string, password: string): Promise<User> {
    const payload = {
      email,
      password,
      deviceToken: 'sdlkfj',
      deviceType: 'web',
    };

    const response = await api.post('/user/signIn', payload);
    const rootData = response?.data || response;

    let token = rootData?.token || rootData?.accessToken;

    if (rootData?.data?.token?.accessToken) {
      token = rootData.data.token.accessToken;
    } else if (typeof token === 'object' && token?.accessToken) {
      token = token.accessToken;
    }

    let rawUser = rootData?.user || rootData?.data?.user;

    if (token && typeof token === 'string') {
      console.log('[AuthService] Token extracted successfully:', token.substring(0, 10));
      localStorage.setItem('op8_token', token);

      if (!rawUser) {
        console.log('[AuthService] User data missing in SignIn response, fetching profile...');
        try {
          const profileResponse = await api.get('/user/profile', {
            'Authorization': `Bearer ${token}`
          });
          const pData = profileResponse?.data || profileResponse;
          rawUser = pData?.user || pData;
        } catch (err) {
          console.warn('[AuthService] Failed to fetch profile after login:', err);
        }
      }
    }

    const mappedUser = this.mapUser(rawUser);
    this.notifyListeners(mappedUser);

    return mappedUser;
  },

  async signOut() {
    try {
      await api.post('/user/logout', {});
    } catch {
    } finally {
      localStorage.removeItem('op8_token');
      this.notifyListeners(null);
    }
  },

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('op8_token');
    if (!token || token === 'undefined' || token === 'null') return null;

    const cleanToken = token.replace(/^Bearer\s+/i, '').trim();

    try {
      console.log('[AuthService] Fetching profile. Token:', cleanToken.substring(0, 10));

      const response = await api.get('/user/profile', {
        'Authorization': `Bearer ${cleanToken}`,
        'token': cleanToken
      });

      const data = response?.data || response;
      const rawUser = data?.user || (data?.email ? data : null);

      if (!rawUser) {
        console.warn('[AuthService] Profile fetch passed but no user found in response:', data);
        return null;
      }

      const mappedUser = this.mapUser(rawUser);
      this.notifyListeners(mappedUser);
      return mappedUser;
    } catch (err: any) {
      console.error('[AuthService] Profile fetch failed:', err);
      // Only clear token if it's definitely invalid (401/403)
      // keeping it for now allows the user to refresh and try again if it was a network glitch
      if (err.message && (err.message.includes('401') || err.message.includes('403'))) {
        console.warn('[AuthService] Token rejected by server (401/403). Clearing session.');
        localStorage.removeItem('op8_token');
      }
      return null;
    }
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await api.post('/user/change-password', {
      oldPassword,
      newPassword
    });
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    authListeners.push(callback);
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            authListeners = authListeners.filter(l => l !== callback);
          },
        },
      },
    } as any;
  },

  notifyListeners(user: User | null) {
    authListeners.forEach(cb => cb(user));
  },

  mapUser(rawUser: any): User {
    if (!rawUser) {
      return {
        id: 'USR_TEMP',
        name: 'User',
        email: '',
        role: Role.USER,
        isPaid: false,
        emailVerified: false
      } as User;
    }

    return {
      ...rawUser,
      id: rawUser._id || rawUser.id || rawUser.userId || 'USR_TEMP',
      name: rawUser.fullName || rawUser.name || rawUser.userName || 'User',
      email: rawUser.email || '',
      role: (rawUser.role as Role) || Role.USER,
      isPro: !!(rawUser.isPro || rawUser.is_pro),
      isPaid: !!(rawUser.isPaid || rawUser.is_paid || rawUser.isPro || rawUser.is_pro),
      emailVerified: rawUser.emailVerified !== false,
    };
  },
};
