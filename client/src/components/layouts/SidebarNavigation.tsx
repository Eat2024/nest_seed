"use client";

import { isExactRouteActive } from "@/lib/navigation";
import useVisibleMenuItems from "@/hooks/useVisibleMenuItems";
import { List, ListItemButton, ListItemText } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SidebarMenuGroup from "./SidebarMenuGroup";

const SidebarNavigation = () => {
  const pathname = usePathname();
  const visibleMenuItems = useVisibleMenuItems();

  return (
    <List sx={{ color: "common.white" }}>
      {visibleMenuItems.map((item) => {
        const hasChildren = !!item.children?.length;

        if (hasChildren) {
          return (
            <SidebarMenuGroup
              key={item.key}
              label={item.label}
              submenuList={item.children}
              pathname={pathname}
            />
          );
        }

        return (
          <ListItemButton
            key={item.key}
            component={Link}
            href={item.href}
            selected={isExactRouteActive(pathname, item.href)}
            sx={{
              borderBottom: "1px solid",
              borderBottomColor: "custom.white10",
              "&.Mui-selected": {
                bgcolor: "primary.main",
              },
              "&.Mui-selected:hover": {
                bgcolor: "primary.dark",
              },
            }}
          >
            <ListItemText primary={item.label} sx={{ whiteSpace: "nowrap" }} />
          </ListItemButton>
        );
      })}
    </List>
  );
};

export default SidebarNavigation;
