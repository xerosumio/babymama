# babymama - Mother & Baby E-commerce Platform

A modern, multi-language e-commerce platform focused on mother and baby products, built with Next.js, TypeScript, MongoDB, and Tailwind CSS.

## Features

- 🌐 **Multi-language Support**: English and Traditional Chinese (Hong Kong)
- 📱 **Responsive Design**: Mobile-first PWA approach
- 🛒 **E-commerce Functionality**: Product browsing, cart, checkout
- 🎨 **Modern UI**: Clean, warm design following "Warm, Safe, Clean" aesthetic
- 🗄️ **MongoDB Integration**: Scalable database with Mongoose ODM
- 🚀 **Next.js 14**: Latest React framework with App Router
- 🎯 **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Styling**: Tailwind CSS with custom design system
- **Internationalization**: next-i18next
- **Icons**: Lucide React
- **Database**: MongoDB

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd babymama-new
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your MongoDB connection string:
```
MONGODB_URI=mongodb://localhost:27017/babymama
```

4. Seed the database with sample data:
```bash
curl -X POST http://localhost:3000/api/seed
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
babymama-new/
├── components/           # React components
│   ├── Layout/          # Layout components (Header, Footer)
│   └── Homepage/        # Homepage-specific components
├── lib/                 # Utility functions and types
├── models/              # MongoDB/Mongoose models
├── pages/               # Next.js pages and API routes
│   ├── api/            # API endpoints
│   └── [pages].tsx     # Page components
├── public/             # Static assets
│   └── locales/        # i18n translation files
├── styles/             # Global styles
└── types/              # TypeScript type definitions
```

## Database Models

- **User**: Customer information and preferences
- **Product**: Product catalog with multi-language support
- **Category**: Product categories and navigation
- **Merchant**: Supplier/seller information
- **Order**: Order management and tracking
- **Review**: Product reviews and ratings
- **Banner**: Homepage promotional banners

## API Endpoints

- `GET /api/products` - Fetch products with filtering
- `GET /api/categories` - Fetch product categories
- `POST /api/seed` - Seed database with sample data
- `GET /api/products/[id]` - Fetch single product details

## Multi-language Support

The platform supports English and Traditional Chinese (Hong Kong). Language switching is available in the header, and all content is localized using next-i18next.

### Adding New Translations

1. Add new keys to `public/locales/en/common.json`
2. Add corresponding translations to `public/locales/zh-HK/common.json`
3. Use the `useTranslation` hook in components

## Design System

The design follows the "Warm, Safe, Clean" aesthetic with:
- **Primary Colors**: Baby blue (#0ea5e9) and soft pink (#f472b6)
- **Typography**: Inter font family
- **Spacing**: Consistent spacing scale using Tailwind
- **Components**: Reusable component library

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Component-based architecture

## Deployment

The application can be deployed to any platform that supports Next.js:

1. **Vercel** (recommended)
2. **Netlify**
3. **AWS Amplify**
4. **Docker containers**

Make sure to set up your MongoDB connection string in the production environment.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email info@babymama.com or create an issue in the repository.

