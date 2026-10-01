"use client";

import Flex from "@/components/ui/Flex";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton, Typography } from "@mui/material";
import Image from "next/image";

interface Props {
  open: boolean;
  onToggle: () => void;
}

const DrawerHeader = ({ open, onToggle }: Props) => {
  return (
    <Flex
      sx={{
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
        px: 2,
        py: "6px",
      }}
    >
      {open && (
        <Image src="/logo.svg" alt="Nest Seed" width={36} height={36} />
      )}
      {open && (
        <Typography variant="h6" noWrap sx={{ color: "common.white" }}>
          Nest Seed
        </Typography>
      )}
      <IconButton
        onClick={onToggle}
        sx={{ p: 0, ml: open ? "auto" : 0, color: "common.white" }}
      >
        <MenuIcon />
      </IconButton>
    </Flex>
  );
};

export default DrawerHeader;
