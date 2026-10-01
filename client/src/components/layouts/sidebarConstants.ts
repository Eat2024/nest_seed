// 側邊選單展開/收合的寬度與狀態 key，抽出來給 Sidebar 以外
// 需要對齊側邊選單寬度的元件（例如 BottomActionBar）共用，避免各自硬編數字。
export const SIDEBAR_WIDTH_OPEN = 240;
// 收合時的寬度是 theme.spacing(SIDEBAR_SPACING_CLOSED)，需搭配 theme 使用
export const SIDEBAR_SPACING_CLOSED = 14;
// useSessionStorageState 的 key，Sidebar 與需要同步側邊選單展開狀態的元件都應使用同一把 key
export const SIDEBAR_OPEN_STORAGE_KEY = "sidebar.open";
