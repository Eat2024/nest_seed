// mysql.module.ts
import { Module } from '@nestjs/common';
import { DataSource, type EntityTarget } from 'typeorm';
import { AuditSubscriber } from '#app/infrastructure/database/audit.subscriber';
import { MysqlLifecycleService } from './mysql-lifecycle.service';
import { MysqlProvider } from './mysql.provider';
import { MysqlService } from './mysql.service';
import { MYSQL_MAIN } from './mysql.tokens';

// [注入 token, entity]；新增 entity 時於此註冊，並加進 mysql.options.ts 的 entities。
// 例：['UserRepository', User]，使用端以 @Inject('UserRepository') 取得 raw TypeORM Repository。
const MYSQL_REPOSITORIES: ReadonlyArray<[string, EntityTarget<object>]> = [];

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
    AuditSubscriber,
    ...repositoryProviders,
  ],
  exports: [MysqlProvider, MysqlService, ...repositoryProviders],
})
export class MysqlModule {}
