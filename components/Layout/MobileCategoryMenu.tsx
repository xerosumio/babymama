import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { ChevronDown, ChevronRight, X } from 'lucide-react'

interface SubCategory {
  id: string
  name: { en: string; 'zh-HK': string }
  slug: string
  href: string
}

interface Category {
  id: string
  name: { en: string; 'zh-HK': string }
  slug: string
  href: string
  subCategories: SubCategory[]
}

interface MobileCategoryMenuProps {
  isOpen: boolean
  onClose: () => void
}

const MobileCategoryMenu: React.FC<MobileCategoryMenuProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const categories: Category[] = [
    {
      id: 'feeding',
      name: { en: 'Feeding', 'zh-HK': '餵食' },
      slug: 'feeding',
      href: '/category/feeding',
      subCategories: [
        { id: 'bottles', name: { en: 'Bottles & Nipples', 'zh-HK': '奶瓶與奶嘴' }, slug: 'bottles', href: '/category/feeding%2Fbottles' },
        { id: 'formula', name: { en: 'Baby Formula', 'zh-HK': '嬰兒配方奶粉' }, slug: 'formula', href: '/category/feeding%2Fformula' },
        { id: 'high-chairs', name: { en: 'High Chairs', 'zh-HK': '高腳椅' }, slug: 'high-chairs', href: '/category/feeding%2Fhigh-chairs' },
        { id: 'bibs', name: { en: 'Bibs & Burp Cloths', 'zh-HK': '圍兜與拍嗝巾' }, slug: 'bibs', href: '/category/feeding%2Fbibs' },
        { id: 'breastfeeding', name: { en: 'Breastfeeding', 'zh-HK': '母乳餵養' }, slug: 'breastfeeding', href: '/category/feeding%2Fbreastfeeding' }
      ]
    },
    {
      id: 'diapers-wipes',
      name: { en: 'Diapers & Wipes', 'zh-HK': '尿布與濕巾' },
      slug: 'diapers-wipes',
      href: '/category/diapers-wipes',
      subCategories: [
        { id: 'diapers', name: { en: 'Diapers', 'zh-HK': '尿布' }, slug: 'diapers', href: '/category/diapers-wipes%2Fdiapers' },
        { id: 'wipes', name: { en: 'Baby Wipes', 'zh-HK': '嬰兒濕巾' }, slug: 'wipes', href: '/category/diapers-wipes%2Fwipes' },
        { id: 'changing', name: { en: 'Changing Mats', 'zh-HK': '換尿布墊' }, slug: 'changing', href: '/category/diapers-wipes%2Fchanging' },
        { id: 'potty-training', name: { en: 'Potty Training', 'zh-HK': '如廁訓練' }, slug: 'potty-training', href: '/category/diapers-wipes%2Fpotty-training' }
      ]
    },
    {
      id: 'baby-care',
      name: { en: 'Baby Care', 'zh-HK': '嬰兒護理' },
      slug: 'baby-care',
      href: '/category/baby-care',
      subCategories: [
        { id: 'skincare', name: { en: 'Skincare', 'zh-HK': '護膚用品' }, slug: 'skincare', href: '/category/baby-care%2Fskincare' },
        { id: 'bath', name: { en: 'Bath & Grooming', 'zh-HK': '沐浴與護理' }, slug: 'bath', href: '/category/baby-care%2Fbath' },
        { id: 'health', name: { en: 'Health & Safety', 'zh-HK': '健康與安全' }, slug: 'health', href: '/category/baby-care%2Fhealth' },
        { id: 'monitors', name: { en: 'Baby Monitors', 'zh-HK': '嬰兒監視器' }, slug: 'monitors', href: '/category/baby-care%2Fmonitors' }
      ]
    },
    {
      id: 'clothing',
      name: { en: 'Clothing', 'zh-HK': '服裝' },
      slug: 'clothing',
      href: '/category/clothing',
      subCategories: [
        { id: 'bodysuits', name: { en: 'Bodysuits & Onesies', 'zh-HK': '連體衣' }, slug: 'bodysuits', href: '/category/clothing%2Fbodysuits' },
        { id: 'sleepwear', name: { en: 'Sleepwear', 'zh-HK': '睡衣' }, slug: 'sleepwear', href: '/category/clothing%2Fsleepwear' },
        { id: 'outerwear', name: { en: 'Outerwear', 'zh-HK': '外套' }, slug: 'outerwear', href: '/category/clothing%2Fouterwear' },
        { id: 'accessories', name: { en: 'Clothing Accessories', 'zh-HK': '服裝配件' }, slug: 'accessories', href: '/category/clothing%2Faccessories' }
      ]
    },
    {
      id: 'toys',
      name: { en: 'Toys', 'zh-HK': '玩具' },
      slug: 'toys',
      href: '/category/toys',
      subCategories: [
        { id: 'educational', name: { en: 'Educational Toys', 'zh-HK': '教育玩具' }, slug: 'educational', href: '/category/toys%2Feducational' },
        { id: 'soft-toys', name: { en: 'Soft Toys', 'zh-HK': '毛絨玩具' }, slug: 'soft-toys', href: '/category/toys%2Fsoft-toys' },
        { id: 'activity', name: { en: 'Activity Centers', 'zh-HK': '活動中心' }, slug: 'activity', href: '/category/toys%2Factivity' },
        { id: 'outdoor', name: { en: 'Outdoor Toys', 'zh-HK': '戶外玩具' }, slug: 'outdoor', href: '/category/toys%2Foutdoor' }
      ]
    },
    {
      id: 'gear-travel',
      name: { en: 'Gear & Travel', 'zh-HK': '用品與旅行' },
      slug: 'gear-travel',
      href: '/category/gear-travel',
      subCategories: [
        { id: 'strollers', name: { en: 'Strollers', 'zh-HK': '嬰兒推車' }, slug: 'strollers', href: '/category/gear-travel%2Fstrollers' },
        { id: 'car-seats', name: { en: 'Car Seats', 'zh-HK': '汽車安全座椅' }, slug: 'car-seats', href: '/category/gear-travel%2Fcar-seats' },
        { id: 'carriers', name: { en: 'Baby Carriers', 'zh-HK': '嬰兒背帶' }, slug: 'carriers', href: '/category/gear-travel%2Fcarriers' },
        { id: 'travel', name: { en: 'Travel Accessories', 'zh-HK': '旅行配件' }, slug: 'travel', href: '/category/gear-travel%2Ftravel' }
      ]
    },
    {
      id: 'maternity',
      name: { en: 'Maternity', 'zh-HK': '孕婦用品' },
      slug: 'maternity',
      href: '/category/maternity',
      subCategories: [
        { id: 'clothing', name: { en: 'Maternity Clothing', 'zh-HK': '孕婦服裝' }, slug: 'clothing', href: '/category/maternity%2Fclothing' },
        { id: 'pillows', name: { en: 'Maternity Pillows', 'zh-HK': '孕婦枕' }, slug: 'pillows', href: '/category/maternity%2Fpillows' },
        { id: 'health', name: { en: 'Prenatal Health', 'zh-HK': '產前健康' }, slug: 'health', href: '/category/maternity%2Fhealth' },
        { id: 'nursing', name: { en: 'Nursing Bras', 'zh-HK': '哺乳內衣' }, slug: 'nursing', href: '/category/maternity%2Fnursing' }
      ]
    }
  ]

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Menu */}
      <div className="relative bg-white h-full w-80 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {t('navigation.allCategories')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories */}
        <div className="p-4">
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id}>
                <div className="flex items-center justify-between">
                  <Link
                    href={category.href}
                    className="flex-1 py-3 text-gray-700 hover:text-baby-600 transition-colors"
                    onClick={onClose}
                  >
                    {category.name[router.locale as 'en' | 'zh-HK']}
                  </Link>
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    {expandedCategory === category.id ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                </div>
                
                {expandedCategory === category.id && (
                  <div className="ml-4 space-y-1 border-l border-gray-200 pl-4">
                    {category.subCategories.map((subCategory) => (
                      <Link
                        key={subCategory.id}
                        href={subCategory.href}
                        className="block py-2 text-sm text-gray-600 hover:text-baby-600 transition-colors"
                        onClick={onClose}
                      >
                        {subCategory.name[router.locale as 'en' | 'zh-HK']}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileCategoryMenu
