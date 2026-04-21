import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import {
  useSettings,
  useUpdateSettings,
  useUsers,
  useUpdateUser,
  useDeleteUser,
} from "../hooks/useAdmin";
import type { AdminUser } from "../types";

function SiteSettings() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();

  const defaults = useMemo(() => {
    const result = {
      siteName: "",
      siteDescription: "",
      registrationEnabled: false,
    };
    if (settings) {
      for (const s of settings) {
        if (s.key === "site_name") result.siteName = s.value;
        if (s.key === "site_description") result.siteDescription = s.value;
        if (s.key === "registration_enabled")
          result.registrationEnabled = s.value === "true";
      }
    }
    return result;
  }, [settings]);

  const [siteName, setSiteName] = useState<string | null>(null);
  const [siteDescription, setSiteDescription] = useState<string | null>(null);
  const [registrationEnabled, setRegistrationEnabled] = useState<
    boolean | null
  >(null);

  const displaySiteName = siteName ?? defaults.siteName;
  const displaySiteDescription = siteDescription ?? defaults.siteDescription;
  const displayRegistrationEnabled =
    registrationEnabled ?? defaults.registrationEnabled;

  function handleSave() {
    updateSettings.mutate(
      [
        { key: "site_name", value: displaySiteName },
        { key: "site_description", value: displaySiteDescription },
        {
          key: "registration_enabled",
          value: String(displayRegistrationEnabled),
        },
      ],
      {
        onSuccess: () => toast.success("設定を保存しました"),
        onError: () => toast.error("設定の保存に失敗しました"),
      },
    );
  }

  if (isLoading) {
    return <p className="text-sm text-[var(--c-text-muted)]">読み込み中...</p>;
  }

  return (
    <section>
      <h2 className="text-base font-bold text-[var(--c-text-strong)] mb-3">
        サイト設定
      </h2>
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-[var(--c-text-muted)] mb-1">
            サイト名
          </label>
          <input
            type="text"
            value={displaySiteName}
            onChange={(e) => setSiteName(e.target.value)}
            className="w-full bg-surface-1 border border-border rounded-lg px-3 py-2 text-sm text-[var(--c-text)] focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-[var(--c-text-muted)] mb-1">
            サイト説明
          </label>
          <textarea
            value={displaySiteDescription}
            onChange={(e) => setSiteDescription(e.target.value)}
            rows={3}
            className="w-full bg-surface-1 border border-border rounded-lg px-3 py-2 text-sm text-[var(--c-text)] focus:border-accent focus:outline-none resize-none"
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--c-text)]">ユーザー登録</span>
          <button
            type="button"
            onClick={() => setRegistrationEnabled(!displayRegistrationEnabled)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              displayRegistrationEnabled ? "bg-accent" : "bg-[var(--c-border)]"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                displayRegistrationEnabled ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>
        <button
          onClick={handleSave}
          disabled={updateSettings.isPending}
          className="w-full bg-accent text-white rounded-lg py-2.5 text-sm font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {updateSettings.isPending ? "保存中..." : "保存"}
        </button>
      </div>
    </section>
  );
}

function UserRow({ user }: { user: AdminUser }) {
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  function handleToggle(field: "is_admin" | "is_public") {
    updateUser.mutate(
      { id: user.id, data: { [field]: !user[field] } },
      {
        onSuccess: () => toast.success("更新しました"),
        onError: () => toast.error("更新に失敗しました"),
      },
    );
  }

  function handleDelete() {
    if (!confirm(`${user.username} を削除しますか？`)) return;
    deleteUser.mutate(user.id, {
      onSuccess: () => toast.success("削除しました"),
      onError: () => toast.error("削除に失敗しました"),
    });
  }

  return (
    <tr className="border-b border-border">
      <td className="py-2 text-sm text-[var(--c-text)]">{user.username}</td>
      <td className="py-2 text-center">
        <button
          type="button"
          onClick={() => handleToggle("is_admin")}
          disabled={updateUser.isPending}
          className={`relative w-9 h-5 rounded-full transition-colors ${
            user.is_admin ? "bg-accent" : "bg-[var(--c-border)]"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
              user.is_admin ? "translate-x-4" : ""
            }`}
          />
        </button>
      </td>
      <td className="py-2 text-center">
        <button
          type="button"
          onClick={() => handleToggle("is_public")}
          disabled={updateUser.isPending}
          className={`relative w-9 h-5 rounded-full transition-colors ${
            user.is_public ? "bg-accent" : "bg-[var(--c-border)]"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
              user.is_public ? "translate-x-4" : ""
            }`}
          />
        </button>
      </td>
      <td className="py-2 text-center">
        <button
          onClick={handleDelete}
          disabled={deleteUser.isPending}
          className="text-xs text-[var(--c-danger)] hover:underline disabled:opacity-50"
        >
          削除
        </button>
      </td>
    </tr>
  );
}

function UserManagement() {
  const { data: users, isLoading } = useUsers();

  if (isLoading) {
    return <p className="text-sm text-[var(--c-text-muted)]">読み込み中...</p>;
  }

  return (
    <section>
      <h2 className="text-base font-bold text-[var(--c-text-strong)] mb-3">
        ユーザー管理
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border text-xs text-[var(--c-text-muted)]">
              <th className="py-2 font-medium">ユーザー名</th>
              <th className="py-2 font-medium text-center">管理者</th>
              <th className="py-2 font-medium text-center">公開</th>
              <th className="py-2 font-medium text-center"></th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <SiteSettings />
      <UserManagement />
    </div>
  );
}
