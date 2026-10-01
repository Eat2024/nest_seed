import { JobKey, PermissionAction } from "@/api/types";

export type PermissionItem = {
  action: PermissionAction;
  visibility: boolean;
};

export type PermissionJob = {
  jobKey: JobKey;
  jobName: string;
  permissions: PermissionItem[];
};

export type PermissionGroup = {
  groupName: string;
  jobs: PermissionJob[];
};

export const permissionActions: PermissionGroup[] = [
  {
    groupName: "權限管理",
    jobs: [
      {
        jobKey: JobKey.ROLE_MANAGEMENT,
        jobName: "角色管理",
        permissions: [
          {
            action: PermissionAction.VIEW,
            visibility: true,
          },
          {
            action: PermissionAction.CREATE_EDIT,
            visibility: true,
          },
          {
            action: PermissionAction.BUILD,
            visibility: false,
          },
          {
            action: PermissionAction.DELETE,
            visibility: true,
          },
          {
            action: PermissionAction.PRINT_EXPORT,
            visibility: false,
          },
        ],
      },
      {
        jobKey: JobKey.ACCOUNT_MANAGEMENT,
        jobName: "帳號管理",
        permissions: [
          {
            action: PermissionAction.VIEW,
            visibility: true,
          },
          {
            action: PermissionAction.CREATE_EDIT,
            visibility: true,
          },
          {
            action: PermissionAction.BUILD,
            visibility: false,
          },
          {
            action: PermissionAction.DELETE,
            visibility: false,
          },
          {
            action: PermissionAction.PRINT_EXPORT,
            visibility: false,
          },
        ],
      },
    ],
  },
];
