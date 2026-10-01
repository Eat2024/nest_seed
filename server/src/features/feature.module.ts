import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';

// 新 feature module 於此註冊。
@Module({
  imports: [AuthModule, HealthModule],
  exports: [AuthModule, HealthModule],
})
export class FeatureModule {}
