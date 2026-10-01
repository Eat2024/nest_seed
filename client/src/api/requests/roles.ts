import api from "@/api/config";
import { endpoints } from "@/api/endpoints";
import {
  CreateRoleRequest,
  EditRoleNameRequest,
  EditRolePermissionsRequest,
  GetPermissionsResponse,
  GetRolePermissionsResponse,
  GetRolesResponse,
  GetRoleUsersResponse,
  SortRoleRequest,
} from "@/api/types";

/**
 * @name 角色列表
 * @description 含 userCount
 */
export const getRoles = async (): Promise<GetRolesResponse> => {
  const res = await api<GetRolesResponse>({
    method: "GET",
    url: endpoints.ROLES,
  });
  return res.data;
};

/**
 * @name 取得單一角色權限
 * @param roleId 角色 ID
 */
export const getRolePermissions = async (
  roleId: number,
): Promise<GetRolePermissionsResponse> => {
  const res = await api<GetRolePermissionsResponse>({
    method: "GET",
    url: `${endpoints.ROLES}/${roleId}/permissions`,
  });
  return res.data;
};

/**
 * @name 取得全部權限目錄
 */
export const getPermissions = async (): Promise<GetPermissionsResponse> => {
  const res = await api<GetPermissionsResponse>({
    method: "GET",
    url: endpoints.ROLES_PERMISSIONS,
  });
  return res.data;
};

/**
 * @name 新增角色
 */
export const createRole = async (data: CreateRoleRequest): Promise<void> => {
  const res = await api({
    method: "POST",
    url: endpoints.ROLES,
    data,
  });
  return res.data;
};

/**
 * @name 設定角色權限
 */
export const editRolePermissions = async (
  roleId: number,
  data: EditRolePermissionsRequest,
): Promise<void> => {
  const res = await api<void>({
    method: "PUT",
    url: `${endpoints.ROLES}/${roleId}/permissions`,
    data,
  });
  return res.data;
};

/**
 * @name 角色改名
 */
export const editRoleName = async (
  roleId: number,
  data: EditRoleNameRequest,
): Promise<void> => {
  const res = await api<void>({
    method: "PATCH",
    url: `${endpoints.ROLES}/${roleId}`,
    data,
  });
  return res.data;
};

/**
 * @name 軟刪除角色
 */
export const deleteRole = async (roleId: number): Promise<void> => {
  const res = await api<void>({
    method: "DELETE",
    url: `${endpoints.ROLES}/${roleId}`,
  });
  return res.data;
};

/**
 * @name 角色排序與批次改名
 * @description 依傳入順序重排，可一併更新名稱
 */
export const sortRole = async (data: SortRoleRequest): Promise<void> => {
  const res = await api<void>({
    method: "PUT",
    url: `${endpoints.ROLES}/reorder`,
    data,
  });
  return res.data;
};

/**
 * @name 綁定此角色的使用者清單
 * @param roleId 角色 ID
 */
export const getRoleUsers = async (
  roleId: number,
): Promise<GetRoleUsersResponse> => {
  const res = await api<GetRoleUsersResponse>({
    method: "GET",
    url: `${endpoints.ROLES}/${roleId}/users`,
  });
  return res.data;
};
