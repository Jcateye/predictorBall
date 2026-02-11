import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { HydratedDocument } from 'mongoose'
import type { PersistedOrder } from '../storage.types'

@Schema({ collection: 'orders', versionKey: false })
export class OrderEntity implements PersistedOrder {
  @Prop({ required: true, unique: true, index: true })
  id!: string

  @Prop({ required: true, unique: true, index: true })
  orderNo!: string

  @Prop({ required: true, index: true })
  userId!: string

  @Prop({ required: true, index: true })
  reportId!: string

  @Prop({ required: true })
  amount!: number

  @Prop({ required: true, enum: ['pending', 'paid', 'failed', 'refunded'], index: true })
  status!: 'pending' | 'paid' | 'failed' | 'refunded'

  @Prop({ required: true })
  createdAt!: string

  @Prop({ type: [String], default: [] })
  paymentEventIds!: string[]
}

export type OrderDocument = HydratedDocument<OrderEntity>
export const OrderSchema = SchemaFactory.createForClass(OrderEntity)

OrderSchema.index({ userId: 1, reportId: 1 })
