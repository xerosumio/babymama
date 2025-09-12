import React, { useState } from 'react'
import { useTranslation } from 'next-i18next'

const Newsletter: React.FC = () => {
  const { t } = useTranslation('common')
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email)
    setEmail('')
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t('newsletter.title')}
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            {t('newsletter.description')}
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('newsletter.placeholder')}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-baby-500 focus:border-transparent"
              required
            />
            <button
              type="submit"
              className="bg-baby-500 text-white px-6 py-3 rounded-lg hover:bg-baby-600 transition-colors font-medium"
            >
              {t('newsletter.button')}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Newsletter

