import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { HydratedDocument } from 'mongoose'
import type { PersistedReport } from '../storage.types'

@Schema({ collection: 'reports', versionKey: false })
export class ReportEntity implements PersistedReport {
  @Prop({ required: true, unique: true, index: true })
  id!: string

  @Prop({ required: true, index: true })
  matchId!: string

  @Prop({ required: true, index: true })
  authorId!: string

  @Prop({ required: true, enum: ['platform', 'expert', 'ai', 'user'], index: true })
  authorType!: 'platform' | 'expert' | 'ai' | 'user'

  @Prop({ required: true })
  title!: string

  @Prop({ required: true, enum: ['pre_match', 'live_update', 'in_play', 'review'], index: true })
  type!: 'pre_match' | 'live_update' | 'in_play' | 'review'

  @Prop({ required: true, enum: ['free', 'paid'], index: true })
  priceType!: 'free' | 'paid'

  @Prop({ required: true })
  price!: number

  @Prop({ required: true, type: [String] })
  summary!: string[]

  @Prop({ required: true, type: [String] })
  lockedOutline!: string[]

  @Prop({ type: Object })
  lockedContent?: {
    conclusion: string
    confidence: 'high' | 'medium' | 'low'
    keyVariables: string[]
    riskReversal: string[]
  }

  @Prop({ required: true, enum: ['public', 'paid'] })
  visibility!: 'public' | 'paid'

  @Prop({ required: true, default: 0, index: true })
  unlockCount!: number

  @Prop({ required: true, index: true })
  updatedAt!: string

  @Prop({ required: true, index: true })
  publishedAt!: string

  @Prop({ required: true, default: 0, index: true })
  score!: number

  @Prop({ required: true, default: false })
  isAiGenerated!: boolean
}

export type ReportDocument = HydratedDocument<ReportEntity>
export const ReportSchema = SchemaFactory.createForClass(ReportEntity)

ReportSchema.index({ matchId: 1, publishedAt: -1, authorType: 1, priceType: 1 })
ReportSchema.index({ type: 1, priceType: 1, score: -1 })
