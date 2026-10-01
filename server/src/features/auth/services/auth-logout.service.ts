import { HttpStatus, Injectable } from '@nestjs/common';
import { AppException } from '#app/common/errors/app.exception';
import { AppErrorCode } from '#app/common/errors/app-error-code';
import {
  OAUTH_LOGOUT_UNCONFIRMED_MESSAGE,
  SESSION_SOURCE,
  UPSTREAM_LOGOUT,
  type UpstreamLogoutStatus,
} from '#app/features/auth/auth.constants';
import { decryptSecret } from '#app/features/auth/helpers/secret-crypto';
import { OauthClient } from '#app/infrastructure/http-client/oauth/oauth.client';
import { OauthConfig } from '#app/infrastructure/http-client/oauth/oauth.config';
import { AppLoggerService } from '#app/infrastructure/logging/appLog/app-logger.service';
import {
  AuthSessionService,
  type AuthSessionRecord,
} from './auth-session.service';
import { AuthSessionVerifierService } from './auth-session-verifier.service';

/** 登出回應（contracts/http.md §6）。 */
export interface LogoutResult {
  localLogout: 'completed';
  upstreamLogout: UpstreamLogoutStatus;
  message?: string;
}

/**
 * 主動登出（US4／FR-013）：先原子撤銷本地 session，再對統一登入做一次有界的上游登出
 * （開發者登入沒有上游，回 not_applicable）。
 * - 本地撤銷失敗 → 503 AUTH_SESSION_UNAVAILABLE（不得只清 cookie 就宣稱憑證失效）。
 * - 無有效 session（過期、重複登出、無 cookie）→ not_attempted，不假稱上游已完成。
 * - 上游失敗／逾時／解密失敗 → unconfirmed，本地仍已登出；不重試、不排程補償。
 */
@Injectable()
export class AuthLogoutService {
  constructor(
    private readonly verifier: AuthSessionVerifierService,
    private readonly sessions: AuthSessionService,
    private readonly oauthConfig: OauthConfig,
    private readonly oauthClient: OauthClient,
    private readonly logger: AppLoggerService,
  ) {}

  async logout(cookieToken: string | null): Promise<LogoutResult> {
    const identity = cookieToken
      ? await this.verifier.verifyToken(cookieToken)
      : null;
    if (!identity || !cookieToken) return this.notAttempted();

    const record = await this.revokeLocal(identity.userId, cookieToken);
    if (!record) return this.notAttempted();

    // 開發者登入（DEVMOD）沒有上游 session，本地撤銷即完成。
    if (record.source === SESSION_SOURCE.DEV) {
      return {
        localLogout: 'completed',
        upstreamLogout: UPSTREAM_LOGOUT.NOT_APPLICABLE,
      };
    }
    return this.logoutOauth(record, identity.userId);
  }

  private async revokeLocal(
    userId: number,
    token: string,
  ): Promise<AuthSessionRecord | null> {
    try {
      return await this.sessions.revoke(userId, token);
    } catch (error) {
      this.logger.error({
        context: AuthLogoutService.name,
        event: 'auth.logout_revoke_failed',
        message: '本地 session 撤銷失敗',
        metadata: {
          userId,
          reason: error instanceof Error ? error.message : String(error),
        },
      });
      throw new AppException(
        AppErrorCode.AUTH_SESSION_UNAVAILABLE,
        '無法確認登入撤銷，請稍後再試',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  private async logoutOauth(
    record: AuthSessionRecord,
    userId: number,
  ): Promise<LogoutResult> {
    const confirmed = await this.callUpstreamLogout(record, userId);
    return confirmed
      ? { localLogout: 'completed', upstreamLogout: UPSTREAM_LOGOUT.CONFIRMED }
      : {
          localLogout: 'completed',
          upstreamLogout: UPSTREAM_LOGOUT.UNCONFIRMED,
          message: OAUTH_LOGOUT_UNCONFIRMED_MESSAGE,
        };
  }

  /** 解密 refresh token 並呼叫上游 /logout；設定缺失／解密失敗／上游失敗皆為未確認。 */
  private async callUpstreamLogout(
    record: AuthSessionRecord,
    userId: number,
  ): Promise<boolean> {
    try {
      const refreshToken = record.encryptedRefreshToken
        ? decryptSecret(
            record.encryptedRefreshToken,
            this.oauthConfig.encryptionKey,
          )
        : null;
      if (!refreshToken) {
        this.warnUnconfirmed(userId, 'refresh_token_unavailable');
        return false;
      }
      return await this.oauthClient.logout(refreshToken);
    } catch (error) {
      this.warnUnconfirmed(
        userId,
        error instanceof Error ? error.message : String(error),
      );
      return false;
    }
  }

  private warnUnconfirmed(userId: number, reason: string): void {
    this.logger.warn({
      context: AuthLogoutService.name,
      event: 'oauth.logout_unconfirmed',
      message: '統一登入登出未確認（本地已登出）',
      metadata: { userId, reason },
    });
  }

  private notAttempted(): LogoutResult {
    return {
      localLogout: 'completed',
      upstreamLogout: UPSTREAM_LOGOUT.NOT_ATTEMPTED,
    };
  }
}
