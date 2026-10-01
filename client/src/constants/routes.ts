export const ROUTES = {
  home: {
    href: "/",
    label: "首頁",
  },
  login: {
    href: "/login",
    label: "登入頁",
  },
  oauthCallback: {
    href: "/oauth/callback",
    label: "統一登入回呼",
  },
  permissionManagement: {
    href: "/permissionManagement",
    label: "權限管理",
  },
  roleManagement: {
    href: "/permissionManagement/roleManagement",
    label: "角色管理",
  },
  createRoleManagement: {
    href: "/permissionManagement/roleManagement/create",
    label: "新增角色",
  },
  sortRoleManagement: {
    href: "/permissionManagement/roleManagement/sort",
    label: "排序角色",
  },
  editRoleManagement: {
    href: "/permissionManagement/roleManagement/edit",
    label: "編輯角色",
  },
  accountManagement: {
    href: "/permissionManagement/accountManagement",
    label: "帳號管理",
  },
  createAccountManagement: {
    href: "/permissionManagement/accountManagement/create",
    label: "加入同仁",
  },
  editAccountManagement: {
    href: "/permissionManagement/accountManagement/edit",
    label: "編輯帳號",
  },
} as const;

/** 登入頁帶此參數時，proxy 會先清掉失效的登入 cookie 再放行（見 proxy.ts）。 */
export const SESSION_EXPIRED_PARAM = "expired";

/** 登入狀態失效（API 回 401）時導向的登入頁。 */
export const SESSION_EXPIRED_LOGIN_HREF = `${ROUTES.login.href}?${SESSION_EXPIRED_PARAM}=1`;

/**
 * @name 路由標籤對照表
 * @description 路由與顯示名稱的對照表，用於 Breadcrumb 顯示。
 */
export const ROUTE_LABEL_MAP = Object.values(ROUTES).reduce(
  (acc, route) => {
    acc[route.href] = route.label;
    return acc;
  },
  {} as Record<string, string>,
);
