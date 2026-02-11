import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { HydratedDocument } from 'mongoose'
import type { PersistedMatch } from '../storage.types'

@Schema({ collection: 'matches', versionKey: false })
export class MatchEntity implements PersistedMatch {
  @Prop({ required: true, unique: true, index: true })
  id!: string

  @Prop({ required: true, index: true })
  kickoffAt!: string

  @Prop({ required: true, enum: ['scheduled', 'live', 'finished', 'postponed'], index: true })
  status!: 'scheduled' | 'live' | 'finished' | 'postponed'

  @Prop({ required: true, index: true })
  stage!: string

  @Prop({ index: true })
  groupCode?: string

  @Prop({ type: Object, required: true })
  homeTeam!: {
    id: string
    name: string
    shortName: string
  }

  @Prop({ type: Object, required: true })
  awayTeam!: {
    id: string
    name: string
    shortName: string
  }

  @Prop({ required: true, default: 0 })
  homeScore!: number

  @Prop({ required: true, default: 0 })
  awayScore!: number

  @Prop()
  minute?: number

  @Prop({ required: true, index: true })
  competitionId!: string
}

export type MatchDocument = HydratedDocument<MatchEntity>
export const MatchSchema = SchemaFactory.createForClass(MatchEntity)

MatchSchema.index({ kickoffAt: 1, status: 1, stage: 1, groupCode: 1 })
