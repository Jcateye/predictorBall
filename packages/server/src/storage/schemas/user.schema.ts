import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { HydratedDocument } from 'mongoose'
import type { PersistedUser } from '../storage.types'

@Schema({ collection: 'users', versionKey: false })
export class UserEntity implements PersistedUser {
  @Prop({ required: true, unique: true, index: true })
  id!: string

  @Prop({ required: true, index: true })
  nickname!: string

  @Prop({ required: true, enum: ['guest', 'user', 'admin'], index: true })
  role!: 'guest' | 'user' | 'admin'
}

export type UserDocument = HydratedDocument<UserEntity>
export const UserSchema = SchemaFactory.createForClass(UserEntity)
