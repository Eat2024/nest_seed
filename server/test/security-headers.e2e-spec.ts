// security-headers.e2e-spec.ts
// 034 US4 — SEC-05（security/SECURITY_REPORT.md）。
// 期望安全行為：一般 API 回應帶 nosniff + X-Frame-Options（降低 MIME sniffing 與點擊劫持，
// 亦放大 SEC-01 的防護）。
import request from 'supertest';
import {
  createSecurityE2eApp,
  closeSecurityE2eApp,
  seedSecurityRbac,
  issueSession,
  resetSecurityFixtures,
  type SecurityE2eContext,
  type SecurityIdentities,
} from './security-e2e.helper';

describe('SEC-05 HTTP 安全標頭 (US4)', () => {
  let ctx: SecurityE2eContext;
  let ids: SecurityIdentities;
  let adminCookie: string;

  beforeAll(async () => {
    ctx = await createSecurityE2eApp();
    ids = await seedSecurityRbac(ctx);
    adminCookie = await issueSession(ctx, ids.adminUserId);
  });

  afterAll(async () => {
    await resetSecurityFixtures(ctx);
    await closeSecurityE2eApp(ctx);
  });

  it('C-05a：API 回應含 nosniff + X-Frame-Options: DENY', async () => {
    const res = await request(ctx.server)
      .get('/api/roles')
      .set('Cookie', adminCookie)
      .expect(200);
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-frame-options']).toBe('DENY');
  });

  it('C-05a：未授權回應同樣帶安全標頭', async () => {
    const res = await request(ctx.server).get('/api/roles').expect(401);
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-frame-options']).toBe('DENY');
  });
});
