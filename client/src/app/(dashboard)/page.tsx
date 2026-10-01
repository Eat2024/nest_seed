"use client";

import Flex from "@/components/ui/Flex";
import useVisibleMenuItems from "@/hooks/useVisibleMenuItems";
import { Card, CardContent, Typography } from "@mui/material";

const HomePage = () => {
  const visibleMenuItems = useVisibleMenuItems();
  const hasNoAccessibleMenu = visibleMenuItems.length === 0;

  return (
    <Flex
      sx={{ flex: 1, justifyContent: "center", alignItems: "center", p: 4 }}
    >
      <Card sx={{ minWidth: 0 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 4 }}>
            您好
          </Typography>
          <Typography variant="body2">
            {hasNoAccessibleMenu
              ? "目前您沒有權限操作這個系統，請洽相關單位"
              : "請從左側選單進入所需的項目"}
          </Typography>
        </CardContent>
      </Card>
    </Flex>
  );
};

export default HomePage;
