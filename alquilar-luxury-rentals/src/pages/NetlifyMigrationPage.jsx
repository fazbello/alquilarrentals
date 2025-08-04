import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, CheckCircle, Github, Globe } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CodeBlock = ({ content, language }) => {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-7 w-7"
        onClick={copyToClipboard}
      >
        {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
      </Button>
      <pre className="bg-slate-800 rounded-md p-4 overflow-x-auto">
        <code className={`language-${language} text-sm text-white`}>{content}</code>
      </pre>
    </div>
  );
};

export default function NetlifyMigrationPage() {

  const instructions = [
    "Clone your repository: git clone https://github.com/fazbello/alquilar.git",
    "Navigate into the directory: cd alquilar",
    "Create all the files listed below by copying the content from each tab.",
    "Install dependencies: npm install",
    "Set up your Neon database and get the connection string.",
    "Create a .env.local file (copy from the .env.example tab) and add your connection string and other secrets.",
    "Push the database schema to Neon: npx prisma db push",
    "Run the development server: npm run dev",
    "Deploy to Netlify by connecting your GitHub repository."
  ];

  const packageJson = `{
  "name": "alquilar-fazbello",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.3",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "@prisma/client": "^5.7.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "nodemailer": "^6.9.7",
    "stripe": "^14.9.0",
    "tailwindcss": "^3.3.6",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "lucide-react": "^0.294.0",
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-select": "^2.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "embla-carousel-react": "^8.0.0-rc17",
    "date-fns": "^2.30.0",
    "react-hook-form": "^7.48.2"
  },
  "devDependencies": {
    "prisma": "^5.7.0",
    "eslint": "8.54.0",
    "eslint-config-next": "14.0.3"
  }
}`;

  const envExample = `# Database (Neon) - Get this from your Neon project dashboard
DATABASE_URL="postgresql://user:password@ep-random-chars.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Authentication - Generate a long, random string for the secret
JWT_SECRET="YOUR_SUPER_SECRET_JWT_KEY_AT_LEAST_32_CHARACTERS_LONG"

# The base URL of your deployed application
NEXTAUTH_URL="http://localhost:3000"

# Stripe API Keys
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
`;

  const prismaSchema = `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id              String    @id @default(cuid())
  email           String    @unique
  fullName        String
  password        String
  role            String    @default("user")
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  bookings        Booking[]
}

model Car {
  id              String    @id @default(cuid())
  make            String
  model           String
  year            Int
  category        String
  dailyRate       Decimal   @db.Decimal(10, 2)
  status          String    @default("available")
  licensePlate    String    @unique
  images          String[]
  specifications  Json?
  location        Json?
  bookings        Booking[]
}

model Booking {
  id                String    @id @default(cuid())
  userId            String
  carId             String
  bookingReference  String    @unique
  startDate         DateTime
  endDate           DateTime
  totalAmount       Decimal   @db.Decimal(10, 2)
  status            String    @default("pending")
  paymentStatus     String    @default("pending")
  user              User      @relation(fields: [userId], references: [id])
  car               Car       @relation(fields: [carId], references: [id])
  createdAt         DateTime  @default(now())
}`;

  const apiLogin = `// File: pages/api/auth/login.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({ token, user: userWithoutPassword });

  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}`;

  const apiRegister = `// File: pages/api/auth/register.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: 'User created successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}`;


  return (
    <div className="bg-slate-900 text-white min-h-screen p-4 sm:p-6 lg:p-8">
      <Card className="max-w-4xl mx-auto bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center gap-4">
            <Github /> Migration Guide for {`github.com/fazbello/alquilar`}
          </CardTitle>
          <CardDescription className="text-slate-400">
            Follow these steps to set up your independent Next.js application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 bg-blue-900/50 border-blue-500 text-blue-300">
            <AlertTitle>Instructions</AlertTitle>
            <AlertDescription>
              <ol className="list-decimal list-inside space-y-1 mt-2">
                {instructions.map((step, i) => <li key={i}>{step}</li>)}
              </ol>
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="package" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-slate-700">
              <TabsTrigger value="package">package.json</TabsTrigger>
              <TabsTrigger value="env">.env.example</TabsTrigger>
              <TabsTrigger value="prisma">prisma/schema.prisma</TabsTrigger>
              <TabsTrigger value="api-login">api/auth/login.js</TabsTrigger>
              <TabsTrigger value="api-register">api/auth/register.js</TabsTrigger>
            </TabsList>
            <TabsContent value="package"><CodeBlock content={packageJson} language="json" /></TabsContent>
            <TabsContent value="env"><CodeBlock content={envExample} language="bash" /></TabsContent>
            <TabsContent value="prisma"><CodeBlock content={prismaSchema} language="prisma" /></TabsContent>
            <TabsContent value="api-login"><CodeBlock content={apiLogin} language="javascript" /></TabsContent>
            <TabsContent value="api-register"><CodeBlock content={apiRegister} language="javascript" /></TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <p className="text-slate-400">Once your local setup is complete, deploy to Netlify.</p>
            <a href="https://www.netlify.com/" target="_blank" rel="noopener noreferrer">
              <Button className="mt-2 bg-teal-500 hover:bg-teal-600 text-white">
                <Globe className="mr-2 h-4 w-4" /> Go to Netlify
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}