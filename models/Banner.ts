import mongoose, { Schema, Document } from 'mongoose'
import { Banner as IBanner } from '@/lib/types'

const BannerSchema = new Schema({
  title: {
    en: { type: String, required: true },
    'zh-HK': { type: String, required: true },
  },
  subtitle: {
    en: String,
    'zh-HK': String,
  },
  image: { type: String, required: true },
  link: String,
  buttonText: {
    en: String,
    'zh-HK': String,
  },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
  startDate: Date,
  endDate: Date,
}, {
  timestamps: true,
})

BannerSchema.index({ isActive: 1, sortOrder: 1 })

export default mongoose.models.Banner || mongoose.model<IBanner>('Banner', BannerSchema)
