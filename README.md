# 🍼 BabyMama E-commerce Platform

A comprehensive e-commerce platform for baby products with three distinct portals: Customer, Merchant, and Admin.

## 🌟 Features

### 🛒 Customer Portal
- Complete shopping experience with product browsing
- Shopping cart and wishlist functionality
- User authentication and account management
- Product reviews and ratings
- Multi-language support (English/Chinese)
- Responsive mobile-first design

### 🏪 Merchant Portal
- Seller dashboard with product management
- Order tracking and fulfillment
- Sales analytics and reporting
- Inventory management
- Commission tracking
- Independent merchant authentication

### 👨‍💼 Admin Portal
- Platform-wide management and oversight
- User and merchant management
- Sales analytics and reporting
- Content management
- System settings and configuration

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Responsive Design
- **Backend**: Next.js API Routes, MongoDB 7.0+
- **Database**: Mongoose ODM
- **Authentication**: JWT with bcryptjs
- **Internationalization**: next-i18next
- **State Management**: React Context API
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB 7.0+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/xerosumio/babymama.git
   cd babymama
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:
   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/babymama
   JWT_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your local machine

5. **Seed the database**
   ```bash
   curl -X POST http://localhost:3000/api/seed
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Portal Access

### Customer Portal
- **URL**: `http://localhost:3000`
- **Test Account**: 
  - Email: `simple@test.com`
  - Password: `test123`

### Merchant Portal
- **URL**: `http://localhost:3000/merchant`
- **Test Account**:
  - Email: `info@organicbaby.com`
  - Password: `password123`

### Admin Portal
- **URL**: `http://localhost:3000/admin`
- **Test Account**:
  - Email: `admin@babymama.com`
  - Password: `admin123`

## 🗂 Project Structure

```
babymama/
├── components/              # Reusable UI components
│   ├── Admin/              # Admin-specific components
│   ├── Homepage/           # Homepage components
│   ├── Layout/             # Layout components
│   └── Merchant/           # Merchant-specific components
├── contexts/               # React Context providers
│   ├── AdminContext.tsx    # Admin state management
│   ├── CartContext.tsx     # Shopping cart state
│   ├── MerchantContext.tsx # Merchant state management
│   └── WishlistContext.tsx # Wishlist state
├── lib/                    # Utility functions and types
│   ├── mongodb.ts          # Database connection
│   ├── types.ts            # TypeScript type definitions
│   └── mockData.ts         # Sample data
├── models/                 # MongoDB schemas
│   ├── User.ts             # User model
│   ├── Merchant.ts         # Merchant model
│   ├── Product.ts          # Product model
│   ├── Order.ts            # Order model
│   ├── Category.ts         # Category model
│   └── Review.ts           # Review model
├── pages/                  # Next.js pages and API routes
│   ├── api/                # API endpoints
│   ├── admin/              # Admin portal pages
│   ├── merchant/           # Merchant portal pages
│   ├── auth/               # Authentication pages
│   └── [other pages]       # Customer portal pages
├── public/                 # Static assets
│   ├── images/             # Image assets
│   └── locales/            # Translation files
└── styles/                 # Global styles
    └── globals.css         # Global CSS
```

## 🗄 Database Schema

### Core Models
- **User**: Customer accounts with authentication
- **Merchant**: Seller accounts with business information
- **Product**: Product catalog with variants and pricing
- **Order**: Order management with items and status
- **Category**: Product categorization with hierarchy
- **Review**: Product reviews and ratings

### Data Relationships
```
User → Orders → OrderItems → Products → Merchant
User → Reviews → Products
Products → Categories
Merchants → Products
```

## 🔧 API Endpoints

### Customer APIs
- `GET /api/products` - Fetch products
- `GET /api/categories` - Fetch categories
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Merchant APIs
- `POST /api/merchant/auth/login` - Merchant login
- `POST /api/merchant/auth/register` - Merchant registration
- `GET /api/merchant/dashboard` - Merchant dashboard data

### Admin APIs
- `POST /api/admin/auth/login` - Admin login
- `GET /api/admin/dashboard` - Admin dashboard data

## 🌐 Internationalization

The platform supports multiple languages:
- English (en)
- Chinese Hong Kong (zh-HK)

Translation files are located in `public/locales/`.

## 📊 Features Overview

### Customer Features
- ✅ Product browsing and search
- ✅ Shopping cart functionality
- ✅ Wishlist management
- ✅ User authentication
- ✅ Order placement and tracking
- ✅ Product reviews and ratings
- ✅ Multi-language support

### Merchant Features
- ✅ Product management
- ✅ Order tracking
- ✅ Sales analytics
- ✅ Inventory management
- ✅ Commission tracking
- ✅ Independent authentication

### Admin Features
- ✅ User management
- ✅ Merchant management
- ✅ Platform analytics
- ✅ Content management
- ✅ System configuration

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- Ensure MongoDB is accessible
- Set all required environment variables
- Build the project: `npm run build`
- Start production server: `npm start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact: [your-email@example.com]

## 🎯 Roadmap

- [ ] Payment gateway integration
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] AI-powered product recommendations
- [ ] Multi-currency support
- [ ] Advanced shipping options

---

**Built with ❤️ for baby products e-commerce**