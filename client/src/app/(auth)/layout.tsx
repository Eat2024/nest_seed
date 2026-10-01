"use client";

import Flex from "@/components/ui/Flex";
import { Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import Image from "next/image";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const AuthLayout = ({ children }: Props) => {
  return (
    <Flex
      sx={{
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundImage: "url(/login-bg.svg)",
        backgroundSize: "cover",
        p: 8,
      }}
    >
      <Flex
        sx={{
          flexFlow: "column nowrap",
          alignItems: "center",
          width: 360,
          bgcolor: "common.white",
          borderRadius: 3,
          boxShadow: 3,
          px: 5,
          py: 12,
        }}
      >
        <Image src="/logo.svg" alt="logo" width={64} height={64} />
        <Typography
          variant="h6"
          sx={(theme) => ({
            mb: 4,
            fontWeight: theme.typography.fontWeightBold,
          })}
        >
          Nest Seed
        </Typography>

        {children}

        <Typography variant="caption" sx={{ color: grey[600] }}>
          © 2026 饗賓餐旅事業股份有限公司
        </Typography>
      </Flex>
    </Flex>
  );
};

export default AuthLayout;
