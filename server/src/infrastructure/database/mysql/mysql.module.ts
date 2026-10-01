// mysql.module.ts
import { Module } from '@nestjs/common';
import { DataSource, type EntityTarget } from 'typeorm';
import { AuditSubscriber } from '#app/infrastructure/database/audit.subscriber';
import { MysqlLifecycleService } from './mysql-lifecycle.service';
import { AuditLogTarget } from '#app/features/auth/entities/audit-log-target.entity';
import { AuditLog } from '#app/features/auth/entities/audit-log.entity';
import { AuthApiPermission } from '#app/features/auth/entities/auth-api-permission.entity';
import { AuthApi } from '#app/features/auth/entities/auth-api.entity';
import { AuthGroup } from '#app/features/auth/entities/auth-group.entity';
import { AuthGroupJob } from '#app/features/auth/entities/auth-group-job.entity';
import { AuthJobPermission } from '#app/features/auth/entities/auth-job-permission.entity';
import { AuthRolePermission } from '#app/features/auth/entities/auth-role-permission.entity';
import { AuthRole } from '#app/features/auth/entities/auth-role.entity';
import { AuthUser } from '#app/features/auth/entities/auth-user.entity';
import { MysqlEntityService } from './mysql.entity.service';
import { MysqlProvider } from './mysql.provider';
import { MysqlService } from './mysql.service';
import { MYSQL_MAIN } from './mysql.tokens';

// [注入 token, entity]；新增 entity 時於此註冊，並加進 mysql.options.ts 的 entities。
// token 明示，須與 MysqlEntityService 的 @Inject 字串一致。
// 注意 AuditLog 有意用 'AuditLogTypeOrmRepository'，與 domain 層的 AuditLogRepository
// class 區隔——此處提供的是 raw TypeORM Repository。
const MYSQL_REPOSITORIES: ReadonlyArray<[string, EntityTarget<object>]> = [
  ['AuditLogTypeOrmRepository', AuditLog],
  ['AuditLogTargetRepository', AuditLogTarget],
  ['AuthApiRepository', AuthApi],
  ['AuthApiPermissionRepository', AuthApiPermission],
  ['AuthGroupRepository', AuthGroup],
  ['AuthGroupJobRepository', AuthGroupJob],
  ['AuthJobPermissionRepository', AuthJobPermission],
  ['AuthRoleRepository', AuthRole],
  ['AuthRolePermissionRepository', AuthRolePermission],
  ['AuthUserRepository', AuthUser],
];

const repositoryProviders = MYSQL_REPOSITORIES.map(([provide, entity]) => ({
  provide,
  inject: [MYSQL_MAIN],
  useFactory: (ds: DataSource) => ds.getRepository(entity),
}));

@Module({
  providers: [
    MysqlProvider,
    // app.close() 時銷毀連線池；MYSQL_MAIN 本身是普通物件，不會被 Nest 呼叫生命週期
    MysqlLifecycleService,
    MysqlService,
    MysqlEntityService,
    AuditSubscriber,
    ...repositoryProviders,
  ],
  exports: [
    MysqlProvider,
    MysqlService,
    MysqlEntityService,
    ...repositoryProviders,
  ],
})
export class MysqlModule {}
