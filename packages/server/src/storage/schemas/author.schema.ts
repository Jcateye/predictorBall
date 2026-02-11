import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { HydratedDocument } from 'mongoose'
import type { PersistedAuthor } from '../storage.types'

@Schema({ collection: 'authors', versionKey: false })
export class AuthorEntity implements PersistedAuthor {
  @Prop({ required: true, unique: true, index: true })
  id!: string

  @Prop({ required: true, index: true })
  nickname!: string

  @Prop({ required: true, enum: ['platform', 'expert', 'ai', 'user'], index: true })
  type!: 'platform' | 'expert' | 'ai' | 'user'

  @Prop({ type: [String], default: [] })
  tags!: string[]

  @Prop({ type: Object, required: true })
  hitRate7d!: {
    hit: number
    total: number
  }

  @Prop({ type: Object, required: true })
  hitRate30d!: {
    hit: number
    total: number
  }

  @Prop({ required: true, default: 0 })
  totalReports!: number

  @Prop()
  streakBest?: number
}

export type AuthorDocument = HydratedDocument<AuthorEntity>
export const AuthorSchema = SchemaFactory.createForClass(AuthorEntity)
