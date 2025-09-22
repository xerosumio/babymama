# 分类管理系统 (Category Management System)

## 📌 概述

根据 Babymama PRD 要求，分类管理采用**平台统一管理**的架构，确保分类结构的一致性和统一性。

## 🏗️ 架构设计

### 1. **Admin Console (平台运营端)**
- **位置**: `/admin/categories`
- **权限**: 只有平台管理员可以访问
- **功能**:
  - ✅ 创建/编辑/删除分类
  - ✅ 管理分类层级结构 (一级/二级/三级)
  - ✅ 设置分类状态 (启用/停用)
  - ✅ 配置分类排序
  - ✅ 上传分类图片
  - ✅ 多语言支持 (英文/繁体中文)

### 2. **Merchant Console (商家端)**
- **权限**: 商家**不能创建新分类**
- **功能**: 在上架商品时，只能从**平台已有的分类树**中选择
- **限制**: 确保所有商品使用统一的分类体系

### 3. **Customer Portal (消费者端)**
- **权限**: 只读访问
- **功能**: 展示分类导航和商品浏览
- **数据源**: 完全来自 Admin 端配置的分类数据

## 📁 文件结构

```
pages/
├── admin/
│   └── categories/
│       └── index.tsx              # 分类管理页面
├── api/
│   ├── categories/
│   │   └── index.ts               # 公共分类API (只读)
│   └── admin/
│       └── categories/
│           ├── index.ts           # Admin分类管理API
│           └── [id].ts            # 单个分类操作API
models/
└── Category.ts                    # 分类数据模型
```

## 🔧 技术实现

### 数据模型
```typescript
interface Category {
  _id: string
  name: {
    en: string          // 英文名称
    'zh-HK': string     // 繁体中文名称
  }
  slug: string          // URL友好的标识符
  parentId?: string     // 父分类ID (支持多级分类)
  image?: string        // 分类图片
  isActive: boolean     // 是否启用
  sortOrder: number     // 排序权重
  createdAt: Date
  updatedAt: Date
}
```

### API 端点

#### 公共API (用户端)
- `GET /api/categories` - 获取分类列表 (只返回启用的分类)

#### Admin API (管理端)
- `GET /api/admin/categories` - 获取所有分类 (包括未启用的)
- `POST /api/admin/categories` - 创建新分类
- `GET /api/admin/categories/[id]` - 获取单个分类详情
- `PUT /api/admin/categories/[id]` - 更新分类
- `DELETE /api/admin/categories/[id]` - 删除分类

### 权限控制
- **Admin API**: 需要有效的管理员token
- **公共API**: 无需认证，但只能读取启用的分类

## 🌳 分类层级结构

```
一级分类 (Root Categories)
├── 餵養用品 (Feeding)
│   ├── 奶瓶奶嘴 (Bottles & Nipples)
│   │   ├── 玻璃奶瓶 (Glass Bottles)
│   │   └── 塑膠奶瓶 (Plastic Bottles)
│   └── 嬰兒奶粉 (Baby Formula)
├── 尿布濕巾 (Diapers & Wipes)
│   ├── 尿布 (Diapers)
│   └── 嬰兒濕巾 (Baby Wipes)
├── 嬰兒護理 (Baby Care)
├── 服裝 (Clothing)
├── 玩具 (Toys)
├── 用品旅行 (Gear & Travel)
└── 孕婦用品 (Maternity)
```

## 🚀 使用流程

### 1. 平台管理员操作
1. 登录 Admin Console (`/admin/auth/login`)
2. 进入分类管理 (`/admin/categories`)
3. 创建/编辑分类，设置多语言名称
4. 配置分类层级关系
5. 设置分类状态和排序

### 2. 商家操作
1. 登录 Merchant Console
2. 进入商品管理
3. 选择商品分类时，从下拉列表中选择
4. **无法创建新分类**

### 3. 消费者体验
1. 浏览网站时看到统一的分类导航
2. 点击分类查看该分类下的商品
3. 享受一致的分类体验

## 🔒 安全特性

- **权限隔离**: Admin、Merchant、Customer 三端权限完全分离
- **数据一致性**: 所有分类数据由平台统一管理
- **防误操作**: 删除分类前检查是否有子分类或关联商品
- **循环引用检测**: 防止分类成为自己的父分类

## 📱 移动端适配

分类管理页面已完全适配移动端，支持：
- 响应式表格布局
- 触摸友好的操作按钮
- 可折叠的分类树结构
- 优化的移动端表单

## 🎯 未来扩展

- **分类属性配置**: 不同分类可以绑定不同属性
- **分类SEO优化**: 支持分类级别的SEO设置
- **分类统计**: 显示每个分类下的商品数量
- **批量操作**: 支持批量启用/禁用分类
- **分类导入/导出**: 支持CSV格式的分类数据导入导出

---

✅ **总结**: 分类管理完全按照 PRD 要求实现，确保平台统一管理、结构一致、避免混乱。


