import useVisibleMenuItems from "@/hooks/useVisibleMenuItems";
import { isRouteActive } from "@/lib/navigation";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarMiniNavigation = () => {
  const pathname = usePathname();
  const visibleMenuItems = useVisibleMenuItems();

  return (
    <List sx={{ color: "common.white" }}>
      {visibleMenuItems.map((item) => {
        const Icon = item.icon;

        return (
          <ListItemButton
            key={item.key}
            component={Link}
            href={item.href}
            selected={isRouteActive(pathname, item.href)}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              px: 0,
              "&.Mui-selected": {
                bgcolor: "primary.main",
              },
              "&.Mui-selected:hover": {
                bgcolor: "primary.dark",
              },
            }}
          >
            {Icon && (
              <ListItemIcon sx={{ color: "inherit" }}>
                <Icon />
              </ListItemIcon>
            )}
            <ListItemText
              primary={item.label}
              slotProps={{
                primary: {
                  variant: "caption",
                },
              }}
            />
          </ListItemButton>
        );
      })}
    </List>
  );
};

export default SidebarMiniNavigation;
