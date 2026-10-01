import Flex from "@/components/ui/Flex";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  title: string;
  info?: string;
  actions?: ReactNode;
}

const PageTitle = ({ title, info, actions }: Props) => {
  return (
    <Flex
      sx={{
        alignItems: "center",
        flexShrink: 0,
        flexWrap: "wrap",
        gap: 2,
        px: 4,
        py: 2,
      }}
    >
      <Typography variant="h6">{title}</Typography>
      {info && (
        <Flex sx={{ alignItems: "center", gap: 2 }}>
          <InfoOutlinedIcon sx={{ color: "text.secondary" }} />
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {info}
          </Typography>
        </Flex>
      )}

      {actions && <Box sx={{ ml: "auto" }}>{actions}</Box>}
    </Flex>
  );
};

export default PageTitle;
