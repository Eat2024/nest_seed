"use client";

import { ROUTE_LABEL_MAP } from "@/constants/routes";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

const getBreadcrumbItems = (pathname: string) => {
  const paths = pathname.split("/").filter(Boolean);

  return [
    {
      label: ROUTE_LABEL_MAP["/"] ?? "首頁",
      href: "/",
    },
    ...paths.map((_, index) => {
      const href = "/" + paths.slice(0, index + 1).join("/");

      return {
        label: ROUTE_LABEL_MAP[href] ?? href,
        href,
      };
    }),
  ];
};

const PageBreadcrumbs = () => {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbItems(pathname);

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      sx={{ fontSize: 14, minWidth: "200px" }}
    >
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;

        if (isLast)
          return (
            <Typography key={item.href} variant="body2" color="textPrimary">
              {item.label}
            </Typography>
          );

        return (
          <Link
            key={item.href}
            component={NextLink}
            href={item.href}
            underline="hover"
            color="inherit"
          >
            {item.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default PageBreadcrumbs;
