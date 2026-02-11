import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { HydratedDocument } from 'mongoose'
import type { PersistedEntitlement } from '../storage.types'

@Schema({ collection: 'entitlements', versionKey: false })
export class EntitlementEntity implements PersistedEntitlement {
  @Prop({ required: true, unique: true, index: true })
  id!: string

  @Prop({ required: true, index: true })
  userId!: string

  @Prop({ required: true, index: true })
  reportId!: string

  @Prop({ required: true, index: true })
  grantedAt!: string
}

export type EntitlementDocument = HydratedDocument<EntitlementEntity>
export const EntitlementSchema = SchemaFactory.createForClass(EntitlementEntity)

EntitlementSchema.index({ userId: 1, reportId: 1 }, { unique: true })
