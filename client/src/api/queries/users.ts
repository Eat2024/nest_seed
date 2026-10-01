import { queryKeys } from "@/api/query-keys";
import { queryOptions } from "@/api/query-options";
import { getEmployees, getUser, getUsers } from "@/api/requests";
import { GetUsersRequest } from "@/api/types";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useGetUsersQuery<
  TData = Awaited<ReturnType<typeof getUsers>>,
  TError = AxiosError,
>(
  params?: GetUsersRequest,
  options?: Omit<
    UseQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: [queryKeys.USERS, params],
    queryFn: () => getUsers(params),
    ...queryOptions.useGetUsersQuery,
    ...options,
  });
}

export function useGetUserQuery<
  TData = Awaited<ReturnType<typeof getUser>>,
  TError = AxiosError,
>(
  id: number,
  options?: Omit<
    UseQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: [queryKeys.USER, { id }],
    queryFn: () => getUser(id),
    ...queryOptions.useGetUserQuery,
    ...options,
  });
}

export function useGetEmployeesQuery<
  TData = Awaited<ReturnType<typeof getEmployees>>,
  TError = AxiosError,
>(
  empId: string,
  options?: Omit<
    UseQueryOptions<Awaited<ReturnType<typeof getEmployees>>, TError, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: [queryKeys.EMPLOYEES, { empId }],
    queryFn: () => getEmployees(empId),
    ...queryOptions.useGetEmployeesQuery,
    ...options,
  });
}
