import VerticalDivider from "@/components/ui/VerticalDivider";
import { ROUTES } from "@/constants/routes";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditIcon from "@mui/icons-material/Edit";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import { IconButton } from "@mui/material";
import { useRouter } from "next/navigation";

type Props = {
  roleId: number;
};

const RoleManagementToolbar = ({ roleId }: Props) => {
  const router = useRouter();

  return (
    <>
      <IconButton onClick={() => router.push(ROUTES.createRoleManagement.href)}>
        <AddIcon sx={{ color: "text.primary" }} />
      </IconButton>
      <VerticalDivider />
      <IconButton onClick={() => router.push(ROUTES.sortRoleManagement.href)}>
        <ImportExportIcon sx={{ color: "text.primary" }} />
      </IconButton>
      <IconButton onClick={() => router.push(ROUTES.sortRoleManagement.href)}>
        <DeleteOutlineOutlinedIcon sx={{ color: "text.primary" }} />
      </IconButton>
      <IconButton
        onClick={() =>
          router.push(`${ROUTES.editRoleManagement.href}?roleId=${roleId}`)
        }
      >
        <EditIcon sx={{ color: "text.primary" }} />
      </IconButton>
    </>
  );
};

export default RoleManagementToolbar;
