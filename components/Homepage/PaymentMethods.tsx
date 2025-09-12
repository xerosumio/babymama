import React from 'react'
import { useTranslation } from 'next-i18next'

const PaymentMethods: React.FC = () => {
  const { t } = useTranslation('common')

  const paymentMethods = [
    { name: 'Visa', logo: 'VISA' },
    { name: 'Mastercard', logo: 'mastercard' },
    { name: 'American Express', logo: 'AMEX' },
    { name: 'PayPal', logo: 'PayPal' },
    { name: 'Alipay', logo: 'Alipay' },
    { name: 'WeChat Pay', logo: 'WeChat Pay' }
  ]

  return (
    <section className="py-8 border-t border-gray-200">
      <div className="container">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('paymentMethods.title')}
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-6">
            {paymentMethods.map((method, index) => (
              <div
                key={index}
                className="flex items-center justify-center w-24 h-12 bg-gray-100 rounded-lg px-3"
              >
                <span className="text-sm font-medium text-gray-700">
                  {method.logo}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default PaymentMethods

