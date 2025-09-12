import mongoose, { Schema, Document } from 'mongoose'
import { Order as IOrder, OrderItem } from '@/lib/types'

const OrderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  merchantId: { type: Schema.Types.ObjectId, ref: 'Merchant', required: true },
  variantId: { type: Schema.Types.ObjectId, ref: 'ProductVariant' },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
}, { _id: true })

const OrderSchema = new Schema({
  orderNumber: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending',
  },
  items: [OrderItemSchema],
  shippingAddress: {
    type: Schema.Types.ObjectId,
    ref: 'Address',
    required: true,
  },
  billingAddress: {
    type: Schema.Types.ObjectId,
    ref: 'Address',
    required: true,
  },
  subtotal: { type: Number, required: true },
  shippingCost: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
  currency: { type: String, enum: ['HKD', 'USD'], default: 'HKD' },
  paymentMethod: { type: String, required: true },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  paymentId: String,
  shippingMethod: { type: String, required: true },
  trackingNumber: String,
  carrier: String,
  notes: String,
}, {
  timestamps: true,
})

OrderSchema.index({ userId: 1, createdAt: -1 })
OrderSchema.index({ orderNumber: 1 })
OrderSchema.index({ status: 1 })

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema)
