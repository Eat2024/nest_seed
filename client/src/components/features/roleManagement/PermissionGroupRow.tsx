import ExpandableGroupHeader from "@/components/features/roleManagement/ExpandableGroupHeader";
import Flex from "@/components/ui/Flex";
import type { PermissionGroup } from "@/configs/permissionActions";
import { ListItemButton } from "@mui/material";
import { Permissions } from "./useRolePermissions";

type Props = {
  group: PermissionGroup;
  open: boolean;
  permissions: Permissions;
  onToggle: () => void;
  onSelectAll: (checked: boolean) => void;
};

const PermissionGroupRow = ({
  group,
  open,
  permissions,
  onToggle,
  onSelectAll,
}: Props) => {
  const groupPermissionValues = group.jobs.flatMap((job) =>
    job.permissions
      .filter((p) => p.visibility)
      .map((p) => permissions[job.jobKey]?.[p.action] ?? false),
  );
  const allChecked = groupPermissionValues.every(Boolean);
  const someChecked = groupPermissionValues.some(Boolean);

  return (
    <ListItemButton
      onClick={onToggle}
      sx={{
        py: 3,
        pr: 2,
        borderBottom: "1px solid",
        borderBottomColor: "custom.black10",
      }}
    >
      <Flex sx={{ flex: 1, alignItems: "center" }}>
        <ExpandableGroupHeader
          open={open}
          name={group.groupName}
          checked={allChecked}
          indeterminate={someChecked && !allChecked}
          onSelectAll={onSelectAll}
        />
      </Flex>
    </ListItemButton>
  );
};

export default PermissionGroupRow;
