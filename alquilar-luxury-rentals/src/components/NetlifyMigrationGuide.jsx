import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Download, ExternalLink, CheckCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function NetlifyMigrationGuide() {
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
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "sqlite3": "^5.1.6",
    "knex": "^3.0.1",
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
  NODE_VERSION = "18"`;

  const envVars = `# Database
DATABASE_URL="your-planetscale-or-postgres-connection-string"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters"
JWT_EXPIRES_IN="7d"

# Email (Netlify Forms or SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."

# Netlify
NETLIFY_SITE_ID="your-site-id"
NETLIFY_ACCESS_TOKEN="your-access-token"`;

  const databaseSchema = `-- SQLite Schema for Netlify
-- Run this in your database console

CREATE TABLE users (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  phone_number TEXT,
  date_of_birth DATE,
  profile_image TEXT,
  account_balance DECIMAL(10,2) DEFAULT 0,
  created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  address JSON,
  professional_details JSON,
  identification JSON,
  payment_methods JSON,
  preferences JSON
);

CREATE TABLE cars (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  category TEXT NOT NULL,
  color TEXT,
  license_plate TEXT UNIQUE NOT NULL,
  vin TEXT,
  daily_rate DECIMAL(10,2) NOT NULL,
  weekly_rate DECIMAL(10,2),
  monthly_rate DECIMAL(10,2),
  deposit_amount DECIMAL(10,2),
  status TEXT DEFAULT 'available',
  mileage INTEGER,
  last_service_date DATE,
  next_service_due DATE,
  created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT NOT NULL,
  specifications JSON,
  images JSON,
  location JSON
);

CREATE TABLE bookings (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL,
  car_id TEXT NOT NULL,
  booking_reference TEXT UNIQUE NOT NULL,
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  deposit_amount DECIMAL(10,2),
  insurance_cost DECIMAL(10,2),
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  special_requests TEXT,
  driver_license_verified BOOLEAN DEFAULT 0,
  created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT NOT NULL,
  pickup_location JSON,
  dropoff_location JSON,
  additional_services JSON,
  vehicle_condition_checkin JSON,
  vehicle_condition_checkout JSON,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (car_id) REFERENCES cars(id)
);

CREATE TABLE payments (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL,
  booking_id TEXT,
  transaction_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_method TEXT NOT NULL,
  payment_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_details JSON,
  failure_reason TEXT,
  processed_at DATETIME,
  created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_cars_status ON cars(status);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_payments_user_id ON payments(user_id);`;

  const authFunction = `// netlify/functions/auth-login.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./utils/database');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email and password required' })
      };
    }

    // Get user from database
    const user = await db('users').where({ email }).first();
    
    if (!user || !await bcrypt.compare(password, user.password)) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Invalid credentials' })
      };
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Remove password from response
    const { password: _, ...userResponse } = user;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        token,
        user: userResponse
      })
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};`;

  const databaseUtil = `// netlify/functions/utils/database.js
const knex = require('knex');

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: './database.sqlite'
  },
  useNullAsDefault: true,
  pool: {
    afterCreate: (conn, cb) => {
      conn.run('PRAGMA foreign_keys = ON', cb);
    }
  }
});

module.exports = db;`;

  const carFunction = `// netlify/functions/cars.js
const db = require('./utils/database');
const jwt = require('jsonwebtoken');

const verifyToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  try {
    const token = authHeader.split(' ')[1];
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { httpMethod, path, queryStringParameters } = event;
    const carId = path.split('/').pop();

    switch (httpMethod) {
      case 'GET':
        if (carId && carId !== 'cars') {
          // Get single car
          const car = await db('cars').where({ id: carId }).first();
          if (!car) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ error: 'Car not found' })
            };
          }
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(car)
          };
        } else {
          // Get all cars with filters
          let query = db('cars');
          
          if (queryStringParameters) {
            const { status, category, orderBy, limit } = queryStringParameters;
            
            if (status) query = query.where({ status });
            if (category) query = query.where({ category });
            if (orderBy) {
              const [field, direction] = orderBy.startsWith('-') 
                ? [orderBy.slice(1), 'desc'] 
                : [orderBy, 'asc'];
              query = query.orderBy(field, direction);
            }
            if (limit) query = query.limit(parseInt(limit));
          }
          
          const cars = await query;
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(cars)
          };
        }

      case 'POST':
        // Create new car (admin only)
        const user = verifyToken(event.headers.authorization);
        if (!user || user.role !== 'admin') {
          return {
            statusCode: 403,
            headers,
            body: JSON.stringify({ error: 'Admin access required' })
          };
        }

        const carData = JSON.parse(event.body);
        const newCar = await db('cars').insert({
          ...carData,
          created_by: user.userId,
          created_date: new Date().toISOString(),
          updated_date: new Date().toISOString()
        }).returning('*');

        return {
          statusCode: 201,
          headers,
          body: JSON.stringify(newCar[0])
        };

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Cars API error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};`;

  const deploymentSteps = `# Netlify Deployment Steps

## 1. Create React App
npx create-react-app alquilar-luxury-rentals
cd alquilar-luxury-rentals

## 2. Install Dependencies
npm install axios bcryptjs jsonwebtoken sqlite3 knex nodemailer stripe tailwindcss lucide-react

## 3. Copy Your Components
# Copy all your pages/, components/, and other files

## 4. Set up Netlify Functions
mkdir -p netlify/functions/utils

## 5. Create Database
# Set up your database (SQLite for development, PostgreSQL for production)

## 6. Deploy to Netlify
# Option 1: Connect GitHub repo (recommended)
# Option 2: Drag & drop build folder
# Option 3: Netlify CLI

npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod

