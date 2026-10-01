import { PermissionAction } from "@/api/types";
import Flex from "@/components/ui/Flex";
import type { PermissionJob } from "@/configs/permissionActions";
import { Box, Checkbox, List, Typography } from "@mui/material";

type Props = {
  job: PermissionJob;
  jobPermissions: Record<string, boolean>;
  onSelectAll: (checked: boolean) => void;
  onPermissionChange: (action: string, checked: boolean) => void;
};

const PermissionJobRow = ({
  job,
  jobPermissions,
  onSelectAll,
  onPermissionChange,
}: Props) => {
  const visiblePermissions = job.permissions.filter((p) => p.visibility);
  const permissionValues = visiblePermissions.map(
    (p) => jobPermissions?.[p.action] ?? false,
  );
  const allChecked = permissionValues.every(Boolean);
  const someChecked = permissionValues.some(Boolean);
  const isViewChecked = [
    PermissionAction.CREATE_EDIT,
    PermissionAction.DELETE,
    PermissionAction.PRINT_EXPORT,
  ].some((a) => jobPermissions?.[a]);

  return (
    <List
      component="div"
      sx={{
        display: "flex",
        alignItems: "center",
        py: 3,
        pl: 28,
        borderBottom: "1px solid",
        borderBottomColor: "custom.black10",
      }}
    >
      <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
        {job.jobName}
      </Typography>

      <Flex sx={{ ml: "auto", pr: 2 }}>
        <Flex sx={{ justifyContent: "center", minWidth: 80 }}>
          <Checkbox
            checked={allChecked}
            indeterminate={someChecked && !allChecked}
            onChange={(e) => onSelectAll(e.target.checked)}
          />
        </Flex>
        {job.permissions.map((p) => (
          <Flex key={p.action} sx={{ justifyContent: "center", minWidth: 80 }}>
            {p.visibility ? (
              <Checkbox
                checked={jobPermissions?.[p.action] ?? false}
                disabled={p.action === PermissionAction.VIEW && isViewChecked}
                onChange={(e) => onPermissionChange(p.action, e.target.checked)}
              />
            ) : (
              // Checkbox 的寬度是 42px
              <Box sx={{ minWidth: 42, minHeight: 24 }} />
            )}
          </Flex>
        ))}
      </Flex>
    </List>
  );
};

export default PermissionJobRow;
