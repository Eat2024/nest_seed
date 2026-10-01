"use client";

import {
  useGetRolePermissionsQuery,
  useGetRolesQuery,
} from "@/api/queries/roles";
import { JobKey, PermissionAction } from "@/api/types";
import ExpandableGroupHeader from "@/components/features/roleManagement/ExpandableGroupHeader";
import PermissionStatus from "@/components/features/roleManagement/PermissionStatus";
import RoleManagementToolbar from "@/components/features/roleManagement/RoleManagementToolbar";
import TableHeader from "@/components/features/roleManagement/TableHeader";
import PageTitle from "@/components/layouts/PageTitle";
import Flex from "@/components/ui/Flex";
import StickyBox from "@/components/ui/StickyBox";
import TabBar from "@/components/ui/TabBar";
import useRequirePermission from "@/hooks/useRequirePermission";
import { Box, Collapse, List, ListItemButton, Typography } from "@mui/material";
import { keepPreviousData } from "@tanstack/react-query";
import { Fragment, SyntheticEvent, useState } from "react";

const MIN_WIDTH = 680;
const RIGHT_COLUMNS = ["檢視", "新增/編輯", "建立", "刪除/清空", "列印/匯出"];

const RoleManagementPage = () => {
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [openGroups, setOpenGroups] = useState<Record<number, boolean>>({});

  // 權限檢查
  const { hasAccess } = useRequirePermission(
    JobKey.ROLE_MANAGEMENT,
    PermissionAction.VIEW,
  );

  const { data: rolesData, isPending } = useGetRolesQuery({
    enabled: hasAccess,
  });

  const tabs = (rolesData ?? []).map((role) => ({
    value: role.id,
    label: role.roleName,
  }));

  // selectedRoleId 為 null（初始狀態）時預設選第一個 tab
  const activeRoleId = selectedRoleId ?? tabs[0]?.value ?? null;

  const { data: rolePermissionsData } = useGetRolePermissionsQuery(
    activeRoleId ?? 0,
    {
      enabled: hasAccess && activeRoleId !== null,
      placeholderData: keepPreviousData,
    },
  );

  const handleChange = (_: SyntheticEvent, newValue: number) => {
    setSelectedRoleId(newValue);
  };

  const toggleGroup = (groupId: number) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !(prev[groupId] ?? true),
    }));
  };

  if (!hasAccess) return null;
  if (isPending) return null;

  return (
    <>
      <PageTitle title="角色管理" />

      <StickyBox sx={{ minWidth: MIN_WIDTH }}>
        <Flex
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            px: 4,
            bgcolor: "custom.background",
            borderBottom: "1px solid",
            borderBottomColor: "custom.black10",
          }}
        >
          <TabBar tabs={tabs} value={activeRoleId} onChange={handleChange} />
          <RoleManagementToolbar roleId={activeRoleId} />
        </Flex>

        <TableHeader leftColumn="項目" rightColumns={RIGHT_COLUMNS} />
      </StickyBox>

      <Box sx={{ flex: 1, minWidth: MIN_WIDTH, bgcolor: "common.white" }}>
        <List sx={{ width: "100%", py: 0 }}>
          {(rolePermissionsData?.groups ?? []).map((group) => (
            <Fragment key={group.groupId}>
              <ListItemButton
                onClick={() => toggleGroup(group.groupId)}
                sx={{
                  py: 3,
                  borderBottom: "1px solid",
                  borderBottomColor: "custom.black10",
                }}
              >
                <ExpandableGroupHeader
                  open={openGroups[group.groupId] !== false}
                  name={group.groupName}
                />
              </ListItemButton>
              <Collapse
                key={`collapse-${group.groupId}`}
                in={openGroups[group.groupId] !== false}
                timeout="auto"
                unmountOnExit
              >
                {group.jobs.map((job) => (
                  <List
                    key={job.jobId}
                    component="div"
                    sx={{
                      display: "flex",
                      py: 3,
                      pl: 14,
                      borderBottom: "1px solid",
                      borderBottomColor: "custom.black10",
                    }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
                      {job.jobName}
                    </Typography>
                    <PermissionStatus permissions={job.permissions} />
                  </List>
                ))}
              </Collapse>
            </Fragment>
          ))}
        </List>
      </Box>
    </>
  );
};

export default RoleManagementPage;
