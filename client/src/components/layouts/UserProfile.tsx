"use client";

import { queryKeys } from "@/api/query-keys";
import { logout } from "@/api/requests";
import Flex from "@/components/ui/Flex";
import { useAuthContext } from "@/providers/AuthProvider";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Avatar,
  Box,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MouseEvent, useState } from "react";

const UserProfile = () => {
  const queryClient = useQueryClient();
  const { userData } = useAuthContext();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (e: MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const { mutate: logoutMutate } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData([queryKeys.ME], null);
    },
  });

  const handleLogout = () => {
    logoutMutate();
    handleClose();
  };

  const displayName = userData?.user.name ?? "-";
  const avatarInitials = displayName.slice(0, 2).toUpperCase();
  const empId = userData?.user.empId ?? "-";

  return (
    <>
      <Flex sx={{ flexShrink: 0, alignItems: "center" }}>
        <Avatar>{avatarInitials}</Avatar>
        <Box sx={{ ml: 4 }}>
          <Typography variant="body1">{displayName}</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {empId}
          </Typography>
        </Box>
        <IconButton onClick={handleOpen}>
          <ArrowDropDownOutlinedIcon />
        </IconButton>
      </Flex>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
      >
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          登出
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserProfile;
