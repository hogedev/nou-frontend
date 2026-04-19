import { NavLink } from "react-router-dom";
import { clsx } from "clsx";
import { useAuthStore } from "../../stores/auth-store";

const BASE_ITEMS = [
  { to: "/", label: "タイムライン", icon: "📋" },
  { to: "/new", label: "投稿", icon: "📷" },
  { to: "/calendar", label: "カレンダー", icon: "📅" },
];

const SETTINGS_ITEM = { to: "/settings", label: "設定", icon: "⚙️" };

export function BottomNav() {
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const items = isAdmin ? [...BASE_ITEMS, SETTINGS_ITEM] : BASE_ITEMS;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface-1 border-t border-border z-50">
      <div className="flex justify-around max-w-md mx-auto">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              clsx(
                "flex flex-col items-center py-2 px-4 text-xs transition-colors",
                isActive
                  ? "text-accent"
                  : "text-[var(--c-text-muted)] hover:text-[var(--c-text)]",
              )
            }
          >
            <span className="text-lg mb-0.5">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
