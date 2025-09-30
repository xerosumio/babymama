import mongoose, { Schema, Document } from 'mongoose'
import { Product as IProduct, ProductVariant } from '@/lib/types'

const ProductVariantSchema = new Schema({
  name: {
    en: { type: String, required: true },
    'zh-HK': { type: String, required: true },
  },
  sku: { type: String, required: true },
  price: { type: Number, required: true },
  compareAtPrice: Number,
  costPrice: { type: Number, required: true },
  inventory: { type: Number, default: 0 },
  weight: { type: Number, default: 0 },
  attributes: { type: Map, of: String },
  isActive: { type: Boolean, default: true },
}, { _id: true })

const ProductSchema = new Schema({
  name: {
    en: { type: String, required: true },
    'zh-HK': { type: String, required: true },
  },
  description: {
    en: { type: String, required: true },
    'zh-HK': { type: String, required: true },
  },
  slug: { type: String, required: true, unique: true },
  sku: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  compareAtPrice: Number,
  costPrice: { type: Number, required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  merchantId: { type: Schema.Types.ObjectId, ref: 'Merchant', required: true },
  images: [String],
  variants: [ProductVariantSchema],
  tags: [String],
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected', 'active', 'inactive'],
    default: 'pending'
  },
  isActive: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false },
  reviewNotes: String, // Admin审核备注
  reviewedAt: Date, // 审核时间
  reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' }, // 审核人
  weight: { type: Number, default: 0 },
  dimensions: {
    length: { type: Number, default: 0 },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
  },
  seoTitle: {
    en: String,
    'zh-HK': String,
  },
  seoDescription: {
    en: String,
    'zh-HK': String,
  },
}, {
  timestamps: true,
})

ProductSchema.index({ categoryId: 1, isActive: 1 })
ProductSchema.index({ merchantId: 1, isActive: 1 })
ProductSchema.index({ isFeatured: 1, isActive: 1 })
ProductSchema.index({ isNew: 1, isActive: 1 })
ProductSchema.index({ status: 1, isActive: 1 })
ProductSchema.index({ merchantId: 1, status: 1 })
ProductSchema.index({ name: 'text', description: 'text' })

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema)