## 7. Set Environment Variables
# Go to Site Settings > Environment Variables in Netlify dashboard
# Add all your env vars from the .env example above`;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 bg-slate-900 text-white min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-amber-400">Netlify Migration Guide</h1>
        <p className="text-slate-300 text-lg">Complete guide to deploy your Alquilar app on Netlify with serverless functions</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-slate-800">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="functions">Functions</TabsTrigger>
          <TabsTrigger value="deploy">Deploy</TabsTrigger>
          <TabsTrigger value="config">Config</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-amber-400">Why Netlify?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-white mb-2">✅ Advantages</h3>
                  <ul className="text-slate-300 space-y-1 text-sm">
                    <li>• Free tier with generous limits</li>
                    <li>• Built-in CI/CD from GitHub</li>
                    <li>• Serverless functions included</li>
                    <li>• Global CDN distribution</li>
                    <li>• Easy custom domain setup</li>
                    <li>• Automatic HTTPS</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">📊 What We'll Build</h3>
                  <ul className="text-slate-300 space-y-1 text-sm">
                    <li>• React frontend (static)</li>
                    <li>• Serverless API functions</li>
                    <li>• SQLite/PostgreSQL database</li>
                    <li>• JWT authentication</li>
                    <li>• Email notifications</li>
                    <li>• Stripe payments</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="setup" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-amber-400 flex items-center gap-2">
                <span className="bg-amber-500 text-black w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                Project Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300">Create your package.json with all required dependencies:</p>
              <div className="bg-slate-900 p-4 rounded-lg relative">
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(packageJson, 'package')}
                >
                  {copiedItem === 'package' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
                <pre className="text-sm overflow-x-auto text-green-400">{packageJson}</pre>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-amber-400 flex items-center gap-2">
                <span className="bg-amber-500 text-black w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                Netlify Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300">Create <code className="bg-slate-700 px-2 py-1 rounded">netlify.toml</code> in your project root:</p>
              <div className="bg-slate-900 p-4 rounded-lg relative">
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(netlifyToml, 'netlify')}
                >
                  {copiedItem === 'netlify' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
                <pre className="text-sm overflow-x-auto text-blue-400">{netlifyToml}</pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-amber-400">Database Schema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300">SQLite schema for your database:</p>
              <div className="bg-slate-900 p-4 rounded-lg relative max-h-96 overflow-y-auto">
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(databaseSchema, 'schema')}
                >
                  {copiedItem === 'schema' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
                <pre className="text-sm text-cyan-400">{databaseSchema}</pre>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-amber-400">Database Utils</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300">Create <code className="bg-slate-700 px-2 py-1 rounded">netlify/functions/utils/database.js</code>:</p>
              <div className="bg-slate-900 p-4 rounded-lg relative">
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(databaseUtil, 'dbutil')}
                >
                  {copiedItem === 'dbutil' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
                <pre className="text-sm overflow-x-auto text-purple-400">{databaseUtil}</pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="functions" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-amber-400">Authentication Function</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300">Create <code className="bg-slate-700 px-2 py-1 rounded">netlify/functions/auth-login.js</code>:</p>
              <div className="bg-slate-900 p-4 rounded-lg relative max-h-96 overflow-y-auto">
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(authFunction, 'auth')}
                >
                  {copiedItem === 'auth' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
                <pre className="text-sm text-yellow-400">{authFunction}</pre>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-amber-400">Cars API Function</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300">Create <code className="bg-slate-700 px-2 py-1 rounded">netlify/functions/cars.js</code>:</p>
              <div className="bg-slate-900 p-4 rounded-lg relative max-h-96 overflow-y-auto">
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(carFunction, 'cars')}
                >
                  {copiedItem === 'cars' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
                <pre className="text-sm text-orange-400">{carFunction}</pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deploy" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-amber-400">Deployment Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-900 p-4 rounded-lg relative">
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(deploymentSteps, 'deploy')}
                >
                  {copiedItem === 'deploy' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
                <pre className="text-sm overflow-x-auto text-green-400">{deploymentSteps}</pre>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-amber-400">Quick Deploy Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 border border-slate-600 rounded-lg text-center">
                  <h3 className="font-semibold mb-2 text-white">GitHub Deploy</h3>
                  <p className="text-sm text-slate-400 mb-3">Connect your GitHub repo for automatic deployments</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Connect GitHub
                  </Button>
                </div>
                <div className="p-4 border border-slate-600 rounded-lg text-center">
                  <h3 className="font-semibold mb-2 text-white">Manual Deploy</h3>
                  <p className="text-sm text-slate-400 mb-3">Drag and drop your build folder</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Manual Upload
                  </Button>
                </div>
                <div className="p-4 border border-slate-600 rounded-lg text-center">
                  <h3 className="font-semibold mb-2 text-white">CLI Deploy</h3>
                  <p className="text-sm text-slate-400 mb-3">Use Netlify CLI for command-line deployment</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Install CLI
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-amber-400">Environment Variables</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300">Add these to your Netlify site settings:</p>
              <div className="bg-slate-900 p-4 rounded-lg relative">
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(envVars, 'env')}
                >
                  {copiedItem === 'env' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
                <pre className="text-sm overflow-x-auto text-red-400">{envVars}</pre>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-amber-400">Final Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-white mb-3">✅ Before Deploy</h3>
                  <ul className="text-slate-300 space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Package.json configured
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Netlify.toml created
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Functions folder setup
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Database schema ready
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-3">🚀 After Deploy</h3>
                  <ul className="text-slate-300 space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-amber-400" />
                      Set environment variables
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-amber-400" />
                      Configure custom domain
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-amber-400" />
                      Test all API endpoints
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-amber-400" />
                      Setup monitoring
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Download Complete Package */}
      <Card className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30">
        <CardHeader>
          <CardTitle className="text-white">🎉 Ready to Deploy?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-300 mb-4">
            Get the complete migration package with all files, functions, and configuration ready for Netlify deployment.
          </p>
          <div className="flex gap-4">
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-black flex-1">
              <Download className="w-5 h-5 mr-2" />
              Download Complete Package
            </Button>
            <Button size="lg" variant="outline" className="border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black">
              <ExternalLink className="w-5 h-5 mr-2" />
              View Live Demo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}