"use client";

import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const Flex = styled(Box)({
  display: "flex",
  flexFlow: "row nowrap",
}) as typeof Box;

export default Flex;
