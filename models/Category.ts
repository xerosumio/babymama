import mongoose, { Schema, Document } from 'mongoose'
import { Category as ICategory } from '@/lib/types'

const CategorySchema = new Schema({
  name: {
    en: { type: String, required: true },
    'zh-HK': { type: String, required: true },
  },
  slug: { type: String, required: true, unique: true },
  parentId: { type: Schema.Types.ObjectId, ref: 'Category' },
  image: String,
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, {
  timestamps: true,
})

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema)
