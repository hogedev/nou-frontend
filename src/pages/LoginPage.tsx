import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../stores/auth-store";

const API_URL = import.meta.env.VITE_API_URL || "/api/v1";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setLoading(true);
    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const resp = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      if (!resp.ok) {
        const data = await resp.json().catch(() => null);
        throw new Error(data?.detail || `Error ${resp.status}`);
      }
      const data = await resp.json();
      login(data.access_token, data.username);
      toast.success(isRegister ? "登録しました" : "ログインしました");
      navigate("/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-bold text-[var(--c-text-strong)] text-center mb-6">
          農作業日誌
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ユーザー名"
            autoComplete="username"
            className="w-full bg-surface-1 border border-border rounded-lg px-3 py-3 text-sm text-[var(--c-text)] placeholder:text-[var(--c-text-faint)] focus:border-accent focus:outline-none"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワード"
            autoComplete={isRegister ? "new-password" : "current-password"}
            className="w-full bg-surface-1 border border-border rounded-lg px-3 py-3 text-sm text-[var(--c-text)] placeholder:text-[var(--c-text-faint)] focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-white rounded-lg py-3 text-sm font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? "処理中..." : isRegister ? "アカウント作成" : "ログイン"}
          </button>
        </form>
        <button
          onClick={() => setIsRegister(!isRegister)}
          className="mt-4 w-full text-center text-xs text-[var(--c-text-muted)] hover:text-[var(--c-text)]"
        >
          {isRegister
            ? "アカウントをお持ちの方はログイン"
            : "アカウントを作成する"}
        </button>
      </div>
    </div>
  );
}
