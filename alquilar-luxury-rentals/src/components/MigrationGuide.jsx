import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Download, ExternalLink, CheckCircle, Github, Globe } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MigrationGuide() {
  const [copiedItem, setCopiedItem] = useState('');

  const copyToClipboard = (text, itemName) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(itemName);
    setTimeout(() => setCopiedItem(''), 2000);
  };

  const packageJson = `{
  "name": "alquilar-luxury-rentals",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build": "react-scripts build",
    "start": "react-scripts start",
    "dev": "react-scripts start",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "react-scripts": "5.0.1",
    "axios": "^1.6.0",
    "@neondatabase/serverless": "^0.7.2",
    "drizzle-orm": "^0.29.0",
    "drizzle-kit": "^0.20.4",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "nodemailer": "^6.9.7",
    "stripe": "^14.9.0",
    "tailwindcss": "^3.3.6",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "lucide-react": "^0.294.0",
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-button": "^1.0.4",
    "@radix-ui/react-card": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-input": "^1.0.4",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-tabs": "^1.0.4",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "embla-carousel-react": "^8.0.0-rc17",
    "date-fns": "^2.30.0",
    "lodash": "^4.17.21",
    "react-markdown": "^9.0.1",
    "react-quill": "^2.0.0",
    "react-hook-form": "^7.48.2",
    "framer-motion": "^10.16.5"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}`;

  const netlifyToml = `[build]
  command = "npm run build"
  functions = "netlify/functions"
  publish = "build"

[dev]
  command = "npm start"
  port = 3000

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--production=false"`;

  const envExample = `# Neon Database
DATABASE_URL="postgresql://username:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters-long"
JWT_EXPIRES_IN="7d"
BCRYPT_ROUNDS="12"

# Email Service (Gmail SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-gmail-app-password"
FROM_EMAIL="noreply@alquilar.co.uk"
FROM_NAME="Alquilar Luxury Rentals"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# App Configuration
REACT_APP_API_BASE_URL="https://your-netlify-site.netlify.app"
REACT_APP_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# File Upload (Cloudinary or similar)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"`;

  const drizzleSchema = `// src/lib/schema.js
import { pgTable, text, integer, decimal, timestamp, boolean, json, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  fullName: text('full_name').notNull(),
  role: text('role').default('user').notNull(),
  phoneNumber: text('phone_number'),
  dateOfBirth: timestamp('date_of_birth'),
  profileImage: text('profile_image'),
  accountBalance: decimal('account_balance', { precision: 10, scale: 2 }).default('0'),
  address: json('address'),
  professionalDetails: json('professional_details'),
  identification: json('identification'),
  paymentMethods: json('payment_methods'),
  preferences: json('preferences'),
  emailVerified: boolean('email_verified').default(false),
  emailVerificationToken: text('email_verification_token'),
  resetPasswordToken: text('reset_password_token'),
  resetPasswordExpires: timestamp('reset_password_expires'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const cars = pgTable('cars', {
  id: uuid('id').primaryKey().defaultRandom(),
  make: text('make').notNull(),
  model: text('model').notNull(),
  year: integer('year').notNull(),
  category: text('category').notNull(),
  color: text('color'),
  licensePlate: text('license_plate').unique().notNull(),
  vin: text('vin'),
  dailyRate: decimal('daily_rate', { precision: 10, scale: 2 }).notNull(),
  weeklyRate: decimal('weekly_rate', { precision: 10, scale: 2 }),
  monthlyRate: decimal('monthly_rate', { precision: 10, scale: 2 }),
  depositAmount: decimal('deposit_amount', { precision: 10, scale: 2 }),
  status: text('status').default('available'),
  mileage: integer('mileage'),
  lastServiceDate: timestamp('last_service_date'),
  nextServiceDue: timestamp('next_service_due'),
  specifications: json('specifications'),
  images: json('images'),
  location: json('location'),
  createdBy: uuid('created_by').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  carId: uuid('car_id').notNull().references(() => cars.id),
  bookingReference: text('booking_reference').unique().notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  depositAmount: decimal('deposit_amount', { precision: 10, scale: 2 }),
  insuranceCost: decimal('insurance_cost', { precision: 10, scale: 2 }),
  status: text('status').default('pending'),
  paymentStatus: text('payment_status').default('pending'),
  specialRequests: text('special_requests'),
  driverLicenseVerified: boolean('driver_license_verified').default(false),
  pickupLocation: json('pickup_location'),
  dropoffLocation: json('dropoff_location'),
  additionalServices: json('additional_services'),
  vehicleConditionCheckin: json('vehicle_condition_checkin'),
  vehicleConditionCheckout: json('vehicle_condition_checkout'),
  createdBy: uuid('created_by').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  bookingId: uuid('booking_id').references(() => bookings.id),
  transactionId: text('transaction_id'),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').default('USD'),
  paymentMethod: text('payment_method').notNull(),
  paymentType: text('payment_type').notNull(),
  status: text('status').default('pending'),
  paymentDetails: json('payment_details'),
  failureReason: text('failure_reason'),
  processedAt: timestamp('processed_at'),
  createdAt: timestamp('created_at').defaultNow(),
});`;

  const authFunction = `// netlify/functions/auth.js
const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const sql = neon(process.env.DATABASE_URL);

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const path = event.path.replace('/.netlify/functions/auth', '');
  const method = event.httpMethod;

  try {
    if (path === '/login' && method === 'POST') {
      const { email, password } = JSON.parse(event.body);

      const users = await sql\`
        SELECT * FROM users WHERE email = \${email}
      \`;

      if (users.length === 0) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ message: 'Invalid credentials' }),
        };
      }

      const user = users[0];
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ message: 'Invalid credentials' }),
        };
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      const { password: _, ...userWithoutPassword } = user;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          token,
          user: userWithoutPassword,
        }),
      };
    }

    if (path === '/register' && method === 'POST') {
      const { email, password, fullName } = JSON.parse(event.body);

      // Check if user exists
      const existingUsers = await sql\`
        SELECT id FROM users WHERE email = \${email}
      \`;

      if (existingUsers.length > 0) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'User already exists' }),
        };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const newUsers = await sql\`
        INSERT INTO users (email, password, full_name, account_balance)
        VALUES (\${email}, \${hashedPassword}, \${fullName}, 0)
        RETURNING id, email, full_name, role, account_balance, created_at
      \`;

      const user = newUsers[0];

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          token,
          user,
        }),
      };
    }

    if (path === '/me' && method === 'GET') {
      const authHeader = event.headers.authorization;
      if (!authHeader) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ message: 'No token provided' }),
        };
      }

      const token = authHeader.replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const users = await sql\`
        SELECT id, email, full_name, role, phone_number, date_of_birth, 
               profile_image, account_balance, address, professional_details,
               identification, payment_methods, preferences, email_verified,
               created_at, updated_at
        FROM users 
        WHERE id = \${decoded.userId}
      \`;

      if (users.length === 0) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ message: 'Invalid token' }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ user: users[0] }),
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ message: 'Route not found' }),
    };
  } catch (error) {
    console.error('Auth function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};`;

  const carsFunction = `// netlify/functions/cars.js
const { neon } = require('@neondatabase/serverless');
const jwt = require('jsonwebtoken');

const sql = neon(process.env.DATABASE_URL);

const verifyToken = (authHeader) => {
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '');
  return jwt.verify(token, process.env.JWT_SECRET);
};

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    if (event.httpMethod === 'GET') {
      const { category, location, minPrice, maxPrice } = event.queryStringParameters || {};

      let query = 'SELECT * FROM cars WHERE 1=1';
      const params = [];

      if (category && category !== 'all') {
        query += ' AND category = $' + (params.length + 1);
        params.push(category);
      }

      if (location && location !== 'all') {
        query += ' AND location->>\\'city\\' ILIKE $' + (params.length + 1);
        params.push(\`%\${location}%\`);
      }

      if (minPrice) {
        query += ' AND daily_rate >= $' + (params.length + 1);
        params.push(parseFloat(minPrice));
      }

      if (maxPrice) {
        query += ' AND daily_rate <= $' + (params.length + 1);
        params.push(parseFloat(maxPrice));
      }

      query += ' ORDER BY created_at DESC';

      const cars = await sql(query, params);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(cars),
      };
    }

    if (event.httpMethod === 'POST') {
      const decoded = verifyToken(event.headers.authorization);
      if (!decoded || decoded.role !== 'admin') {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ message: 'Unauthorized' }),
        };
      }

      const carData = JSON.parse(event.body);
      
      const newCars = await sql\`
        INSERT INTO cars (make, model, year, category, color, license_plate, 
                         daily_rate, weekly_rate, monthly_rate, deposit_amount,
                         specifications, images, location, created_by)
        VALUES (\${carData.make}, \${carData.model}, \${carData.year}, 
                \${carData.category}, \${carData.color}, \${carData.licensePlate},
                \${carData.dailyRate}, \${carData.weeklyRate}, \${carData.monthlyRate},
                \${carData.depositAmount}, \${JSON.stringify(carData.specifications)},
                \${JSON.stringify(carData.images)}, \${JSON.stringify(carData.location)},
                \${decoded.userId})
        RETURNING *
      \`;

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(newCars[0]),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  } catch (error) {
    console.error('Cars function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};`;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Complete Migration Guide
        </h1>
        <p className="text-xl text-slate-400">
          Deploy your luxury car rental app on GitHub + Netlify + Neon Database
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="functions">Functions</TabsTrigger>
          <TabsTrigger value="deployment">Deploy</TabsTrigger>
          <TabsTrigger value="config">Config</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Migration Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-300">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <Github className="w-8 h-8 text-blue-400 mb-2" />
                  <h3 className="font-semibold text-white">GitHub Repository</h3>
                  <p className="text-sm text-slate-400">Source code management and version control</p>
                </div>
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <Globe className="w-8 h-8 text-green-400 mb-2" />
                  <h3 className="font-semibold text-white">Netlify Hosting</h3>
                  <p className="text-sm text-slate-400">Frontend hosting with serverless functions</p>
                </div>
                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <ExternalLink className="w-8 h-8 text-purple-400 mb-2" />
                  <h3 className="font-semibold text-white">Neon Database</h3>
                  <p className="text-sm text-slate-400">Serverless PostgreSQL database</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-semibold text-white mb-2">What You'll Get:</h4>
                <ul className="space-y-2 text-sm">
                  <li>✅ Production-ready React application</li>
                  <li>✅ Secure user authentication with JWT</li>
                  <li>✅ PostgreSQL database with Drizzle ORM</li>
                  <li>✅ Email notifications and Stripe payments</li>
                  <li>✅ File upload with Cloudinary</li>
                  <li>✅ Responsive design for all devices</li>
                  <li>✅ Admin dashboard and user management</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="setup" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Project Setup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-white mb-2">1. package.json</h4>
                <div className="relative">
                  <pre className="bg-slate-900 p-4 rounded-lg text-sm text-slate-300 overflow-x-auto max-h-96">
                    {packageJson}
                  </pre>
                  <Button
                    onClick={() => copyToClipboard(packageJson, 'package')}
                    className="absolute top-2 right-2"
                    size="sm"
                    variant="outline"
                  >
                    {copiedItem === 'package' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">2. netlify.toml</h4>
                <div className="relative">
                  <pre className="bg-slate-900 p-4 rounded-lg text-sm text-slate-300 overflow-x-auto">
                    {netlifyToml}
                  </pre>
                  <Button
                    onClick={() => copyToClipboard(netlifyToml, 'netlify')}
                    className="absolute top-2 right-2"
                    size="sm"
                    variant="outline"
                  >
                    {copiedItem === 'netlify' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">3. .env.example</h4>
                <div className="relative">
                  <pre className="bg-slate-900 p-4 rounded-lg text-sm text-slate-300 overflow-x-auto max-h-96">
                    {envExample}
                  </pre>
                  <Button
                    onClick={() => copyToClipboard(envExample, 'env')}
                    className="absolute top-2 right-2"
                    size="sm"
                    variant="outline"
                  >
                    {copiedItem === 'env' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Database Schema (Drizzle ORM)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-slate-900 p-4 rounded-lg text-sm text-slate-300 overflow-x-auto max-h-96">
                  {drizzleSchema}
                </pre>
                <Button
                  onClick={() => copyToClipboard(drizzleSchema, 'schema')}
                  className="absolute top-2 right-2"
                  size="sm"
                  variant="outline"
                >
                  {copiedItem === 'schema' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              
              <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <h4 className="font-semibold text-white mb-2">Setting up Neon Database:</h4>
                <ol className="text-sm text-slate-300 space-y-1">
                  <li>1. Create account at <a href="https://neon.tech" className="text-blue-400 hover:underline">neon.tech</a></li>
                  <li>2. Create a new project</li>
                  <li>3. Copy the connection string</li>
                  <li>4. Add to your .env file as DATABASE_URL</li>
                  <li>5. Run: <code className="bg-slate-800 px-2 py-1 rounded">npm run db:push</code></li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="functions" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Netlify Functions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-white mb-2">Authentication Function</h4>
                <div className="relative">
                  <pre className="bg-slate-900 p-4 rounded-lg text-sm text-slate-300 overflow-x-auto max-h-96">
                    {authFunction}
                  </pre>
                  <Button
                    onClick={() => copyToClipboard(authFunction, 'auth')}
                    className="absolute top-2 right-2"
                    size="sm"
                    variant="outline"
                  >
                    {copiedItem === 'auth' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Cars API Function</h4>
                <div className="relative">
                  <pre className="bg-slate-900 p-4 rounded-lg text-sm text-slate-300 overflow-x-auto max-h-96">
                    {carsFunction}
                  </pre>
                  <Button
                    onClick={() => copyToClipboard(carsFunction, 'cars')}
                    className="absolute top-2 right-2"
                    size="sm"
                    variant="outline"
                  >
                    {copiedItem === 'cars' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deployment" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Deployment Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Step 1: GitHub Setup</h4>
                  <ol className="text-sm text-slate-300 space-y-1 list-decimal list-inside">
                    <li>Create new repository on GitHub</li>
                    <li>Clone and add all files from this guide</li>
                    <li>Copy your current pages, components, and entities</li>
                    <li>Update import statements (remove @/api/entities, use API calls)</li>
                    <li>Commit and push to GitHub</li>
                  </ol>
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Step 2: Netlify Deployment</h4>
                  <ol className="text-sm text-slate-300 space-y-1 list-decimal list-inside">
                    <li>Connect GitHub repo to Netlify</li>
                    <li>Set build command: <code className="bg-slate-800 px-2 py-1 rounded">npm run build</code></li>
                    <li>Set publish directory: <code className="bg-slate-800 px-2 py-1 rounded">build</code></li>
                    <li>Add environment variables from .env.example</li>
                    <li>Deploy!</li>
                  </ol>
                </div>

                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Step 3: Post-Deployment</h4>
                  <ol className="text-sm text-slate-300 space-y-1 list-decimal list-inside">
                    <li>Test authentication flow</li>
                    <li>Add sample car data via admin panel</li>
                    <li>Configure email templates</li>
                    <li>Set up Stripe webhooks</li>
                    <li>Test booking flow end-to-end</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Required Services & Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white mb-3">Required Accounts:</h4>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>✅ <a href="https://github.com" className="text-blue-400 hover:underline">GitHub</a> - Code repository</li>
                    <li>✅ <a href="https://netlify.com" className="text-blue-400 hover:underline">Netlify</a> - Hosting & functions</li>
                    <li>✅ <a href="https://neon.tech" className="text-blue-400 hover:underline">Neon</a> - PostgreSQL database</li>
                    <li>✅ <a href="https://stripe.com" className="text-blue-400 hover:underline">Stripe</a> - Payment processing</li>
                    <li>✅ <a href="https://cloudinary.com" className="text-blue-400 hover:underline">Cloudinary</a> - Image uploads</li>
                    <li>✅ Gmail/SMTP - Email notifications</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-3">Environment Variables:</h4>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>🔐 DATABASE_URL</li>
                    <li>🔐 JWT_SECRET</li>
                    <li>🔐 STRIPE_SECRET_KEY</li>
                    <li>🔐 SMTP credentials</li>
                    <li>🔐 CLOUDINARY keys</li>
                    <li>📱 REACT_APP variables</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <h4 className="font-semibold text-white mb-2">⚠️ Important Notes:</h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Replace all base44 entity calls with API fetch requests</li>
                  <li>• Update authentication to use JWT tokens</li>
                  <li>• Configure CORS for your domain</li>
                  <li>• Set up proper error handling</li>
                  <li>• Test all payment flows before going live</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-center">
        <Button 
          onClick={() => window.open('https://github.com/new', '_blank')}
          className="bg-green-600 hover:bg-green-700 mr-4"
        >
          <Github className="w-4 h-4 mr-2" />
          Create GitHub Repo
        </Button>
        <Button 
          onClick={() => window.open('https://app.netlify.com/start', '_blank')}
          variant="outline"
        >
          <Globe className="w-4 h-4 mr-2" />
          Deploy to Netlify
        </Button>
      </div>
    </div>
  );
}