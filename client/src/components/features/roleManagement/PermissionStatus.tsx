import { PermissionAction, PermissionItem } from "@/api/types";
import Flex from "@/components/ui/Flex";
import CheckIcon from "@mui/icons-material/Check";
import { Box } from "@mui/material";

// 固定欄位順序，與 TableHeader 的 rightColumns 對應
const ACTION_ORDER = [
  PermissionAction.VIEW,
  PermissionAction.CREATE_EDIT,
  PermissionAction.DELETE,
  PermissionAction.PRINT_EXPORT,
];

type Props = {
  permissions: PermissionItem[];
};

const PermissionStatus = ({ permissions }: Props) => {
  const permissionMap = Object.fromEntries(
    permissions.map((p) => [p.action, p.checked]),
  );

  return (
    <Flex sx={{ ml: "auto", pr: 2 }}>
      {ACTION_ORDER.map((action) => (
        <Box
          key={action}
          sx={{ display: "flex", justifyContent: "center", minWidth: 80 }}
        >
          {permissionMap[action] ? (
            <CheckIcon color="primary" />
          ) : (
            // Checkbox 的寬度是 42px
            <Box sx={{ minWidth: 42, minHeight: 24 }} />
          )}
        </Box>
      ))}
    </Flex>
  );
};

export default PermissionStatus;
