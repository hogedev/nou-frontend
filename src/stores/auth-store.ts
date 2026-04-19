import { create } from "zustand";

interface AuthState {
  token: string | null;
  username: string | null;
  login: (token: string, username: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("diary-token"),
  username: localStorage.getItem("diary-username"),
  login: (token, username) => {
    localStorage.setItem("diary-token", token);
    localStorage.setItem("diary-username", username);
    set({ token, username });
  },
  logout: () => {
    localStorage.removeItem("diary-token");
    localStorage.removeItem("diary-username");
    set({ token: null, username: null });
  },
}));
