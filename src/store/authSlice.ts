import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOKEN_KEY, USER_KEY } from '@/lib/config';
import type { User } from './types';

interface AuthState {
  token: string | null;
  user: User | null;
  // Email captured at the start of signup / reset so later steps can reuse it.
  pendingEmail: string | null;
  // Password captured during signup so we can sign in silently after role select.
  pendingPassword: string | null;
}

// Rehydrate from localStorage on the client. Guarded for SSR (no window).
const loadInitial = (): AuthState => {
  const base: AuthState = {
    token: null,
    user: null,
    pendingEmail: null,
    pendingPassword: null,
  };
  if (typeof window === 'undefined') return base;
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const rawUser = localStorage.getItem(USER_KEY);
    return {
      ...base,
      token: token || null,
      user: rawUser ? (JSON.parse(rawUser) as User) : null,
    };
  } catch {
    return base;
  }
};

const persist = (token: string | null, user: User | null) => {
  if (typeof window === 'undefined') return;
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  } catch {
    /* storage unavailable — ignore */
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: loadInitial(),
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ token?: string | null; user?: User | null }>,
    ) {
      if (action.payload.token !== undefined) state.token = action.payload.token;
      if (action.payload.user !== undefined) state.user = action.payload.user;
      persist(state.token, state.user);
    },
    setPendingSignup(
      state,
      action: PayloadAction<{ email?: string; password?: string }>,
    ) {
      if (action.payload.email !== undefined)
        state.pendingEmail = action.payload.email;
      if (action.payload.password !== undefined)
        state.pendingPassword = action.payload.password;
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.pendingEmail = null;
      state.pendingPassword = null;
      persist(null, null);
    },
  },
});

export const { setCredentials, setPendingSignup, logout } = authSlice.actions;
export default authSlice.reducer;
