"use client";

import { SubmenuItem } from "@/constants/menu";
import { isRouteActive } from "@/lib/navigation";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import CircleIcon from "@mui/icons-material/Circle";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import Link from "next/link";
import { Fragment, useState } from "react";

interface Props {
  label: string;
  submenuList?: SubmenuItem[];
  pathname: string;
}

const SidebarMenuGroup = ({ label, submenuList, pathname }: Props) => {
  // 檢查子選單中有沒有被開啟的
  const isGroupActive =
    submenuList?.some((item) => isRouteActive(pathname, item.href)) ?? false;

  const [collapseOpen, setCollapseOpen] = useState(isGroupActive);

  return (
    <Fragment>
      <ListItemButton
        onClick={() => setCollapseOpen(!collapseOpen)}
        selected={collapseOpen}
        sx={(theme) => ({
          position: "relative",
          borderBottom: "1px solid",
          borderBottomColor: "custom.white10",
          "&.Mui-selected": {
            bgcolor: alpha(theme.palette.primary.main, 0.25),
          },
          "&.Mui-selected:hover": {
            bgcolor: alpha(theme.palette.primary.main, 0.25),
          },
          "&::after": {
            content: '""',
            position: "absolute",
            top: "50%",
            left: 0,
            transform: "translateY(-50%)",
            width: "4px",
            height: "40px",
            bgcolor: "primary.main",
            borderRadius: 1,
            opacity: isGroupActive ? 1 : 0,
          },
        })}
      >
        <ListItemText primary={label} sx={{ whiteSpace: "nowrap" }} />
        {submenuList && (
          <ListItemIcon sx={{ color: "inherit" }}>
            {collapseOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
          </ListItemIcon>
        )}
      </ListItemButton>
      {submenuList && (
        <Collapse in={collapseOpen} timeout="auto" unmountOnExit>
          <List
            disablePadding
            sx={{
              borderBottomWidth: "1px",
              borderBottomStyle: "solid",
              borderBottomColor: "custom.white10",
            }}
          >
            {submenuList.map((item) => (
              <ListItemButton
                key={item.key}
                component={Link}
                href={item.href}
                selected={isRouteActive(pathname, item.href)}
                sx={{
                  pl: 4,
                  color: "inherit",
                  "&.Mui-selected": {
                    bgcolor: "primary.main",
                  },

                  "&.Mui-selected:hover": {
                    bgcolor: "primary.dark",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "inherit" }}>
                  <CircleIcon sx={{ fontSize: 6 }} />
                </ListItemIcon>
                <ListItemText
                  secondary={item.label}
                  slotProps={{
                    secondary: {
                      color: "inherit",
                    },
                  }}
                  sx={{ whiteSpace: "nowrap" }}
                />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      )}
    </Fragment>
  );
};

export default SidebarMenuGroup;
