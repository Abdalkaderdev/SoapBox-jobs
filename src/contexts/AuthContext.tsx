"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { MockUser, validateCredentials, findUserByEmail } from "@/lib/mock-users";
import {
  SSO_STORAGE_KEYS,
  SSOUser,
  getStoredSSOUser,
  clearSSOSession,
} from "@/lib/sso";

const AUTH_STORAGE_KEY = "soapbox_auth";

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "job_seeker" | "church_admin";
  churchId?: string;
  profilePhoto?: string;
  ministryStatement?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  ssoAuthenticated?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signup: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ success: boolean; error?: string }>;
  loginWithSSO: (
    ssoUser: SSOUser,
    token?: string,
    refreshToken?: string
  ) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  loginWithSSO: async () => {},
  logout: () => {},
  updateProfile: () => {},
});

function getStoredAuth(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    // First check for SSO user
    const ssoUser = getStoredSSOUser();
    if (ssoUser) {
      return {
        id: ssoUser.id,
        email: ssoUser.email,
        name: ssoUser.name,
        role: ssoUser.role,
        churchId: ssoUser.churchId,
        username: ssoUser.username,
        firstName: ssoUser.firstName,
        lastName: ssoUser.lastName,
        ssoAuthenticated: ssoUser.ssoAuthenticated,
      };
    }

    // Fall back to regular auth storage
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function setStoredAuth(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = getStoredAuth();
    setUser(storedUser);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const validUser = validateCredentials(email, password);
    if (validUser) {
      const authUser: AuthUser = {
        id: validUser.id,
        email: validUser.email,
        name: validUser.name,
        role: validUser.role,
        churchId: validUser.churchId,
        profilePhoto: validUser.profilePhoto,
        ministryStatement: validUser.ministryStatement,
      };
      setUser(authUser);
      setStoredAuth(authUser);
      return { success: true };
    }
    return { success: false, error: "Invalid email or password" };
  }, []);

  const signup = useCallback(
    async (email: string, password: string, name: string) => {
      // Check if user already exists
      if (findUserByEmail(email)) {
        return {
          success: false,
          error: "An account with this email already exists",
        };
      }

      // Create new user (in real app, this would save to database)
      const newUser: AuthUser = {
        id: `user-${Date.now()}`,
        email,
        name,
        role: "job_seeker",
      };

      setUser(newUser);
      setStoredAuth(newUser);
      return { success: true };
    },
    []
  );

  const loginWithSSO = useCallback(
    async (ssoUser: SSOUser, token?: string, refreshToken?: string) => {
      const authUser: AuthUser = {
        id: ssoUser.id,
        email: ssoUser.email,
        name: ssoUser.name,
        role: ssoUser.role,
        churchId: ssoUser.churchId,
        username: ssoUser.username,
        firstName: ssoUser.firstName,
        lastName: ssoUser.lastName,
        ssoAuthenticated: true,
      };

      // Store SSO session data
      if (typeof window !== "undefined") {
        localStorage.setItem(SSO_STORAGE_KEYS.AUTH, JSON.stringify(ssoUser));
        if (token) {
          localStorage.setItem(SSO_STORAGE_KEYS.TOKEN, token);
        }
        if (refreshToken) {
          localStorage.setItem(SSO_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        }
      }

      setUser(authUser);
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    setStoredAuth(null);
    clearSSOSession();
  }, []);

  const updateProfile = useCallback((updates: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      setStoredAuth(updated);
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        loginWithSSO,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
