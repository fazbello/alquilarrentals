import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, CheckCircle, Github, Globe, KeyRound, Database, ExternalLink } from 'lucide-react';
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
    <div className="relative my-4">
      <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={copyToClipboard}>
        {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-slate-400" />}
      </Button>
      <pre className="bg-slate-800 rounded-md p-4 overflow-x-auto text-sm">
        <code className={`language-${language} text-white`}>{content}</code>
      </pre>
    </div>
  );
};

export default function NetlifyMigrationPage() {
  
  // Component content for each file
  const packageJson = `{
  "name": "alquilar-clerk-migration",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@clerk/nextjs": "^4.29.3",
    "@prisma/client": "^5.7.0",
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-progress": "^1.0.3",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-tabs": "^1.0.4",
    "autoprefixer": "10.4.16",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "date-fns": "^2.30.0",
    "embla-carousel-react": "^8.0.0-rc17",
    "lucide-react": "^0.294.0",
    "next": "14.0.3",
    "postcss": "8.4.32",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-hook-form": "^7.48.2",
    "tailwind-merge": "^2.1.0",
    "tailwindcss": "3.3.6"
  },
  "devDependencies": {
    "eslint": "8.55.0",
    "eslint-config-next": "14.0.3",
    "prisma": "^5.7.0"
  }
}`;

  const envExample = `# Clerk Authentication
# Get these from your Clerk Dashboard: https://dashboard.clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Neon Database (or other PostgreSQL provider)
# Get this from your database provider dashboard
DATABASE_URL="postgresql://user:password@ep-random-chars.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Stripe (Optional)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
`;

  const middlewareJs = `import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: [
    '/',
    '/browse-cars',
    '/support',
    '/api/webhooks/stripe' // Example of a public API route
  ],
  // Routes that can be accessed while signed in but not protected
  // (e.g., for optional user sessions)
  ignoredRoutes: [],
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
`;

  const appJs = `import { ClerkProvider } from '@clerk/nextjs'
import '../styles/globals.css' // Make sure you have a globals.css file

function MyApp({ Component, pageProps }) {
  return (
    <ClerkProvider {...pageProps}>
      <Component {...pageProps} />
    </ClerkProvider>
  )
}

export default MyApp
`;

  const layoutJs = `import React from "react";
import Link from "next/link";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import { Car, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button"; // Assuming shadcn components are in src/components

export default function Layout({ children, currentPageName }) {
  const { isSignedIn } = useUser();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'All Inventory', href: '/browse-cars' },
    { name: 'My Bookings', href: '/my-bookings' },
    { name: 'Payments', href: '/payments' },
    { name: 'Support', href: '/support' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="bg-slate-900/80 backdrop-blur-lg sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Alquilar.co.uk</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href} className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10">
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-4">
              {isSignedIn ? (
                <UserButton afterSignOutUrl="/" />
              ) : (
                <SignInButton mode="modal">
                  <Button className="bg-amber-500 hover:bg-amber-600 text-black">
                    Login
                  </Button>
                </SignInButton>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-slate-300 hover:text-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>
          {isMenuOpen && (
            <div className="md:hidden py-4 space-y-2">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href} className="block px-4 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-white/10">
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>
      <main>{children}</main>
      {/* Add your footer component here */}
    </div>
  );
}`;

  return (
    <div className="p-4 md:p-8 space-y-8 bg-slate-900 text-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white flex items-center gap-3">
              <Globe className="text-amber-400" />
              Alquilar Migration to Netlify & Clerk
            </CardTitle>
            <CardDescription className="text-slate-400">
              Follow these steps to create a downloadable, production-ready version of your app with Clerk for authentication.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="bg-amber-500/10 border-amber-500/30 text-amber-300 mb-6">
              <KeyRound className="h-4 w-4 text-amber-400" />
              <AlertTitle>Prerequisites</AlertTitle>
              <AlertDescription>
                You will need accounts for <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="underline font-bold">GitHub</a>, <a href="https://clerk.com" target="_blank" rel="noopener noreferrer" className="underline font-bold">Clerk</a>, <a href="https://neon.tech" target="_blank" rel="noopener noreferrer" className="underline font-bold">Neon</a> (or another Postgres provider), and <a href="https://netlify.com" target="_blank" rel="noopener noreferrer" className="underline font-bold">Netlify</a>.
              </AlertDescription>
            </Alert>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Step-by-Step Instructions</h3>
              <ol className="list-decimal list-inside space-y-2 text-slate-300">
                <li>Create a new folder on your computer named `alquilar-app`.</li>
                <li>Inside this folder, initialize a new Next.js project: `npx create-next-app@latest .`</li>
                <li>Create the files listed in the tabs below by copying the code into your project. Overwrite existing files if necessary.</li>
                <li>Install all required dependencies by running `npm install` in your terminal.</li>
                <li>Create your Clerk application and Neon database to get your API keys and connection string.</li>
                <li>Create a `.env.local` file in the root of your project and copy the content from the `.env.local.example` tab, filling in your secret keys.</li>
                <li>Push your code to your `github.com/fazbello/alquilar` repository.</li>
                <li>Connect your GitHub repository to Netlify and deploy!</li>
              </ol>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="package" className="mt-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-white/10">
            <TabsTrigger value="package">package.json</TabsTrigger>
            <TabsTrigger value="env">.env.local.example</TabsTrigger>
            <TabsTrigger value="middleware">middleware.js</TabsTrigger>
            <TabsTrigger value="layout">Layout Component</TabsTrigger>
          </TabsList>

          <TabsContent value="package">
            <Card className="bg-white/5 border-white/10"><CardHeader><CardTitle>package.json</CardTitle><CardDescription>Project dependencies and scripts. Copy this into `package.json`.</CardDescription></CardHeader><CardContent><CodeBlock content={packageJson} language="json" /></CardContent></Card>
          </TabsContent>
          
          <TabsContent value="env">
            <Card className="bg-white/5 border-white/10"><CardHeader><CardTitle>.env.local.example</CardTitle><CardDescription>Environment variables template. Create a `.env.local` file and paste this content, then fill in your secrets.</CardDescription></CardHeader><CardContent><CodeBlock content={envExample} language="bash" /></CardContent></Card>
          </TabsContent>
          
          <TabsContent value="middleware">
            <Card className="bg-white/5 border-white/10"><CardHeader><CardTitle>middleware.js</CardTitle><CardDescription>This file protects your application's routes. Create it in the root of your project (or in `src/` if you use a src directory).</CardDescription></CardHeader><CardContent><CodeBlock content={middlewareJs} language="javascript" /></CardContent></Card>
          </TabsContent>

          <TabsContent value="layout">
            <Card className="bg-white/5 border-white/10"><CardHeader><CardTitle>Layout Component</CardTitle><CardDescription>Replace your existing Layout component with this Clerk-aware version.</CardDescription></CardHeader><CardContent><CodeBlock content={layoutJs} language="jsx" /></CardContent></Card>
          </TabsContent>
        </Tabs>
        
        <Alert className="mt-8 bg-green-500/10 border-green-500/30 text-green-300">
           <CheckCircle className="h-4 w-4 text-green-400" />
           <AlertTitle>Next Steps</AlertTitle>
           <AlertDescription>
             After setting up these core files, you will need to create your page components (`dashboard.js`, `browse-cars.js`, etc.) and the Prisma schema for your database. You can copy the code for these from the other pages in this app. Remember to replace all `react-router-dom` `<Link>` components with `next/link` `<Link>`.
           </AlertDescription>
        </Alert>

      </div>
    </div>
  );
}