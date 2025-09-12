#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up babymama e-commerce platform...\n');

// Create .env.local file if it doesn't exist
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  const envContent = `# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/babymama

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Payment Gateway (for future implementation)
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key

# Email Service (for future implementation)
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password

# File Upload (for future implementation)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file');
} else {
  console.log('✅ .env.local file already exists');
}

// Create public directory structure
const publicDirs = [
  'public/locales/en',
  'public/locales/zh-HK',
  'public/images',
  'public/icons'
];

publicDirs.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
});

// Create placeholder images
const placeholderImages = [
  'public/placeholder-product.jpg',
  'public/favicon.ico'
];

placeholderImages.forEach(imagePath => {
  const fullPath = path.join(process.cwd(), imagePath);
  if (!fs.existsSync(fullPath)) {
    // Create a simple placeholder file
    fs.writeFileSync(fullPath, '');
    console.log(`✅ Created placeholder: ${imagePath}`);
  }
});

console.log('\n🎉 Setup complete!');
console.log('\nNext steps:');
console.log('1. Install dependencies: npm install');
console.log('2. Start MongoDB: mongod');
console.log('3. Start development server: npm run dev');
console.log('4. Seed the database: curl -X POST http://localhost:3000/api/seed');
console.log('5. Open http://localhost:3000 in your browser');
console.log('\nHappy coding! 🚀');

