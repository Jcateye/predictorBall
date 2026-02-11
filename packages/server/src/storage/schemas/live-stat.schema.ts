import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { HydratedDocument } from 'mongoose'
import type { PersistedLiveStat } from '../storage.types'

@Schema({ collection: 'live_stats', versionKey: false })
export class LiveStatEntity implements PersistedLiveStat {
  @Prop({ required: true, unique: true, index: true })
  matchId!: string

  @Prop({ required: true })
  possessionHome!: number

  @Prop({ required: true })
  possessionAway!: number

  @Prop({ required: true })
  shotsHome!: number

  @Prop({ required: true })
  shotsAway!: number

  @Prop({ required: true })
  cornersHome!: number

  @Prop({ required: true })
  cornersAway!: number

  @Prop({ required: true })
  foulsHome!: number

  @Prop({ required: true })
  foulsAway!: number

  @Prop({ required: true, index: true })
  updatedAt!: string
}

export type LiveStatDocument = HydratedDocument<LiveStatEntity>
export const LiveStatSchema = SchemaFactory.createForClass(LiveStatEntity)
