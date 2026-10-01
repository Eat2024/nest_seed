import { GetPermissionsResponse } from "@/api/types";
import { Permissions } from "@/components/features/roleManagement/useRolePermissions";

export const extractPermissionIds = (
  permissionGroups: GetPermissionsResponse,
  permissions: Permissions,
): number[] =>
  permissionGroups.groups.flatMap((group) =>
    group.jobs.flatMap((job) =>
      job.permissions
        .filter((p) => permissions[job.jobKey]?.[p.action])
        .map((p) => p.permissionId),
    ),
  );
