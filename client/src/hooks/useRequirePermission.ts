import { JobKey, PermissionAction } from "@/api/types";
import { ROUTES } from "@/constants/routes";
import { useDialogContext } from "@/providers/DialogProvider";
import { usePermissionContext } from "@/providers/PermissionProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const useRequirePermission = (
  jobKey: JobKey,
  ...actions: PermissionAction[]
) => {
  const router = useRouter();
  const { hasPermission } = usePermissionContext();
  const { openDialog, closeDialog } = useDialogContext();

  const hasAccess = hasPermission(jobKey, ...actions);

  useEffect(() => {
    if (!hasAccess) {
      openDialog({
        title: "權限不足",
        content: "您的權限無法執行此操作，請聯絡系統管理員。",
        status: "warning",
        actions: [
          {
            label: "確定",
            onClick: () => {
              closeDialog();
              router.push(ROUTES.home.href);
            },
          },
        ],
      });
    }
  }, [hasAccess, openDialog, closeDialog, router]);

  return { hasAccess };
};

export default useRequirePermission;
