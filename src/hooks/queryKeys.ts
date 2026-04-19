export const queryKeys = {
  entries: {
    all: ["entries"] as const,
    list: (params?: Record<string, string>) =>
      ["entries", "list", params] as const,
    detail: (id: number) => ["entries", id] as const,
    dates: (year?: number, month?: number) =>
      ["entries", "dates", year, month] as const,
  },
  admin: {
    settings: ["admin", "settings"] as const,
    users: ["admin", "users"] as const,
  },
};
