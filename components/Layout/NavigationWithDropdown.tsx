import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { ChevronDown } from 'lucide-react'

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

const NavigationWithDropdown: React.FC = () => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

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

  return (
    <div className="hidden lg:flex items-center space-x-6">
      {categories.map((category) => (
        <div
          key={category.id}
          className="relative"
          onMouseEnter={() => setHoveredCategory(category.id)}
          onMouseLeave={() => setHoveredCategory(null)}
        >
          <Link
            href={category.href}
            className="flex items-center space-x-1 text-gray-700 hover:text-baby-600 transition-colors py-2"
          >
            <span>{category.name[router.locale as 'en' | 'zh-HK']}</span>
            <ChevronDown className="w-4 h-4" />
          </Link>

          {/* Dropdown Menu */}
          {hoveredCategory === category.id && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">
                  {category.name[router.locale as 'en' | 'zh-HK']}
                </h3>
                <div className="space-y-2">
                  {category.subCategories.map((subCategory) => (
                    <Link
                      key={subCategory.id}
                      href={subCategory.href}
                      className="block px-3 py-2 text-sm text-gray-600 hover:bg-baby-50 hover:text-baby-600 rounded-md transition-colors"
                    >
                      {subCategory.name[router.locale as 'en' | 'zh-HK']}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default NavigationWithDropdown
