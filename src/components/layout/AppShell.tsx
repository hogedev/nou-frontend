import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth-store";
import { toggleTheme } from "../../lib/theme";
import { BottomNav } from "./BottomNav";

export function AppShell() {
  const username = useAuthStore((s) => s.username);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-surface-0 pb-16">
      <header className="sticky top-0 z-40 bg-surface-1 border-b border-border">
        <div className="max-w-md mx-auto flex items-center justify-between px-3 py-2">
          <h1 className="text-lg font-bold text-[var(--c-text-strong)]">
            農作業日誌
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
