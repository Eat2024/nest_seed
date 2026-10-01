import { queryKeys } from "@/api/query-keys";
import { queryOptions } from "@/api/query-options";
import {
  getPermissions,
  getRolePermissions,
  getRoles,
  getRoleUsers,
} from "@/api/requests";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useGetRolesQuery<
  TData = Awaited<ReturnType<typeof getRoles>>,
  TError = AxiosError,
>(
  options?: Omit<
    UseQueryOptions<Awaited<ReturnType<typeof getRoles>>, TError, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: [queryKeys.ROLES],
    queryFn: () => getRoles(),
    ...queryOptions.useGetRolesQuery,
    ...options,
  });
}

export function useGetRolePermissionsQuery<
  TData = Awaited<ReturnType<typeof getRolePermissions>>,
  TError = AxiosError,
>(
  roleId: number,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof getRolePermissions>>,
      TError,
      TData
    >,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: [queryKeys.ROLE_PERMISSIONS, { roleId }],
    queryFn: () => getRolePermissions(roleId),
    ...queryOptions.useGetRolePermissionsQuery,
    ...options,
  });
}

export function useGetRoleUsersQuery<
  TData = Awaited<ReturnType<typeof getRoleUsers>>,
  TError = AxiosError,
>(
  roleId: number,
  options?: Omit<
    UseQueryOptions<Awaited<ReturnType<typeof getRoleUsers>>, TError, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: [queryKeys.ROLE_USERS, { roleId }],
    queryFn: () => getRoleUsers(roleId),
    ...queryOptions.useGetRoleUsersQuery,
    ...options,
  });
}

export function useGetPermissionsQuery<
  TData = Awaited<ReturnType<typeof getPermissions>>,
  TError = AxiosError,
>(
  options?: Omit<
    UseQueryOptions<Awaited<ReturnType<typeof getPermissions>>, TError, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: [queryKeys.PERMISSIONS],
    queryFn: () => getPermissions(),
    ...queryOptions.useGetPermissionsQuery,
    ...options,
  });
}
