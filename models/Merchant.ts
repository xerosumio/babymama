import mongoose, { Schema, Document } from 'mongoose'

const ShippingRuleSchema = new Schema({
  name: { type: String, required: true },
  minValue: { type: Number, required: true },
  maxValue: Number,
  cost: { type: Number, required: true },
  freeShippingThreshold: Number,
  regions: [String],
}, { _id: true })

const ShippingTemplateSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['weight', 'price', 'item'], required: true },
  rules: [ShippingRuleSchema],
  isDefault: { type: Boolean, default: false },
}, { _id: true })

const MerchantSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: {
    en: { type: String, required: true },
    'zh-HK': { type: String, required: true },
  },
  logo: String,
  banner: String,
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  isActive: { type: Boolean, default: false },
  status: { 
    type: String, 
    enum: ['pending', 'active', 'suspended', 'inactive'], 
    default: 'pending' 
  },
  businessType: { 
    type: String, 
    enum: ['individual', 'company'], 
    default: 'individual' 
  },
  contactPerson: { type: String, required: true },
  businessLicense: String,
  taxId: String,
  commissionRate: { type: Number, required: true },
  payoutAccount: {
    type: { type: String, enum: ['bank', 'paypal', 'stripe'], default: 'bank' },
    accountId: { type: String, default: '' },
    accountName: { type: String, default: '' },
  },
  shippingTemplates: [ShippingTemplateSchema],
}, {
  timestamps: true,
})

MerchantSchema.index({ email: 1 })
MerchantSchema.index({ slug: 1 })
MerchantSchema.index({ isActive: 1 })

export default mongoose.models.Merchant || mongoose.model('Merchant', MerchantSchema)