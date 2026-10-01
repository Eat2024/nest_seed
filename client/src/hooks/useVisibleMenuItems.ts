import { PermissionAction } from "@/api/types";
import { MenuItem, menuItems } from "@/constants/menu";
import { usePermissionContext } from "@/providers/PermissionProvider";

// 依權限過濾選單：有子選單的項目只保留使用者有 VIEW 權限的子選項，
// 子選項全部被過濾掉時該群組也一併移除；沒有子選單的項目維持原樣顯示。
const useVisibleMenuItems = (): MenuItem[] => {
  const { hasPermission } = usePermissionContext();

  return menuItems.reduce<MenuItem[]>((visibleItems, item) => {
    if (!item.children?.length) {
      visibleItems.push(item);
      return visibleItems;
    }

    const visibleChildren = item.children.filter((child) =>
      hasPermission(child.jobKey, PermissionAction.VIEW),
    );

    if (visibleChildren.length > 0) {
      visibleItems.push({ ...item, children: visibleChildren });
    }

    return visibleItems;
  }, []);
};

export default useVisibleMenuItems;
