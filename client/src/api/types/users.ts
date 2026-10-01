import { Pagination, PaginationParams } from "./common";

export type GetUsersRequest = PaginationParams & {
  keyword?: string;
  roleId?: number;
};

export interface UserItemRole {
  id: number;
  roleName: string;
}

export interface UserItem {
  id: number;
  empId: string;
  name: string;
  role: UserItemRole | null;
  departmentName: string;
  lastLoginAt: string;
  personStatus: string;
  isActive: boolean;
  isSystemAdmin: boolean;
}

export interface GetUsersResponse extends Pagination {
  users: UserItem[];
}

export interface UpdateUsersStatusRequest {
  empIds: string[];
  isActive: boolean;
  roleId: number;
}

export interface UpdateUsersStatusResponse {
  users: UserItem[];
}

export interface EmployeeOption {
  empId: string;
  name: string;
  departmentName: string;
  isActive: boolean;
}

export interface UpdateUserRequest {
  roleId?: number;
  isActive?: boolean;
  description?: string;
}

export type UpdateUserResponse = Pick<
  UserItem,
  | "id"
  | "empId"
  | "name"
  | "departmentName"
  | "role"
  | "isActive"
  | "isSystemAdmin"
> & {
  description: string;
};
