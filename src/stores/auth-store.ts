import { create } from "zustand";

interface AuthState {
  token: string | null;
  username: string | null;
  isAdmin: boolean | null;
  login: (token: string, username: string, isAdmin: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("diary-token"),
  username: localStorage.getItem("diary-username"),
  isAdmin:
    localStorage.getItem("diary-is-admin") === "true"
      ? true
      : localStorage.getItem("diary-is-admin") === "false"
        ? false
        : null,
  login: (token, username, isAdmin) => {
    localStorage.setItem("diary-token", token);
    localStorage.setItem("diary-username", username);
    localStorage.setItem("diary-is-admin", String(isAdmin));
    set({ token, username, isAdmin });
  },
  logout: () => {
    localStorage.removeItem("diary-token");
    localStorage.removeItem("diary-username");
    localStorage.removeItem("diary-is-admin");
    set({ token: null, username: null, isAdmin: null });
  },
}));
