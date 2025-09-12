import React from 'react'
import { useTranslation } from 'next-i18next'
import { Truck, Heart } from 'lucide-react'

const TrustInfo: React.FC = () => {
  const { t } = useTranslation('common')

  return (
    <section className="py-8 border-t border-gray-200">
      <div className="container">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
          <div className="flex items-center space-x-3">
            <Truck className="w-6 h-6 text-baby-500" />
            <span className="text-gray-700 font-medium">
              {t('trustInfo.delivery')}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Heart className="w-6 h-6 text-baby-500" />
            <span className="text-gray-700 font-medium">
              {t('trustInfo.trusted')}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TrustInfo

