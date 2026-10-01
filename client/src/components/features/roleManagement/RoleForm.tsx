"use client";

import PermissionGroupRow from "@/components/features/roleManagement/PermissionGroupRow";
import PermissionJobRow from "@/components/features/roleManagement/PermissionJobRow";
import TableHeader from "@/components/features/roleManagement/TableHeader";
import useRolePermissions, {
  emptyPermissions,
  Permissions,
} from "@/components/features/roleManagement/useRolePermissions";
import BottomActionBar from "@/components/ui/BottomActionBar";
import StickyBox from "@/components/ui/StickyBox";
import { permissionActions } from "@/configs/permissionActions";
import { Box, Button, Collapse, List, TextField } from "@mui/material";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";

const MIN_WIDTH = 760;
const RIGHT_COLUMNS = [
  "全選",
  "檢視",
  "新增/編輯",
  "刪除/清空",
  "列印/匯出",
];

type Props = {
  defaultRoleName?: string;
  defaultPermissions?: Permissions;
  onSave?: (roleName: string, permissions: Permissions) => void;
  onCancel?: () => void;
  isPending?: boolean;
};

const RoleForm = ({
  defaultRoleName = "",
  defaultPermissions = emptyPermissions,
  onSave,
  onCancel,
  isPending = false,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { roleName: defaultRoleName } });
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(permissionActions.map((g) => [g.groupName, true])),
  );
  const {
    permissions,
    handleGroupSelectAll,
    handleSelectAll,
    handlePermission,
  } = useRolePermissions(defaultPermissions);

  const toggleGroup = (groupName: string) =>
    setOpenGroups((prev) => ({ ...prev, [groupName]: !prev[groupName] }));

  return (
    <>
      <Box sx={{ flex: 1, minWidth: MIN_WIDTH, bgcolor: "common.white" }}>
        <Box sx={{ px: 4, py: 4 }}>
          <TextField
            {...register("roleName", { required: "請填寫角色名稱" })}
            variant="outlined"
            size="small"
            label="角色名稱"
            placeholder="請輸入角色名稱"
            error={!!errors.roleName}
            helperText={errors.roleName?.message}
          />
        </Box>

        <StickyBox sx={{ minWidth: MIN_WIDTH }}>
          <TableHeader leftColumn="項目" rightColumns={RIGHT_COLUMNS} />
        </StickyBox>

        <List sx={{ width: "100%", pt: 0, pb: 12 }}>
          {permissionActions.map((group) => (
            <Fragment key={group.groupName}>
              <PermissionGroupRow
                group={group}
                open={openGroups[group.groupName]}
                permissions={permissions}
                onToggle={() => toggleGroup(group.groupName)}
                onSelectAll={(checked) =>
                  handleGroupSelectAll(group.groupName, checked)
                }
              />
              <Collapse
                in={openGroups[group.groupName]}
                timeout="auto"
                unmountOnExit
              >
                {group.jobs.map((job) => (
                  <PermissionJobRow
                    key={job.jobKey}
                    job={job}
                    jobPermissions={permissions[job.jobKey]}
                    onSelectAll={(checked) =>
                      handleSelectAll(job.jobKey, checked)
                    }
                    onPermissionChange={(action, checked) =>
                      handlePermission(job.jobKey, action, checked)
                    }
                  />
                ))}
              </Collapse>
            </Fragment>
          ))}
        </List>
      </Box>

      <BottomActionBar>
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          取消
        </Button>
        <Button
          variant="contained"
          loading={isPending}
          onClick={handleSubmit(({ roleName }) => onSave?.(roleName, permissions))}
        >
          儲存
        </Button>
      </BottomActionBar>
    </>
  );
};

export default RoleForm;
