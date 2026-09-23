import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ClsMiddleware, ClsModule } from 'nestjs-cls';
import { ExceptionHandler } from './filters/exception.handler';

// CLS（每請求 context）：AuditSubscriber 由此讀登入者 ID 自動填 created_by/updated_by。
// 手動用 NestJS 11 的 named wildcard 掛 middleware，避免舊式 `*` 警告。
@Module({
  imports: [ClsModule.forRoot({ global: true, middleware: { mount: false } })],
  providers: [ExceptionHandler],
  exports: [ExceptionHandler],
})
export class FrameworkModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(ClsMiddleware).forRoutes('{*path}');
  }
}
