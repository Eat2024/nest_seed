import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { AuditableEntity } from '#app/infrastructure/database/auditable.entity';

/** auth_cks_group — 權限分組（層級第一層）。 */
@Entity({ name: 'auth_cks_group', comment: '權限分組（層級第一層）' })
export class AuthCksGroup extends AuditableEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', comment: '流水號' })
  id!: number;

  @Index('uq_auth_cks_group_group_key', { unique: true })
  @Column({
    name: 'group_key',
    type: 'varchar',
    length: 100,
    comment: '分組鍵，例 centralKitchenAcceptance',
  })
  groupKey!: string;

  @Column({
    name: 'group_name',
    type: 'varchar',
    length: 100,
    comment: '分組名稱，例 央廚驗收',
  })
  groupName!: string;

  @Column({
    name: 'sort_order',
    type: 'int',
    nullable: true,
    comment: '顯示排序',
  })
  sortOrder?: number;

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
    comment: '啟用',
  })
  isActive!: boolean;
}
