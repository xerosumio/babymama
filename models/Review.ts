import mongoose, { Schema, Document } from 'mongoose'
import { Review as IReview } from '@/lib/types'

const ReviewSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true },
  comment: { type: String, required: true },
  images: [String],
  isVerified: { type: Boolean, default: false },
  helpful: { type: Number, default: 0 },
}, {
  timestamps: true,
})

ReviewSchema.index({ productId: 1, createdAt: -1 })
ReviewSchema.index({ userId: 1, productId: 1 })

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema)
