import mongoose, { Schema, Document } from 'mongoose'

const AddressSchema = new Schema({
  type: { type: String, enum: ['shipping', 'billing', 'both'], required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  company: String,
  address1: { type: String, required: true },
  address2: String,
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
}, { _id: true })

const PaymentMethodSchema = new Schema({
  type: { 
    type: String, 
    enum: ['credit_card', 'debit_card', 'paypal', 'alipay', 'wechat_pay'], 
    required: true 
  },
  cardNumber: { type: String, required: true },
  expiryMonth: { type: String, required: true },
  expiryYear: { type: String, required: true },
  cardholderName: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { _id: true })

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  language: { type: String, enum: ['en', 'zh-HK'], default: 'en' },
  currency: { type: String, enum: ['HKD', 'USD', 'CNY'], default: 'HKD' },
  addresses: [AddressSchema],
  paymentMethods: [PaymentMethodSchema],
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
})

export default mongoose.models.User || mongoose.model('User', UserSchema)