import { ROUTES } from "@/constants/routes";
import { redirect } from "next/navigation";

const PermissionManagementPage = () => {
  // 目前權限管理頁沒有內容，所以預設直接轉向角色管理頁
  redirect(ROUTES.roleManagement.href);
};

export default PermissionManagementPage;
