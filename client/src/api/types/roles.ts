import { JobKey, PermissionAction } from "./auth";

export interface Role {
  id: number;
  roleName: string;
  roleCode: string;
  isAdmin: boolean;
  isActive: boolean;
  sortOrder: number;
  userCount: number;
}

export interface PermissionItem {
  /** 必為真實 id——後端只回該 job 實際擁有的權限，不再有 null 佔位。 */
  permissionId: number;
  action: PermissionAction;
  label: string;
  permissionName: string;
  checked: boolean;
}

interface JobItem {
  jobId: number;
  jobKey: JobKey;
  jobName: string;
  permissions: PermissionItem[];
}

interface GroupItem {
  groupId: number;
  groupName: string;
  jobs: JobItem[];
}

/** 角色成員（綁定此角色的使用者） */
export interface RoleMember {
  id: number;
  empId: string;
  name: string;
  roleName: string;
  departmentName: string;
  titleName: string;
  lastLoginAt: string;
  isActive: boolean;
}

/** 排序項目（依陣列順序重排，可一併改名） */
export interface SortRoleItem {
  roleId: number;
  roleName: string;
}

/** 新增角色的請求 */
export interface CreateRoleRequest {
  roleName: string;
  permissionIds: number[];
}

/** 設定角色權限的請求 */
export interface EditRolePermissionsRequest {
  permissionIds: number[];
}

/** 角色改名的請求 */
export interface EditRoleNameRequest {
  roleName: string;
}

/** 角色排序與批次改名的請求 */
export interface SortRoleRequest {
  roles: SortRoleItem[];
}

/** 角色列表的回應 */
export type GetRolesResponse = Role[];

/** 單一角色權限的回應 */
export interface GetRolePermissionsResponse {
  roleId: number;
  roleName: string;
  isAdmin: boolean;
  groups: GroupItem[];
}

/** 全部權限目錄的回應 */
export type GetPermissionsResponse = Pick<GetRolePermissionsResponse, "groups">;

/** 綁定此角色的使用者清單的回應 */
export type GetRoleUsersResponse = RoleMember[];
