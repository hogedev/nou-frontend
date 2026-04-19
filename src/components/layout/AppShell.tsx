import { Outlet, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../stores/auth-store";
import { toggleTheme } from "../../lib/theme";
import { BottomNav } from "./BottomNav";
import type { SiteSetting } from "../../types";

const API_URL = import.meta.env.VITE_API_URL || "/api/v1";

export function AppShell() {
  const username = useAuthStore((s) => s.username);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const { data: publicSettings } = useQuery({
    queryKey: ["public", "settings"],
    queryFn: async () => {
      const resp = await fetch(`${API_URL}/public/settings`);
      if (!resp.ok) return [];
      return resp.json() as Promise<SiteSetting[]>;
    },
    staleTime: 5 * 60 * 1000,
  });

  const siteName =
    publicSettings?.find((s) => s.key === "site_name")?.value || "minilog";

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-surface-0 pb-16">
      <header className="sticky top-0 z-40 bg-surface-1 border-b border-border">
        <div className="max-w-md mx-auto flex items-center justify-between px-3 py-2">
          <h1 className="text-lg font-bold text-[var(--c-text-strong)]">
            {siteName}
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--c-text-muted)]">
              {username}
            </span>
            <button
              onClick={toggleTheme}
              className="rounded border border-border px-2 py-1 text-xs hover:border-border-hover"
            >
              🌓
            </button>
            <button
              onClick={handleLogout}
              className="rounded border border-border px-2 py-1 text-xs text-[var(--c-danger)] hover:border-[var(--c-danger)]"
            >
              logout
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-md mx-auto px-3 py-4">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
