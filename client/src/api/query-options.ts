import { minutes } from "@/utils/time";

export const queryOptions: {
  [key: string]: Partial<{
    staleTime: number;
    gcTime: number;
    refetchOnWindowFocus: boolean;
    retry: number;
    retryDelay: number;
  }>;
} = {
  useGetMeQuery: {
    staleTime: minutes(5),
    gcTime: minutes(10),
  },
  // 登入入口旗標只隨環境設定變動
  useLoginOptionsQuery: {
    staleTime: minutes(10),
    gcTime: minutes(30),
  },
  useGetRolesQuery: {
    staleTime: minutes(10),
    gcTime: minutes(30),
  },
  useGetRolePermissionsQuery: {
    staleTime: minutes(5),
    gcTime: minutes(30),
  },
  useGetUsersQuery: {
    staleTime: minutes(5),
    gcTime: minutes(30),
  },
  useGetUserQuery: {
    staleTime: minutes(5),
    gcTime: minutes(30),
  },
  useGetEmployeesQuery: {
    staleTime: minutes(1),
    gcTime: minutes(5),
  },
  useGetRoleUsersQuery: {
    staleTime: minutes(5),
    gcTime: minutes(30),
  },
  useGetPermissionsQuery: {
    staleTime: minutes(60),
    gcTime: minutes(120),
  },
};
