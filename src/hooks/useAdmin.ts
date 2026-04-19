import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi, deleteApi } from "../api/client";
import { queryKeys } from "./queryKeys";
import type { SiteSetting, AdminUser } from "../types";

export function useSettings() {
  return useQuery({
    queryKey: queryKeys.admin.settings,
    queryFn: () => fetchApi<SiteSetting[]>("/admin/settings"),
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (settings: SiteSetting[]) =>
      fetchApi<SiteSetting[]>("/admin/settings", {
        method: "PUT",
        body: JSON.stringify(settings),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.settings });
    },
  });
}

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.admin.users,
    queryFn: () => fetchApi<AdminUser[]>("/admin/users"),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { is_admin?: boolean; is_public?: boolean };
    }) =>
      fetchApi<AdminUser>(`/admin/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.users });
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteApi(`/admin/users/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.users });
    },
  });
}
