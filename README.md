<p align="center">
  <br/>
  <a href="https://www.inertiapixel.com/" target="_blank"><img width="150px" src="https://www.inertiapixel.com/images/logo-min.svg" /></a>
  <h3 align="center">@inertiapixel/nexts-auth</h3>
  <p align="center">Next.js + Node.js Auth for MERN</p>
  <p align="center">Open Source. Full Stack</p>
</p>

**InertiaPixel nextjs-auth** is an open-source authentication system for Next.js. It handles credential and social login flows, maintains persistent auth state, manages redirects and protected routes, and provides hooks for login/logout lifecycle events — designed to integrate seamlessly with nodejs-auth for full-stack MERN apps.


![npm](https://img.shields.io/npm/v/@inertiapixel/nextjs-auth)
![MIT License](https://img.shields.io/npm/l/@inertiapixel/nextjs-auth)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)
![Open Source](https://img.shields.io/badge/Open%20Source-✔️-blue)
![TypeScript](https://img.shields.io/badge/Built%20with-TypeScript-3178c6?logo=typescript)

---

## Table of Contents

- [Why This Exists](#why-this-exists)
- [Features](#features)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Quick Start](#quick-start)
- [Hooks and Events](#hooks-and-events)
- [Backend Package Information](#backend-package-information)
- [License](#license)
- [Related Projects](#related-projects)

---

## Why This Exists
While building a MERN stack project, I couldn't find a well-structured package that handled both frontend and backend authentication together. Most libraries focused on either the client or the server—rarely both.

So I decided to create a pair of authentication packages under the inertiapixel scope—one for the frontend and one for the backend—designed to work seamlessly together. If you're looking for a complete authentication solution for your MERN stack project, these paired packages are for you.


```md
🔗 Use `@inertiapixel/nextjs-auth` on the frontend

🔗 Use `@inertiapixel/nodejs-auth` on the backend
```
---

## Features

- Auth context provider with typed hooks (useAuth)
- Credential-based login (email & password)
- Plug-and-play support for multiple OAuth providers (Google, Facebook, LinkedIn, etc.)
- JWT-based session handling
- Hook system to extend behavior (logging, analytics, audit, etc.)
- Built-in loading state, error state, and redirect logic
- Works perfectly with `@inertiapixel/nodejs-auth` backend package
- Prebuilt components: `<AuthProvider>`, `<Protect>`, `<SignedIn>`, `<SignedOut>`, etc.
- Lifecycle hooks (onLoginSuccess, onLoginFail, etc.)
- Fully customizable with your own UI

---

## Installation

[![npm version](https://img.shields.io/npm/v/@inertiapixel/nextjs-auth)](https://www.npmjs.com/package/@inertiapixel/nextjs-auth)

```bash
npm install @inertiapixel/nextjs-auth
```

---

## Environment Variables

Make sure to define these in your `.env` file:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET="QCqxa1M1BDk0G1WKbI+XVljv4UzCwws0dw9g5Rjb6o0="

JWT_SECRET="TBh9o9kDej2NFO3Bcab03sIiJWXNocpSIGkpdX77ARM="

NEXT_PUBLIC_API_BASE_URL=http://localhost:4000

#Social OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=949710049149-sacfunjq40ib8aatv2r0gg11c79hablk.apps.googleusercontent.com
NEXT_PUBLIC_FACEBOOK_CLIENT_ID=993713672922221
NEXT_PUBLIC_LINKEDIN_CLIENT_ID=86eg5q2n2qfqde
```

---

## Quick Start

Make AuthProvider
```tsx
//providers.tsx
'use client';

import React from 'react';
import { AuthProvider } from '@inertiapixel/nextjs-auth';

export function Providers({ children }: { children: React.ReactNode }) {

  return (
    <AuthProvider
      config={{
        apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
        apiEndpoints: {
          login: '/auth/login',
          register: '/register',
          logout: '/auth/logout',
        },

        tokenKey: 'access_token',

        socialProviders: [
          {
            provider: 'google',
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''
          },
          {
            provider: 'facebook',
            clientId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID || ''
          },
          {
            provider: 'linkedin',
            clientId: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || ''
          },
        ],

        onLoginSuccess: (user) => {
          console.log('Login success:', user);
        },
        onLoginFail: (error) => {
          console.error('Login failed:', error);
        },
        onLogout: () => {
          console.log('User logged out');
        },
      }}
    >
      {children}
    </AuthProvider>
  );
}

```

Wrap your app with the AuthProvider:

```tsx
// layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from './providers'

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <>
          <Providers>{children}</Providers>
        </>
      </body>
    </html>
  );
}

```

### Next.js API Setup (App Router)
To handle OAuth callback redirects from social providers, you must add the following API route to your Next.js app:

```tsx
// app/api/auth/[...provider]/route.ts

import { handlers } from '@inertiapixel/nextjs-auth';

export const GET = handlers({
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL!
});

```

---

## Usage

Access auth state anywhere using the useAuth() hook:
```tsx
//orders/page.tsx or dashboard/page.tsx (its protected page)
'use client';

import { useAuth, withAuth } from '@inertiapixel/nextjs-auth';
import type { ReactElement, FC } from 'react';

const OrdersPage: FC = (): ReactElement => {
  const { logout, user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Orders</h1>
      <p>Welcome to your secure orders.</p>

      <pre>
        {JSON.stringify(user)}
      </pre>
      <button
        onClick={logout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default withAuth(OrdersPage);
```
## Login
Login page example

```tsx
//login/page.txs
'use client';

import { useState } from 'react';
import { useAuth } from '@inertiapixel/nextjs-auth';

const LoginPage = () => {
  const { login, socialLogin, loginError, loading } = useAuth();
  const [email, setEmail] = useState('mdasiff007@gmail.com');
  const [password, setPassword] = useState('123456789');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ provider: 'credentials', email, password });
  };

  const handleGoogleLogin = async () => {
    await socialLogin('google');
  };

  const handleFacebookLogin = async () => {
    await socialLogin('facebook');
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {loginError && (
          <pre className="text-red-600 bg-red-50 p-2 rounded">
            {JSON.stringify(loginError, null, 2)}
          </pre>
        )}


        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full inline-flex justify-center items-center gap-2 border border-gray-300 rounded-md px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={loading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              {/* Google SVG Path */}
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          <button
            onClick={handleFacebookLogin}
            type="button"
            className="w-full inline-flex justify-center items-center gap-2 border border-gray-300 rounded-md px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={loading}
          >
            <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.675 0h-21.35C.592 0 0 .592 0 1.325v21.351C0 23.407.592 24 1.325 24H12.82v-9.294H9.692v-3.622h3.127V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.464.099 2.794.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.31h3.587l-.467 3.622h-3.12V24h6.116C23.407 24 24 23.407 24 22.676V1.325C24 .592 23.407 0 22.675 0z" />
            </svg>
            Continue with Facebook
          </button>

          <button
            onClick={() => socialLogin('linkedin')}
            type="button"
            className="w-full inline-flex justify-center items-center gap-2 border border-gray-300 rounded-md px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={loading}
          >
            <svg className="w-5 h-5 text-blue-700" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8h4v14h-4V8zm7.5 0h3.8v2h.05c.53-1 1.83-2 3.75-2 4 0 4.7 2.5 4.7 5.7V22h-4v-7.3c0-1.7-.03-3.9-2.4-3.9s-2.75 1.9-2.75 3.8V22h-4V8z" />
            </svg>
            Continue with LinkedIn
          </button>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;

```

## Hooks and Events
These optional callbacks are available via AuthProvider:

```tsx
<AuthProvider
  onLoginSuccess={(user) => console.log('Welcome', user)}
  onLoginFail={(error) => console.warn('Login error', error)}
  onLogout={() => console.log('Logged out')}
/>
```

## API Reference
`useAuth()`
Returns the following:

```ts
{
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  socialLogin: (provider: SocialProvider) => void;
  loginError: Record<string, unknown> | null;
}
```

`login(payload)`

```ts
login({
  email: 'john@example.com',
  password: '123456',
  provider: 'credentials'
});
```

`socialLogin(provider)`

```ts
socialLogin('google'); // or 'facebook', 'linkedin'
```

## Types
You can import types like:

```ts
import type { LoginPayload, User } from '@inertiapixel/nextjs-auth';
```

---

## Backend Package Information

After setting up the frontend package, you can install the companion backend package in your Node js project to complete the full authentication workflow.

[Backend Auth package](https://github.com/inertiapixel/nodejs-auth)

---

## License

MIT © [inertiapixel](https://github.com/inertiapixel)

---

## Related Projects

- [`@inertiapixel/nextjs-auth`](https://github.com/inertiapixel/nodejs-auth) — Backend auth package for Node js / Express js
- [`@inertiapixel/react-icons`](https://github.com/inertiapixel/react-icons) — React icons set


**Crafted in India by [InertiaPixel](https://www.inertiapixel.com/) 🇮🇳**
