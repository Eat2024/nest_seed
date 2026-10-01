"use client";

import { Box, BoxProps } from "@mui/material";

interface Props extends BoxProps {
  edge?: "top" | "bottom";
  offset?: number | string;
}

const StickyBox = ({
  edge = "top",
  offset = 0,
  sx,
  children,
  ...rest
}: Props) => (
  <Box
    sx={[
      {
        position: "sticky",
        zIndex: (theme) => theme.zIndex.appBar,
        [edge]: offset,
      },
      ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
    ]}
    {...rest}
  >
    {children}
  </Box>
);

export default StickyBox;
