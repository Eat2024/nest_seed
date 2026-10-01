import { randomBytes } from 'crypto';
import { AppErrorCode } from '#app/common/errors/app-error-code';
import { OAUTH_LOGOUT_UNCONFIRMED_MESSAGE } from '#app/features/auth/auth.constants';
import { encryptSecret } from '#app/features/auth/helpers/secret-crypto';
import { AuthLogoutService } from './auth-logout.service';

const KEY = randomBytes(32);

const setup = () => {
  const verifier = { verifyToken: jest.fn().mockResolvedValue({ userId: 7 }) };
  const sessions = { revoke: jest.fn() };
  const oauthConfig = { encryptionKey: KEY };
  const oauthClient = { logout: jest.fn().mockResolvedValue(true) };
  const logger = { warn: jest.fn(), error: jest.fn() };
  const service = new AuthLogoutService(
    verifier as never,
    sessions as never,
    oauthConfig as never,
    oauthClient as never,
    logger as never,
  );
  return { service, verifier, sessions, oauthClient };
};

const oauthRecord = (refreshToken: string | null = 'rt-plain') => ({
  source: 'oauth' as const,
  encryptedRefreshToken: refreshToken ? encryptSecret(refreshToken, KEY) : null,
});

describe('AuthLogoutService.logout', () => {
  it('OAuth 來源：先撤本地，再以解密後的 refresh token 呼叫上游 → confirmed', async () => {
    const { service, sessions, oauthClient } = setup();
    sessions.revoke.mockResolvedValue(oauthRecord());

    await expect(service.logout('session-jwt')).resolves.toEqual({
      localLogout: 'completed',
      upstreamLogout: 'confirmed',
    });
    expect(sessions.revoke).toHaveBeenCalledWith(7, 'session-jwt');
    expect(oauthClient.logout).toHaveBeenCalledWith('rt-plain');
  });

  it('OAuth 上游失敗／逾時 → 本地已登出，upstream unconfirmed 並附固定提示', async () => {
    const { service, sessions, oauthClient } = setup();
    sessions.revoke.mockResolvedValue(oauthRecord());
    oauthClient.logout.mockResolvedValue(false);

    await expect(service.logout('session-jwt')).resolves.toEqual({
      localLogout: 'completed',
      upstreamLogout: 'unconfirmed',
      message: OAUTH_LOGOUT_UNCONFIRMED_MESSAGE,
    });
  });

  it('OAuth refresh token 解密失敗（金鑰輪替） → unconfirmed，不打上游', async () => {
    const { service, sessions, oauthClient } = setup();
    sessions.revoke.mockResolvedValue({
      ...oauthRecord(),
      encryptedRefreshToken: 'v1.bad.bad.bad',
    });

    await expect(service.logout('session-jwt')).resolves.toMatchObject({
      upstreamLogout: 'unconfirmed',
    });
    expect(oauthClient.logout).not.toHaveBeenCalled();
  });

  it('開發者登入（DEVMOD）session → not_applicable，不打上游、不記 warn', async () => {
    const { service, sessions, oauthClient } = setup();
    sessions.revoke.mockResolvedValue({
      source: 'dev',
      encryptedRefreshToken: null,
    });

    await expect(service.logout('session-jwt')).resolves.toEqual({
      localLogout: 'completed',
      upstreamLogout: 'not_applicable',
    });
    expect(oauthClient.logout).not.toHaveBeenCalled();
  });

  it('session 未帶 refresh token → 本地已登出、unconfirmed，不打上游', async () => {
    const { service, sessions, oauthClient } = setup();
    sessions.revoke.mockResolvedValue(oauthRecord(null));

    await expect(service.logout('session-jwt')).resolves.toEqual({
      localLogout: 'completed',
      upstreamLogout: 'unconfirmed',
      message: OAUTH_LOGOUT_UNCONFIRMED_MESSAGE,
    });
    expect(oauthClient.logout).not.toHaveBeenCalled();
  });

  it.each([
    ['無 cookie', null, undefined],
    ['JWT 過期／無效', 'bad-jwt', null],
    ['session 已不存在（重複登出）', 'session-jwt', { userId: 7 }],
  ])('%s → not_attempted，不宣稱上游完成', async (_label, token, verified) => {
    const { service, verifier, sessions, oauthClient } = setup();
    if (verified !== undefined)
      verifier.verifyToken.mockResolvedValue(verified);
    sessions.revoke.mockResolvedValue(null);

    await expect(service.logout(token)).resolves.toEqual({
      localLogout: 'completed',
      upstreamLogout: 'not_attempted',
    });
    expect(oauthClient.logout).not.toHaveBeenCalled();
  });

  it('Redis 撤銷失敗 → 503 AUTH_SESSION_UNAVAILABLE，不打上游', async () => {
    const { service, sessions, oauthClient } = setup();
    sessions.revoke.mockRejectedValue(new Error('synthetic redis down'));

    await expect(service.logout('session-jwt')).rejects.toMatchObject({
      code: AppErrorCode.AUTH_SESSION_UNAVAILABLE,
    });
    expect(oauthClient.logout).not.toHaveBeenCalled();
  });
});
