// mysql.options.ts
// 連線設定單一事實來源：app provider 與 migration CLI 共用，避免兩邊漂移。
// Nest runtime 由 provider 傳入 ConfigService 讀取器；CLI/seed 直接 import 時才 fallback 到 process.env。
import { join } from 'path';
import type { DataSourceOptions } from 'typeorm';
import { AuditLogTarget } from '#app/features/auth/entities/audit-log-target.entity';
import { AuditLog } from '#app/features/auth/entities/audit-log.entity';
import { AuthApiPermission } from '#app/features/auth/entities/auth-api-permission.entity';
import { AuthApi } from '#app/features/auth/entities/auth-api.entity';
import { AuthCksGroup } from '#app/features/auth/entities/auth-cks-group.entity';
import { AuthGroupJob } from '#app/features/auth/entities/auth-group-job.entity';
import { AuthJobPermission } from '#app/features/auth/entities/auth-job-permission.entity';
import { AuthRolePermission } from '#app/features/auth/entities/auth-role-permission.entity';
import { AuthRole } from '#app/features/auth/entities/auth-role.entity';
import { AuthUser } from '#app/features/auth/entities/auth-user.entity';

export type EnvReader = (key: string) => string | undefined;

const processEnvReader: EnvReader = (key: string): string | undefined =>
  process.env[key];

const env = (readEnv: EnvReader, key: string, fallback: string): string =>
  readEnv(key) ?? fallback;

/**
 * TLS 設定（Aurora require_secure_transport=ON 環境必須）：
 *   - DB_MYSQL_SSL_CA_B64：base64 的 CA bundle PEM（RDS 用
 *     https://truststore.pki.rds.amazonaws.com/<region>/<region>-bundle.pem；
 *     mysql2 內建 'Amazon RDS' profile 不含 ap-east-2 等新 region，故自帶 CA）。
 *   - DB_MYSQL_SSL=true：啟用 TLS 走系統 CA。
 *   - DB_MYSQL_SSL=skip-verify：啟用 TLS 但不驗憑證（僅限無法取得 CA 的過渡期）。
 *   - 皆未設定：不啟用（本機 dev/test 現況）。
 */
function buildSslOptions(
  readEnv: EnvReader,
): { ca: string } | { rejectUnauthorized: false } | object | undefined {
  const caB64 = env(readEnv, 'DB_MYSQL_SSL_CA_B64', '');
  if (caB64) return { ca: Buffer.from(caB64, 'base64').toString('utf8') };
  const mode = env(readEnv, 'DB_MYSQL_SSL', '');
  if (mode === 'skip-verify') return { rejectUnauthorized: false };
  if (mode === 'true' || mode === '1') return {};
  return undefined;
}

export function buildMysqlOptions(
  readEnv: EnvReader = processEnvReader,
): DataSourceOptions {
  const ssl = buildSslOptions(readEnv);
  return {
    ...(ssl ? { ssl } : {}),
    type: 'mysql',
    host: env(readEnv, 'DB_MYSQL_HOST', '127.0.0.1'),
    port: Number(env(readEnv, 'DB_MYSQL_PORT', '3306')),
    username: env(readEnv, 'DB_MYSQL_USER', 'root'),
    password: env(readEnv, 'DB_MYSQL_PASS', ''),
    database: env(readEnv, 'DB_MYSQL_DB', 'nest_seed'),

    // 一律以 migration 管理 schema（憲章技術約束）；prod 絕不開 synchronize。
    synchronize: false,
    logging: false,
    charset: 'utf8mb4',

    // 明確註冊 entities，避免 glob 掃描範圍不清楚，也和 runtime/migration CLI 共用同一份設定。
    entities: [
      AuditLog,
      AuditLogTarget,
      AuthApi,
      AuthApiPermission,
      AuthCksGroup,
      AuthGroupJob,
      AuthJobPermission,
      AuthRole,
      AuthRolePermission,
      AuthUser,
    ],
    migrations: [join(__dirname, '..', 'migrations', '*.{ts,js}')],

    extra: {
      connectionLimit: Number(env(readEnv, 'DB_MYSQL_POOL_MAX', '10')),
      supportBigNumbers: true,
      bigNumberStrings: false,
      timezone: '+00:00',
    },
  };
}
