"use client";

import { ROUTES } from "@/constants/routes";
import AddIcon from "@mui/icons-material/Add";
import BlockIcon from "@mui/icons-material/Block";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";
import SearchIcon from "@mui/icons-material/Search";
import VerticalDivider from "@/components/ui/VerticalDivider";
import {
  IconButton,
  InputAdornment,
  styled,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  QuickFilter,
  QuickFilterClear,
  QuickFilterControl,
  QuickFilterTrigger,
  Toolbar,
  ToolbarButton,
} from "@mui/x-data-grid";
import { useRouter } from "next/navigation";

declare module "@mui/x-data-grid" {
  interface ToolbarPropsOverrides {
    onCheck: () => void;
    onBlock: () => void;
    hasSelection: boolean;
  }
}

type Props = {
  onCheck: () => void;
  onBlock: () => void;
  hasSelection: boolean;
};

type OwnerState = {
  expanded: boolean;
};

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  backgroundColor: theme.palette.custom?.background,
  paddingTop: 0,
  paddingBottom: 0,
}));

const StyledQuickFilter = styled(QuickFilter)({
  display: "grid",
  alignItems: "center",
});

const StyledToolbarButton = styled(ToolbarButton)<{ ownerState: OwnerState }>(
  ({ theme, ownerState }) => ({
    gridArea: "1 / 1",
    width: "min-content",
    height: "min-content",
    zIndex: 1,
    opacity: ownerState.expanded ? 0 : 1,
    pointerEvents: ownerState.expanded ? "none" : "auto",
    transition: theme.transitions.create(["opacity"]),
  }),
);

const StyledTextField = styled(TextField)<{ ownerState: OwnerState }>(
  ({ theme, ownerState }) => ({
    gridArea: "1 / 1",
    overflowX: "clip",
    width: ownerState.expanded ? 260 : "var(--trigger-width)",
    opacity: ownerState.expanded ? 1 : 0,
    transition: theme.transitions.create(["width", "opacity"]),
  }),
);

const AccountManagementToolbar = ({
  onCheck,
  onBlock,
  hasSelection,
}: Props) => {
  const router = useRouter();

  return (
    <StyledToolbar>
      <Tooltip title="加入">
        <IconButton
          onClick={() => router.push(ROUTES.createAccountManagement.href)}
        >
          <AddIcon sx={{ color: "text.primary" }} />
        </IconButton>
      </Tooltip>

      <VerticalDivider />

      <Tooltip title="啟用">
        {/* Tooltip 需要在子元素上綁定 onMouseEnter/onFocus 等事件來判斷何時該顯示提示文字。 */}
        {/* 但瀏覽器規範中，disabled 的原生元素（像 <button disabled>）不會觸發任何滑鼠事件， 所以 Tooltip 綁定的事件監聽器完全失效，導致滑鼠移上去也不會顯示提示。 */}
        {/* MUI 官方建議在 disabled 的子元素外面包一層不會被 disabled 的 span，讓 Tooltip 的事件監聽器綁在 span 上而不是按鈕本身。 */}
        <span>
          <IconButton onClick={onCheck} disabled={!hasSelection}>
            <CheckIcon
              sx={{ color: hasSelection ? "text.primary" : "text.disabled" }}
            />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="停用">
        <span>
          <IconButton onClick={onBlock} disabled={!hasSelection}>
            <BlockIcon
              sx={{ color: hasSelection ? "text.primary" : "text.disabled" }}
            />
          </IconButton>
        </span>
      </Tooltip>

      <VerticalDivider />

      <StyledQuickFilter>
        <QuickFilterTrigger
          render={(triggerProps, state) => (
            <Tooltip title="搜尋" enterDelay={0}>
              <StyledToolbarButton
                {...triggerProps}
                ownerState={{ expanded: state.expanded }}
                color="default"
                aria-disabled={state.expanded}
              >
                <SearchIcon sx={{ color: "text.primary" }} />
              </StyledToolbarButton>
            </Tooltip>
          )}
        />
        <QuickFilterControl
          render={({ ref, ...controlProps }, state) => (
            <StyledTextField
              {...controlProps}
              ownerState={{ expanded: state.expanded }}
              inputRef={ref}
              aria-label="Search"
              placeholder="輸入姓名搜尋"
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: state.value ? (
                    <InputAdornment position="end">
                      <QuickFilterClear
                        edge="end"
                        size="small"
                        aria-label="Clear search"
                        material={{ sx: { marginRight: -0.75 } }}
                      >
                        <CancelIcon fontSize="small" />
                      </QuickFilterClear>
                    </InputAdornment>
                  ) : null,
                  ...controlProps.slotProps?.input,
                },
                ...controlProps.slotProps,
              }}
            />
          )}
        />
      </StyledQuickFilter>
    </StyledToolbar>
  );
};

export default AccountManagementToolbar;
