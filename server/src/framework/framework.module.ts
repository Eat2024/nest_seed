import { Module } from '@nestjs/common';
import { RequestIdClsModule } from '#app/infrastructure/logging/requestId/request-id.module';
import { ExceptionHandler } from './filters/exception.handler';
import { HttpAccessLogInterceptor } from './interceptors/http-access-log.interceptor';

// CLS（每請求 context）由 RequestIdClsModule 提供：request id、來源 IP / UA（稽核用），
// AuditSubscriber 亦由此讀登入者 ID 自動填 created_by/updated_by。
@Module({
  imports: [RequestIdClsModule],
  providers: [HttpAccessLogInterceptor, ExceptionHandler],
  exports: [HttpAccessLogInterceptor, ExceptionHandler],
})
export class FrameworkModule {}
