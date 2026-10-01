export enum PermissionAction {
  VIEW = "view",
  CREATE_EDIT = "createEdit",
  DELETE = "delete",
  PRINT_EXPORT = "printExport",
}

export enum JobKey {
  ROLE_MANAGEMENT = "roleManagement",
  ACCOUNT_MANAGEMENT = "accountManagement",
}

interface User {
  id: number;
  empId: string;
  name: string;
  departmentCode: string;
  departmentName: string;
  titleName: string;
  lastLoginAt: string;
}

interface UserRole {
  id: number;
  roleName: string;
  roleCode: string;
  isAdmin: boolean;
}

interface GroupItem {
  groupId: number;
  groupName: string;
  enabled: boolean;
}

interface JobPermission {
  permissionId: number;
  action: PermissionAction;
  permissionName: string;
  checked: boolean;
}

export interface JobPermissionItem {
  groupId: number;
  jobId: number;
  jobKey: JobKey;
  jobName: string;
  enabled: boolean;
  permissions: JobPermission[];
}

export interface UserResponse {
  user: User;
  role: UserRole | null;
  groups: GroupItem[];
  jobPermissions: JobPermissionItem[];
}

/** GET auth/login-options：登入頁依後端設定顯示可用入口 */
export interface LoginOptionsResponse {
  /** 統一登入是否已設定 */
  oauth: boolean;
  /** DEVMOD 開發者登入是否開放 */
  devLogin: boolean;
}

/** POST auth/oauth/start：瀏覽器整頁導向此網址 */
export interface OauthStartResponse {
  authorizationUrl: string;
}

/** POST auth/oauth/callback：登入完成後的使用者資料與站內返回位置 */
export interface OauthCallbackResponse {
  session: UserResponse;
  redirectTo: string;
}

export type UpstreamLogoutStatus =
  | "confirmed"
  | "unconfirmed"
  | "not_attempted"
  /** 開發者登入沒有上游可登出 */
  | "not_applicable";

/** POST auth/logout：本地一律完成，上游結果如實回報 */
export interface LogoutResponse {
  localLogout: "completed";
  upstreamLogout: UpstreamLogoutStatus;
  message?: string;
}
