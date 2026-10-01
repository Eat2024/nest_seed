import { JobKey } from "@/api/types";
import type { SvgIconComponent } from "@mui/icons-material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { ROUTES } from "./routes";

export interface MenuItem {
  key: string;
  label: string;
  href: string;
  icon: SvgIconComponent;
  children?: SubmenuItem[];
}

export interface SubmenuItem {
  key: string;
  label: string;
  href: string;
  // 對應頁面 useRequirePermission 檢查的 jobKey，供選單過濾顯示用
  jobKey: JobKey;
}

const getLastPathSegment = (path: string) => {
  return path.split("/").filter(Boolean).pop() ?? "";
};

export const menuItems: MenuItem[] = [
  {
    key: getLastPathSegment(ROUTES.permissionManagement.href),
    label: ROUTES.permissionManagement.label,
    href: ROUTES.permissionManagement.href,
    icon: AdminPanelSettingsIcon,
    children: [
      {
        key: getLastPathSegment(ROUTES.roleManagement.href),
        label: ROUTES.roleManagement.label,
        href: ROUTES.roleManagement.href,
        jobKey: JobKey.ROLE_MANAGEMENT,
      },
      {
        key: getLastPathSegment(ROUTES.accountManagement.href),
        label: ROUTES.accountManagement.label,
        href: ROUTES.accountManagement.href,
        jobKey: JobKey.ACCOUNT_MANAGEMENT,
      },
    ],
  },
];
