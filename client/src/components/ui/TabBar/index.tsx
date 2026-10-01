"use client";

import { Tab, Tabs, TabsProps } from "@mui/material";
import Flex from "../Flex";
import VerticalDivider from "../VerticalDivider";
import DeleteTabsMenu from "./DeleteTabsMenu";
import EditTabsMenu from "./EditTabsMenu";
import TabLabel from "./TabLabel";
import { EditTabItem, TabItem } from "./types";
import VisibilityTabsMenu from "./VisibilityTabsMenu";

export type { EditTabItem, TabItem } from "./types";

interface Props extends Pick<TabsProps, "value" | "onChange"> {
  tabs: TabItem[];
  // tab 文字的水平對齊。MUI Tab 有 minWidth（90px），文字比按鈕短時
  // 預設會置中；left 讓文字貼左、關閉鈕「x」仍貼右。
  tabAlign?: "left" | "center";
  // 顯示控制選單（optional，預設不啟用）：同時提供 hiddenTabs 與
  // onHiddenTabsChange 即啟用右側工具列（編輯/刪除/顯示頁籤選單）與 tab 上的「x」，
  // 「x」＝隱藏該 tab，可從「顯示頁籤」選單重新勾選顯示。
  // 注意：隱藏「目前選中的 tab」時，選中值的調整由使用端負責。
  hiddenTabs?: (number | string)[];
  onHiddenTabsChange?: (hidden: (number | string)[]) => void;
  // 刪除頁籤（optional）：「刪除頁籤」選單勾選、確認 dialog 後回傳選中的
  // tab values，實際的刪除（API 呼叫）由使用端實作
  onDeleteTabs?: (values: (number | string)[]) => void;
  // 是否顯示「刪除頁籤」選單（預設顯示）：使用端可依權限關閉
  showDeleteMenu?: boolean;
  // 編輯頁籤（optional）：「編輯頁籤」選單中改名、拖曳排序後按「確定」，
  // 回傳編輯後的名稱與順序，實際的更新（API 呼叫）由使用端實作
  onEditTabs?: (items: EditTabItem[]) => void;
}

const TabBar = ({
  tabs,
  value,
  onChange,
  tabAlign = "center",
  hiddenTabs,
  onHiddenTabsChange,
  onDeleteTabs,
  onEditTabs,
  showDeleteMenu = true,
}: Props) => {
  // 沒有任何 tab 時選單沒有內容可控制，右側工具列一併隱藏
  const visibilityEnabled =
    hiddenTabs != null && onHiddenTabsChange != null && tabs.length > 0;
  const visibleTabs = visibilityEnabled
    ? tabs.filter((tab) => !hiddenTabs.includes(tab.value))
    : tabs;

  const handleToggleTabVisibility = (tabValue: number | string) => {
    if (!visibilityEnabled) return;

    onHiddenTabsChange(
      hiddenTabs.includes(tabValue)
        ? hiddenTabs.filter((hidden) => hidden !== tabValue)
        : [...hiddenTabs, tabValue],
    );
  };

  // 全選＝顯示全部（清空隱藏清單）；取消全選＝隱藏全部
  const handleToggleAllTabsVisibility = (selectAll: boolean) => {
    if (!visibilityEnabled) return;

    onHiddenTabsChange(selectAll ? [] : tabs.map((tab) => tab.value));
  };

  return (
    <Flex
      sx={{
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        minWidth: 0,
      }}
    >
      <Flex sx={{ flex: 1, minWidth: 0, overflowX: "auto" }}>
        <Tabs
          variant="scrollable"
          scrollButtons={false}
          value={value}
          onChange={onChange}
        >
          {visibleTabs.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              disabled={tab.disabled}
              sx={
                tabAlign === "left"
                  ? { alignItems: "flex-start", textAlign: "left" }
                  : undefined
              }
              label={
                <TabLabel
                  tab={tab}
                  tabAlign={tabAlign}
                  onClose={
                    visibilityEnabled
                      ? () => handleToggleTabVisibility(tab.value)
                      : undefined
                  }
                />
              }
            />
          ))}
        </Tabs>
      </Flex>

      {/* 右側工具列：編輯/刪除/顯示控制選單 */}
      {visibilityEnabled && (
        // gap 對齊 DataGrid Toolbar 的間距規格（gap = spacing(0.25)，本專案 spacing 基準 4px → 1px
        <Flex sx={{ alignItems: "center", alignSelf: "stretch", gap: "1px" }}>
          <VerticalDivider />
          <EditTabsMenu tabs={tabs} onConfirm={onEditTabs} />
          {showDeleteMenu && (
            <DeleteTabsMenu tabs={tabs} onConfirm={onDeleteTabs} />
          )}
          <VerticalDivider />
          <VisibilityTabsMenu
            tabs={tabs}
            hiddenTabs={hiddenTabs}
            onToggle={handleToggleTabVisibility}
            onToggleAll={handleToggleAllTabsVisibility}
          />
        </Flex>
      )}
    </Flex>
  );
};

export default TabBar;
