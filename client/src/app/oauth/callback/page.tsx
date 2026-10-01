"use client";

import { oauthCallback } from "@/api/requests";
import Flex from "@/components/ui/Flex";
import { ROUTES } from "@/constants/routes";
import { useAuthContext } from "@/providers/AuthProvider";
import { getErrorCode } from "@/utils/errorMessage";
import { redirectToUri } from "@/utils/redirectTo";
import { CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

/** 回呼參數不完整時回登入頁帶的錯誤碼（與後端 OAUTH_TRANSACTION_INVALID 同語意）。 */
const INCOMPLETE_CALLBACK_CODE = "OAUTH_TRANSACTION_INVALID";
const UNKNOWN_FAILURE_CODE = "OAUTH_RESPONSE_INVALID";

const loginWithError = (code: string) =>
  `${ROUTES.login.href}?oauthError=${encodeURIComponent(code)}`;

/**
 * 統一登入回呼頁（註冊的 redirect_uri；proxy 對此頁無條件放行）。
 * 只在記憶體擷取 code／state／error，立即以 replaceState 移除網址上的敏感參數，
 * 再同源 POST 後端換取本系統登入 cookie。不寫入任何 storage、不自動重試。
 */
const OauthCallbackPage = () => {
  const router = useRouter();
  const { setUserData } = useAuthContext();
  // React Strict Mode 會把 effect 跑兩次；授權碼一次性，這裡以 ref 確保只送出一次。
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const params = new URLSearchParams(window.location.search);
    const state = params.get("state");
    const code = params.get("code");
    const error = params.get("error");
    const iss = params.get("iss");
    window.history.replaceState(null, "", window.location.pathname);

    if (!state || (!code && !error)) {
      router.replace(loginWithError(INCOMPLETE_CALLBACK_CODE));
      return;
    }

    oauthCallback({
      state,
      code: code ?? undefined,
      error: error ?? undefined,
      iss: iss ?? undefined,
    })
      .then(({ session, redirectTo }) => {
        setUserData(session);
        router.replace(redirectToUri(redirectTo));
      })
      .catch((err: unknown) => {
        router.replace(loginWithError(getErrorCode(err) ?? UNKNOWN_FAILURE_CODE));
      });
  }, [router, setUserData]);

  return (
    <Flex
      sx={{
        minHeight: "100vh",
        flexFlow: "column nowrap",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
      }}
    >
      <CircularProgress />
      <Typography variant="body1">統一登入處理中，請稍候…</Typography>
    </Flex>
  );
};

export default OauthCallbackPage;
