import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { HydratedDocument } from 'mongoose'
import type { PersistedLiveEvent } from '../storage.types'

@Schema({ collection: 'live_events', versionKey: false })
export class LiveEventEntity implements PersistedLiveEvent {
  @Prop({ required: true, unique: true, index: true })
  id!: string

  @Prop({ required: true, index: true })
  matchId!: string

  @Prop({ required: true, index: true })
  minute!: number

  @Prop({
    required: true,
    enum: ['goal', 'yellow_card', 'red_card', 'substitution', 'var'],
  })
  type!: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'var'

  @Prop({ required: true, enum: ['home', 'away'] })
  team!: 'home' | 'away'

  @Prop({ required: true })
  player!: string

  @Prop({ required: true })
  detail!: string

  @Prop({ required: true, index: true })
  createdAt!: string
}

export type LiveEventDocument = HydratedDocument<LiveEventEntity>
export const LiveEventSchema = SchemaFactory.createForClass(LiveEventEntity)

LiveEventSchema.index({ matchId: 1, minute: 1, createdAt: 1 })
