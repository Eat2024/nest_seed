"use client";

import Flex from "@/components/ui/Flex";
import { Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

type Props = {
  leftColumn: string;
  rightColumns: string[];
};

const TableHeader = ({ leftColumn, rightColumns }: Props) => {
  return (
    <Flex
      sx={{
        backgroundColor: grey[200],
        borderBottom: "1px solid",
        borderBottomColor: "custom.black10",
        justifyContent: "space-between",
        alignItems: "center",
        height: 44,
        pl: 14,
        pr: 2,
        py: "6px",
      }}
    >
      <Typography
        variant="body2"
        sx={(theme) => ({
          whiteSpace: "nowrap",
          fontWeight: theme.typography.fontWeightBold,
        })}
      >
        {leftColumn}
      </Typography>
      <Flex>
        {rightColumns.map((item) => (
          <Typography
            key={item}
            variant="body2"
            sx={(theme) => ({
              minWidth: 80,
              textAlign: "center",
              whiteSpace: "nowrap",
              fontWeight: theme.typography.fontWeightBold,
            })}
          >
            {item}
          </Typography>
        ))}
      </Flex>
    </Flex>
  );
};

export default TableHeader;
