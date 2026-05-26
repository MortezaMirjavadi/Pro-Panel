import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "ADMIN" | "EDITOR" | "VIEWER";

interface User {
  id: string;
  name: string;
  role: UserRole;
}

interface AuthStore {
  /** Current logged-in user (null if not logged in) */
  user: User | null;
  /** Available roles for the mock switcher */
  availableRoles: UserRole[];
  /** Log in with a mock user */
  login: (role: UserRole) => void;
  /** Log out */
  logout: () => void;
  /** Switch role without full login flow */
  switchRole: (role: UserRole) => void;
  /** Check if the current user has access to a given set of allowed roles */
  hasAccess: (allowedRoles?: string[]) => boolean;
}

const MOCK_USERS: Record<UserRole, User> = {
  ADMIN: { id: "1", name: "مدیر سیستم", role: "ADMIN" },
  EDITOR: { id: "2", name: "ویرایشگر", role: "EDITOR" },
  VIEWER: { id: "3", name: "بیننده", role: "VIEWER" },
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: MOCK_USERS.ADMIN, // Default to ADMIN for demo
      availableRoles: ["ADMIN", "EDITOR", "VIEWER"],

      login: (role: UserRole) => {
        set({ user: MOCK_USERS[role] });
      },

      logout: () => {
        set({ user: null });
      },

      switchRole: (role: UserRole) => {
        set({ user: MOCK_USERS[role] });
      },

      /**
       * Check if the current user's role is in the allowedRoles list.
       * If allowedRoles is undefined or empty, the item is accessible to everyone.
       */
      hasAccess: (allowedRoles?: string[]) => {
        const { user } = get();
        // Not logged in → no access
        if (!user) return false;
        // No restriction → accessible to all
        if (!allowedRoles || allowedRoles.length === 0) return true;
        return allowedRoles.includes(user.role);
      },
    }),
    {
      name: "pro-panel-auth",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
