import api from "@/api/config";
import { endpoints } from "@/api/endpoints";
import {
  EmployeeOption,
  GetUsersRequest,
  GetUsersResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  UpdateUsersStatusRequest,
  UpdateUsersStatusResponse,
} from "@/api/types";

/**
 * @name 使用者列表
 * @param keyword 姓名/工號/部門/角色名稱 模糊搜尋。
 * @param roleId 依角色 id 精準篩選（與 keyword 可同時生效）。
 * @param page 當前頁數，default value: 1
 * @param pageSize 每頁筆數，default value: 50
 * @description 分頁 + 關鍵字模糊搜尋
 */
export const getUsers = async (
  params?: GetUsersRequest,
): Promise<GetUsersResponse> => {
  const res = await api<GetUsersResponse>({
    method: "GET",
    url: endpoints.USERS,
    params,
  });
  return res.data;
};

/**
 * @name 批次更新啟用狀態
 * @param empIds 要更新的使用者工號陣列
 * @param isActive 啟用（true）或停用（false）
 * @param roleId 角色 id
 * @description 無法對超級管理員進行停權
 */
export const updateUsersStatus = async (
  data: UpdateUsersStatusRequest,
): Promise<UpdateUsersStatusResponse> => {
  const res = await api<UpdateUsersStatusResponse>({
    method: "PATCH",
    url: `${endpoints.USERS}/status`,
    data,
  });
  return res.data;
};

/**
 * @name 使用者詳情
 * @param id 使用者 id（path parameter）
 */
export const getUser = async (id: number): Promise<UpdateUserResponse> => {
  const res = await api<UpdateUserResponse>({
    method: "GET",
    url: `${endpoints.USERS}/${id}`,
  });
  return res.data;
};

/**
 * @name 更新使用者（部分更新）
 * @param empId 使用者工號
 * @param isActive 啟用（true）或停用（false）
 * @param roleId 角色 id
 * @param description 備註
 */
export const updateUser = async (
  empId: string,
  data: UpdateUserRequest,
): Promise<UpdateUserResponse> => {
  const res = await api<UpdateUserResponse>({
    method: "PATCH",
    url: `${endpoints.USERS}/${empId}`,
    data,
  });
  return res.data;
};

/**
 * @name 員工搜尋 options
 * @param empId 5~8 碼員編（模糊搜尋）
 * @description 用於新增帳號時的員工下拉選單
 */
export const getEmployees = async (
  empId: string,
): Promise<EmployeeOption[]> => {
  const res = await api<EmployeeOption[]>({
    method: "GET",
    url: `${endpoints.USERS}/employees`,
    params: { empId },
  });
  return res.data;
};
