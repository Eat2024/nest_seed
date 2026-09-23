import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';

// 新 feature module 於此註冊。
@Module({
  imports: [HealthModule],
})
export class FeatureModule {}
