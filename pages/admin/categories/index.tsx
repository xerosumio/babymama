import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useAdmin } from '@/contexts/AdminContext'
import AdminLayout from '@/components/Admin/Layout/AdminLayout'
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  Image as ImageIcon,
  ArrowUpDown,
  Settings
} from 'lucide-react'

interface Category {
  _id: string
  name: {
    en: string
    'zh-HK': string
  }
  slug: string
  parentId?: string
  image?: string
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
  children?: Category[]
}

const mockCategories: Category[] = [
  {
    _id: '1',
    name: { en: 'Feeding', 'zh-HK': '餵養用品' },
    slug: 'feeding',
    isActive: true,
    sortOrder: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    children: [
      {
        _id: '11',
        name: { en: 'Bottles & Nipples', 'zh-HK': '奶瓶奶嘴' },
        slug: 'feeding/bottles',
        parentId: '1',
        isActive: true,
        sortOrder: 1,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        children: [
          {
            _id: '111',
            name: { en: 'Glass Bottles', 'zh-HK': '玻璃奶瓶' },
            slug: 'feeding/bottles/glass',
            parentId: '11',
            isActive: true,
            sortOrder: 1,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          },
          {
            _id: '112',
            name: { en: 'Plastic Bottles', 'zh-HK': '塑膠奶瓶' },
            slug: 'feeding/bottles/plastic',
            parentId: '11',
            isActive: true,
            sortOrder: 2,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          }
        ]
      },
      {
        _id: '12',
        name: { en: 'Baby Formula', 'zh-HK': '嬰兒奶粉' },
        slug: 'feeding/formula',
        parentId: '1',
        isActive: true,
        sortOrder: 2,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ]
  },
  {
    _id: '2',
    name: { en: 'Diapers & Wipes', 'zh-HK': '尿布濕巾' },
    slug: 'diapers-wipes',
    isActive: true,
    sortOrder: 2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    children: [
      {
        _id: '21',
        name: { en: 'Diapers', 'zh-HK': '尿布' },
        slug: 'diapers-wipes/diapers',
        parentId: '2',
        isActive: true,
        sortOrder: 1,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        _id: '22',
        name: { en: 'Baby Wipes', 'zh-HK': '嬰兒濕巾' },
        slug: 'diapers-wipes/wipes',
        parentId: '2',
        isActive: true,
        sortOrder: 2,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ]
  },
  {
    _id: '3',
    name: { en: 'Baby Care', 'zh-HK': '嬰兒護理' },
    slug: 'baby-care',
    isActive: true,
    sortOrder: 3,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: '4',
    name: { en: 'Clothing', 'zh-HK': '服裝' },
    slug: 'clothing',
    isActive: true,
    sortOrder: 4,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: '5',
    name: { en: 'Toys', 'zh-HK': '玩具' },
    slug: 'toys',
    isActive: true,
    sortOrder: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: '6',
    name: { en: 'Gear & Travel', 'zh-HK': '用品旅行' },
    slug: 'gear-travel',
    isActive: true,
    sortOrder: 6,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: '7',
    name: { en: 'Maternity', 'zh-HK': '孕婦用品' },
    slug: 'maternity',
    isActive: true,
    sortOrder: 7,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
]

export default function CategoriesPage() {
  const router = useRouter()
  const { adminUser, isAuthenticated, isLoading } = useAdmin()
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [parentCategories, setParentCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState({
    nameEn: '',
    nameZh: '',
    slug: '',
    parentId: '',
    sortOrder: 0,
    isActive: true
  })

  // 加载分类数据
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // 使用公共API获取分类数据，因为Admin API需要JWT token
        const response = await fetch('/api/categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
          // 设置父分类选项（只包含一级分类）
          const rootCategories = data.filter((cat: Category) => !cat.parentId)
          setParentCategories(rootCategories)
          // 默认展开前几个分类以显示二级分类
          if (data.length > 0) {
            const rootCategories = data.filter((cat: Category) => !cat.parentId)
            const expandedIds = rootCategories.slice(0, 3).map((cat: Category) => cat._id)
            setExpandedCategories(new Set(expandedIds))
          }
        } else {
          console.error('Failed to fetch categories:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchCategories()
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !adminUser) {
    return null
  }

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        category.name['zh-HK'].toLowerCase().includes(searchTerm.toLowerCase()) ||
                        category.slug.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && category.isActive) ||
                         (statusFilter === 'inactive' && !category.isActive)
    return matchesSearch && matchesStatus
  })

  const handleStatusChange = (categoryId: string, newStatus: boolean) => {
    const updateCategory = (cats: Category[]): Category[] => {
      return cats.map(cat => {
        if (cat._id === categoryId) {
          return { ...cat, isActive: newStatus }
        }
        if (cat.children) {
          return { ...cat, children: updateCategory(cat.children) }
        }
        return cat
      })
    }
    setCategories(updateCategory(categories))
  }

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleSelectAll = () => {
    const getAllCategoryIds = (cats: Category[]): string[] => {
      let ids: string[] = []
      cats.forEach(cat => {
        ids.push(cat._id)
        if (cat.children) {
          ids = [...ids, ...getAllCategoryIds(cat.children)]
        }
      })
      return ids
    }

    const allIds = getAllCategoryIds(filteredCategories)
    setSelectedCategories(
      selectedCategories.length === allIds.length ? [] : allIds
    )
  }

  const toggleExpanded = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
      }
      return newSet
    })
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: {
            en: newCategory.nameEn,
            'zh-HK': newCategory.nameZh
          },
          slug: newCategory.slug,
          parentId: newCategory.parentId || null,
          sortOrder: newCategory.sortOrder,
          isActive: newCategory.isActive
        })
      })

      if (response.ok) {
        // 重新加载分类数据
        const fetchResponse = await fetch('/api/categories')
        if (fetchResponse.ok) {
          const data = await fetchResponse.json()
          setCategories(data)
          const rootCategories = data.filter((cat: Category) => !cat.parentId)
          setParentCategories(rootCategories)
        }
        setShowAddModal(false)
        setNewCategory({
          nameEn: '',
          nameZh: '',
          slug: '',
          parentId: '',
          sortOrder: 0,
          isActive: true
        })
      } else {
        console.error('Failed to create category')
      }
    } catch (error) {
      console.error('Error creating category:', error)
    }
  }

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setNewCategory(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCategory) return

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/categories/${editingCategory._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: {
            en: editingCategory.name.en,
            'zh-HK': editingCategory.name['zh-HK']
          },
          slug: editingCategory.slug,
          parentId: editingCategory.parentId || null,
          sortOrder: editingCategory.sortOrder,
          isActive: editingCategory.isActive
        })
      })

      if (response.ok) {
        // 重新加载分类数据
        const fetchResponse = await fetch('/api/categories')
        if (fetchResponse.ok) {
          const data = await fetchResponse.json()
          setCategories(data)
          const rootCategories = data.filter((cat: Category) => !cat.parentId)
          setParentCategories(rootCategories)
        }
        setEditingCategory(null)
      } else {
        console.error('Failed to update category')
      }
    } catch (error) {
      console.error('Error updating category:', error)
    }
  }

  // 构建分类树结构
  const buildCategoryTree = (categories: Category[]) => {
    const categoryMap = new Map()
    const rootCategories: Category[] = []

    // 创建映射，确保每个分类都有children数组
    categories.forEach(category => {
      categoryMap.set(category._id, { ...category, children: [] })
    })

    // 构建树结构
    categories.forEach(category => {
      // 处理populated的parentId（可能是对象或字符串）
      const parentId = typeof category.parentId === 'object' && category.parentId !== null 
        ? category.parentId._id 
        : category.parentId

      if (parentId) {
        const parent = categoryMap.get(parentId)
        if (parent) {
          parent.children.push(categoryMap.get(category._id))
        }
      } else {
        rootCategories.push(categoryMap.get(category._id))
      }
    })

    // 按sortOrder排序
    const sortCategories = (cats: Category[]) => {
      return cats.sort((a, b) => a.sortOrder - b.sortOrder)
    }

    const sortRecursively = (cats: Category[]) => {
      cats.forEach(cat => {
        if (cat.children && cat.children.length > 0) {
          cat.children = sortCategories(cat.children)
          sortRecursively(cat.children)
        }
      })
      return sortCategories(cats)
    }

    return sortRecursively(rootCategories)
  }

  const renderCategoryTree = (cats: Category[], level = 0) => {
    return cats.map(category => (
      <React.Fragment key={category._id}>
        <tr className={`${level > 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors`}>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category._id)}
                onChange={() => handleSelectCategory(category._id)}
                className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
              />
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <div className="flex items-center" style={{ marginLeft: `${level * 24}px` }}>
                {category.children && category.children.length > 0 ? (
                  <button
                    onClick={() => toggleExpanded(category._id)}
                    className="mr-2 p-1 hover:bg-gray-200 rounded"
                  >
                    {expandedCategories.has(category._id) ? (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                ) : (
                  <div className="w-6 mr-2"></div>
                )}
                {category.children && category.children.length > 0 ? (
                  expandedCategories.has(category._id) ? (
                    <FolderOpen className="h-5 w-5 text-sky-500 mr-2" />
                  ) : (
                    <Folder className="h-5 w-5 text-sky-500 mr-2" />
                  )
                ) : (
                  <div className="w-5 mr-2"></div>
                )}
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {category.name.en}
                    {level > 0 && <span className="ml-2 text-xs text-gray-400">(Level {level + 1})</span>}
                  </div>
                  <div className="text-sm text-gray-500">
                    {category.name['zh-HK']}
                  </div>
                </div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              category.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {category.isActive ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3 mr-1" />
                  Inactive
                </>
              )}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {category.slug}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {category.sortOrder}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {new Date(category.createdAt).toLocaleDateString()}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setEditingCategory(category)}
                className="text-sky-600 hover:text-sky-900 p-1"
                title="Edit"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleStatusChange(category._id, !category.isActive)}
                className={`p-1 ${
                  category.isActive 
                    ? 'text-red-600 hover:text-red-900' 
                    : 'text-green-600 hover:text-green-900'
                }`}
                title={category.isActive ? 'Deactivate' : 'Activate'}
              >
                {category.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
              </button>
              <button
                className="text-gray-600 hover:text-gray-900 p-1"
                title="More options"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </td>
        </tr>
        {category.children && category.children.length > 0 && expandedCategories.has(category._id) && 
         renderCategoryTree(category.children, level + 1)}
      </React.Fragment>
    ))
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Category Management
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage product categories and their hierarchical structure
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="sm:col-span-1 lg:col-span-2">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                  Search
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="search"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="focus:ring-sky-500 focus:border-sky-500 block w-full pl-10 py-3 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Search categories..."
                  />
                </div>
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="sm:col-span-2 lg:col-span-1 flex items-end">
                <button className="w-full inline-flex items-center justify-center px-4 sm:px-6 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors">
                  <Filter className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">More Filters</span>
                  <span className="sm:hidden">Filters</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Categories
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {selectedCategories.length} selected
                </span>
                {selectedCategories.length > 0 && (
                  <button className="text-sm text-red-600 hover:text-red-900">
                    Bulk Actions
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedCategories.length === filteredCategories.length && filteredCategories.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sort Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {renderCategoryTree(buildCategoryTree(filteredCategories))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Category Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Add New Category
                  </h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
                <form onSubmit={handleAddCategory} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      English Name
                    </label>
                    <input
                      type="text"
                      value={newCategory.nameEn}
                      onChange={(e) => handleInputChange('nameEn', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                      placeholder="Enter English name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Chinese Name (zh-HK)
                    </label>
                    <input
                      type="text"
                      value={newCategory.nameZh}
                      onChange={(e) => handleInputChange('nameZh', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                      placeholder="Enter Chinese name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={newCategory.slug}
                      onChange={(e) => handleInputChange('slug', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                      placeholder="category-slug"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Parent Category
                    </label>
                    <select 
                      value={newCategory.parentId}
                      onChange={(e) => handleInputChange('parentId', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                    >
                      <option value="">No Parent (Root Category)</option>
                      {parentCategories.map(category => (
                        <option key={category._id} value={category._id}>
                          {category.name.en} ({category.name['zh-HK']})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      value={newCategory.sortOrder}
                      onChange={(e) => handleInputChange('sortOrder', parseInt(e.target.value) || 0)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={newCategory.isActive}
                      onChange={(e) => handleInputChange('isActive', e.target.checked)}
                      className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                      Active
                    </label>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700"
                    >
                      Create Category
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Category Modal */}
        {editingCategory && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Edit Category
                  </h3>
                  <button
                    onClick={() => setEditingCategory(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
                <form onSubmit={handleEditCategory} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      English Name
                    </label>
                    <input
                      type="text"
                      value={editingCategory.name.en}
                      onChange={(e) => setEditingCategory({
                        ...editingCategory,
                        name: { ...editingCategory.name, en: e.target.value }
                      })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                      placeholder="Enter English name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Chinese Name (zh-HK)
                    </label>
                    <input
                      type="text"
                      value={editingCategory.name['zh-HK']}
                      onChange={(e) => setEditingCategory({
                        ...editingCategory,
                        name: { ...editingCategory.name, 'zh-HK': e.target.value }
                      })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                      placeholder="Enter Chinese name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={editingCategory.slug}
                      onChange={(e) => setEditingCategory({
                        ...editingCategory,
                        slug: e.target.value
                      })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                      placeholder="category-slug"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Parent Category
                    </label>
                    <select 
                      value={editingCategory.parentId || ''}
                      onChange={(e) => setEditingCategory({
                        ...editingCategory,
                        parentId: e.target.value || null
                      })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                    >
                      <option value="">No Parent (Root Category)</option>
                      {parentCategories.map(category => (
                        <option key={category._id} value={category._id}>
                          {category.name.en} ({category.name['zh-HK']})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      value={editingCategory.sortOrder}
                      onChange={(e) => setEditingCategory({
                        ...editingCategory,
                        sortOrder: parseInt(e.target.value) || 0
                      })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="editIsActive"
                      checked={editingCategory.isActive}
                      onChange={(e) => setEditingCategory({
                        ...editingCategory,
                        isActive: e.target.checked
                      })}
                      className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                    />
                    <label htmlFor="editIsActive" className="ml-2 block text-sm text-gray-900">
                      Active
                    </label>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setEditingCategory(null)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700"
                    >
                      Update Category
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  }
}
