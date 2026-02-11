import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { HydratedDocument } from 'mongoose'
import type { PersistedFollow } from '../storage.types'

@Schema({ collection: 'follows', versionKey: false })
export class FollowEntity implements PersistedFollow {
  @Prop({ required: true, unique: true, index: true })
  id!: string

  @Prop({ required: true, index: true })
  userId!: string

  @Prop({ required: true, index: true })
  targetId!: string

  @Prop({ required: true, enum: ['author', 'team', 'match'], index: true })
  targetType!: 'author' | 'team' | 'match'

  @Prop()
  targetName?: string

  @Prop({ required: true, index: true })
  createdAt!: string
}

export type FollowDocument = HydratedDocument<FollowEntity>
export const FollowSchema = SchemaFactory.createForClass(FollowEntity)

FollowSchema.index({ userId: 1, targetType: 1, targetId: 1 }, { unique: true })
