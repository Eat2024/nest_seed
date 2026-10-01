import { Box } from "@mui/material";
import { grey } from "@mui/material/colors";
import PageBreadcrumbs from "./PageBreadcrumbs";
import UserProfile from "./UserProfile";

const AppHeader = () => {
  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "56px",
        bgcolor: "common.white",
        borderBottom: "1px solid",
        borderBottomColor: grey[300],
        pl: 6,
        pr: 4,
      }}
    >
      <PageBreadcrumbs />
      <UserProfile />
    </Box>
  );
};

export default AppHeader;
