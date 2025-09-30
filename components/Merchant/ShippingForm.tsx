import React, { useState } from 'react'
import { Save, X, Truck, Package } from 'lucide-react'

interface ShippingFormProps {
  order: {
    _id: string
    orderNumber: string
    status: string
    trackingNumber?: string
    carrier?: string
    notes?: string
  }
  onSave: (data: { trackingNumber: string; carrier: string; status: string; notes?: string }) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export default function ShippingForm({ order, onSave, onCancel, loading = false }: ShippingFormProps) {
  const [formData, setFormData] = useState({
    trackingNumber: order.trackingNumber || '',
    carrier: order.carrier || '',
    status: order.status || 'pending',
    notes: order.notes || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSave(formData)
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Truck className="h-5 w-5 mr-2" />
          Update Shipping Information
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="trackingNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Tracking Number *
            </label>
            <input
              type="text"
              id="trackingNumber"
              value={formData.trackingNumber}
              onChange={(e) => handleChange('trackingNumber', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter tracking number"
              required
            />
          </div>

          <div>
            <label htmlFor="carrier" className="block text-sm font-medium text-gray-700 mb-1">
              Carrier *
            </label>
            <select
              id="carrier"
              value={formData.carrier}
              onChange={(e) => handleChange('carrier', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select carrier</option>
              <option value="SF Express">SF Express</option>
              <option value="DHL">DHL</option>
              <option value="FedEx">FedEx</option>
              <option value="UPS">UPS</option>
              <option value="Hong Kong Post">Hong Kong Post</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Order Status
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Add any special instructions or notes..."
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Shipping Info
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
