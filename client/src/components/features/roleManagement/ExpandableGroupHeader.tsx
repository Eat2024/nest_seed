import Flex from "@/components/ui/Flex";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Checkbox, Typography } from "@mui/material";

type Props = {
  open: boolean;
  name: string;
  checked?: boolean;
  indeterminate?: boolean;
  onSelectAll?: (checked: boolean) => void;
};

const ExpandableGroupHeader = ({
  open,
  name,
  checked,
  indeterminate,
  onSelectAll,
}: Props) => {
  return (
    <Flex sx={{ gap: 4, alignItems: "center" }}>
      {open ? <ExpandLess /> : <ExpandMore />}
      {onSelectAll && (
        <Checkbox
          checked={checked}
          indeterminate={indeterminate}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onSelectAll(e.target.checked)}
        />
      )}
      <Typography
        variant="body2"
        sx={(theme) => ({
          whiteSpace: "nowrap",
          fontWeight: theme.typography.fontWeightBold,
        })}
      >
        {name}
      </Typography>
    </Flex>
  );
};

export default ExpandableGroupHeader;
