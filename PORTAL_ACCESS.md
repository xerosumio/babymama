# BabyMama Portal Access Guide

## 门户访问指南

### 用户端 (Customer Portal)
- **主页**: http://localhost:3000/
- **功能**: 商品浏览、购物车、订单管理、用户账户
- **特点**: 面向消费者的购物体验

### 商家门户 (Merchant Portal)
- **主页**: http://localhost:3000/merchant
- **登录**: http://localhost:3000/merchant/auth/login
- **注册**: http://localhost:3000/merchant/auth/register
- **仪表板**: http://localhost:3000/merchant/dashboard
- **功能**: 商品管理、订单处理、销售分析、店铺设置

### 运营端 (Admin Portal)
- **主页**: http://localhost:3000/admin
- **登录**: http://localhost:3000/admin/auth/login
- **仪表板**: http://localhost:3000/admin/dashboard
- **功能**: 商家管理、订单监控、平台分析、系统设置

## 测试账户

### 商家测试账户
- 邮箱: merchant@example.com
- 密码: password123

### 运营端测试账户
- 邮箱: admin@example.com
- 密码: admin123

## 开发服务器

```bash
npm run dev
```

服务器将在 http://localhost:3000 启动

## 项目结构

```
pages/
├── index.tsx                 # 用户端主页
├── merchant/
│   ├── index.tsx            # 商家门户主页
│   ├── auth/
│   │   ├── login.tsx        # 商家登录
│   │   └── register.tsx     # 商家注册
│   └── dashboard.tsx        # 商家仪表板
├── admin/
│   ├── index.tsx            # 运营端主页
│   ├── auth/
│   │   └── login.tsx        # 运营端登录
│   └── dashboard.tsx        # 运营端仪表板
└── ...
```

## 特性

- ✅ 独立的门户主页
- ✅ 完整的认证系统
- ✅ 响应式设计
- ✅ 多语言支持
- ✅ 现代化UI设计
- ✅ 完整的业务功能

