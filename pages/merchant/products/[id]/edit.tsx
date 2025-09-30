import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useMerchant } from '@/contexts/MerchantContext'
import MerchantLayout from '@/components/Merchant/Layout/MerchantLayout'
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Plus,
  Minus
} from 'lucide-react'

interface Category {
  _id: string
  name: {
    en: string
    'zh-HK': string
  }
  slug: string
  parentId?: string
  children?: Category[]
}

interface ProductFormData {
  name: string
  description: string
  price: string
  comparePrice: string
  category: string
  subCategory: string
  inventory: string
  lowStockThreshold: string
  images: string[]
  status: 'draft' | 'pending' | 'active' | 'inactive'
  featured: boolean
}

export default function EditProduct() {
  const router = useRouter()
  const { id } = router.query
  const { merchant, isAuthenticated, isLoading } = useMerchant()
  const [categories, setCategories] = useState<Category[]>([])
  const [subCategories, setSubCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [product, setProduct] = useState<any>(null)
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    comparePrice: '',
    category: '',
    subCategory: '',
    inventory: '',
    lowStockThreshold: '10',
    images: [],
    status: 'draft',
    featured: false
  })

  // 加载分类数据和产品数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 加载分类数据
        const categoriesResponse = await fetch('/api/categories')
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json()
          setCategories(categoriesData)
        }

        // 加载产品数据
        if (id) {
          const token = localStorage.getItem('merchant_token')
          if (token) {
            const productResponse = await fetch(`/api/merchant/products/${id}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            })
            
            if (productResponse.ok) {
              const productData = await productResponse.json()
              setProduct(productData)
              
              // 填充表单数据
              setFormData({
                name: productData.name?.en || '',
                description: productData.description?.en || '',
                price: productData.price?.toString() || '',
                comparePrice: productData.compareAtPrice?.toString() || '',
                category: productData.categoryId?._id || '',
                subCategory: '',
                inventory: productData.variants?.[0]?.inventory?.toString() || '0',
                lowStockThreshold: '10',
                images: productData.images || [],
                status: productData.status || 'draft',
                featured: productData.isFeatured || false
              })

              // 设置子分类
              if (productData.categoryId?._id) {
                const subs = categories.filter(cat => cat.parentId === productData.categoryId._id)
                setSubCategories(subs)
              }
            } else {
              alert('Product not found')
              router.push('/merchant/products')
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    // 检查localStorage中是否有merchant数据，如果有就加载数据
    const token = localStorage.getItem('merchant_token')
    const data = localStorage.getItem('merchant_data')
    
    if (token && data) {
      fetchData()
    } else if (!isLoading && !isAuthenticated) {
      // 如果没有认证数据且不在加载中，则重定向到登录页面
      router.push('/merchant/auth/login')
    }
  }, [id, isAuthenticated, isLoading, router])

  useEffect(() => {
    // 等待认证检查完成
    if (!isLoading && !isAuthenticated) {
      // 检查localStorage中是否有merchant数据
      const token = localStorage.getItem('merchant_token')
      const data = localStorage.getItem('merchant_data')
      
      if (!token || !data) {
        router.push('/merchant/auth/login')
      }
    }
  }, [isAuthenticated, isLoading, router])

  // 构建分类树结构
  const buildCategoryTree = (categories: Category[]) => {
    const categoryMap = new Map()
    const rootCategories: Category[] = []

    categories.forEach(category => {
      categoryMap.set(category._id, { ...category, children: [] })
    })

    categories.forEach(category => {
      if (category.parentId) {
        const parent = categoryMap.get(category.parentId)
        if (parent) {
          parent.children.push(categoryMap.get(category._id))
        }
      } else {
        rootCategories.push(categoryMap.get(category._id))
      }
    })

    return rootCategories
  }

  // 处理分类选择
  const handleCategoryChange = (categoryId: string) => {
    const selectedCategory = categories.find(cat => cat._id === categoryId)
    const subs = selectedCategory ? categories.filter(cat => cat.parentId === categoryId) : []
    
    setSubCategories(subs)
    setFormData(prev => ({
      ...prev,
      category: categoryId,
      subCategory: '' // 重置子分类选择
    }))
  }

  const handleInputChange = (field: keyof ProductFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file))
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }))
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // 准备产品数据
      const productData = {
        name: {
          en: formData.name,
          'zh-HK': formData.name // 暂时使用英文名称
        },
        description: {
          en: formData.description,
          'zh-HK': formData.description // 暂时使用英文描述
        },
        price: parseFloat(formData.price),
        compareAtPrice: formData.comparePrice ? parseFloat(formData.comparePrice) : undefined,
        costPrice: parseFloat(formData.price) * 0.7, // 假设成本价为售价的70%
        categoryId: formData.category,
        merchantId: merchant?._id,
        images: formData.images,
        status: formData.status,
        isActive: formData.status === 'active',
        isFeatured: formData.featured,
        isNew: false, // 编辑的产品不是新品
        // 更新默认变体，包含库存信息
        variants: [{
          name: {
            en: 'Default',
            'zh-HK': '默认'
          },
          sku: product?.sku || `PROD-${Date.now()}`,
          price: parseFloat(formData.price),
          compareAtPrice: formData.comparePrice ? parseFloat(formData.comparePrice) : undefined,
          costPrice: parseFloat(formData.price) * 0.7,
          inventory: parseInt(formData.inventory) || 0,
          weight: 0,
          isActive: true
        }]
      }

      // 调用API更新产品
      const token = localStorage.getItem('merchant_token')
      const response = await fetch(`/api/merchant/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      })

      if (response.ok) {
        alert('Product updated successfully!')
        // 重定向到产品列表
        router.push('/merchant/products')
      } else {
        const errorData = await response.json()
        alert(`Failed to update product: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Failed to update product. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !merchant) {
    return null
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Product not found</p>
          <button
            onClick={() => router.push('/merchant/products')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  const categoryTree = buildCategoryTree(categories)

  return (
    <MerchantLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
              <p className="text-sm text-gray-600">Update product information</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price (HK$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="price"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="comparePrice" className="block text-sm font-medium text-gray-700">
                    Compare Price (HK$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="comparePrice"
                    value={formData.comparePrice}
                    onChange={(e) => handleInputChange('comparePrice', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label htmlFor="inventory" className="block text-sm font-medium text-gray-700">
                    Inventory Quantity *
                  </label>
                  <input
                    type="number"
                    id="inventory"
                    value={formData.inventory}
                    onChange={(e) => handleInputChange('inventory', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter product description"
                />
              </div>
            </div>
          </div>

          {/* Category Selection */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Category & Classification</h3>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Main Category *
                  </label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Select a category</option>
                    {categoryTree.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name.en} ({category.name['zh-HK']})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700">
                    Sub Category
                  </label>
                  <select
                    id="subCategory"
                    value={formData.subCategory}
                    onChange={(e) => handleInputChange('subCategory', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    disabled={subCategories.length === 0}
                  >
                    <option value="">Select a subcategory</option>
                    {subCategories.map(subCategory => (
                      <option key={subCategory._id} value={subCategory._id}>
                        {subCategory.name.en} ({subCategory.name['zh-HK']})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Product Images</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Images
                  </label>
                  <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload files</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>

                {/* Image Preview */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Product Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="lowStockThreshold" className="block text-sm font-medium text-gray-700">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    id="lowStockThreshold"
                    value={formData.lowStockThreshold}
                    onChange={(e) => handleInputChange('lowStockThreshold', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="10"
                  />
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <input
                      id="featured"
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => handleInputChange('featured', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                      Featured Product
                    </label>
                  </div>

                  <div className="flex items-center">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mr-2">
                      Status:
                    </label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="draft">Draft (Save for later)</option>
                      <option value="pending">Submit for Review</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2 inline" />
                  Update Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </MerchantLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  }
}
