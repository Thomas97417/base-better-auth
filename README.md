# 🧩 Next.js Web App Starter Template

This repository provides a modern, feature-rich template to kickstart your web application development with built-in authentication, subscription payments, and admin capabilities.

Built with the latest technologies, this boilerplate is designed to help developers ship production-ready applications with a solid foundation:

- **Next.js 15** – App router, server actions, and enhanced routing features
- **React 19** – Concurrent rendering, hooks, and the latest React features
- **ShadCN UI** – Beautifully styled and accessible UI components using Tailwind CSS
- **Prisma ORM** – Type-safe database access with an intuitive schema-driven workflow
- **Authentication** – Secure user authentication with role-based access control
- **Admin Dashboard** – Full-featured admin panel to manage users and data
- **Stripe Integration** – Subscription payment processing with multiple pricing tiers
- **Email Service** – Transactional emails using Resend
- **Database Support** – Works with PostgreSQL locally or cloud providers
- **TypeScript** – Full type safety across the entire codebase
- **Responsive Design** – Mobile-first UI that works on all devices

---

Whether you're building a SaaS product, an internal dashboard, or a side project, this starter saves you weeks of development time by providing:

- Complete authentication flow with protected routes
- User management with admin controls
- Subscription billing with Stripe
- Email notifications for key events
- Responsive layouts and components
- Dark mode support
- Production-ready infrastructure

## 🚀 Getting Started

Start the development server:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action.

---

## 🛠️ Create a local PostgreSQL database (instructions below) or use a cloud-based provider like:

- [Supabase](https://supabase.com)
- [Neon](https://neon.tech)
- [Railway](https://railway.app)
- [Render](https://render.com)

Just make sure to update your `.env` file with the correct `DATABASE_URL`.

> ⚠️ The following steps are **only for developers who want to set up a PostgreSQL database locally**.

### On macOS:

```bash
brew update
brew install postgresql
brew services start postgresql
```

Switch to the PostgreSQL user:

```bash
sudo -i -u postgres
```

Start the PostgreSQL interactive terminal:

```bash
psql
```

Create a new database:

```sql
CREATE DATABASE your_database_name;
```

(Optionally) create a new user:

```sql
CREATE USER your_user WITH PASSWORD 'your_password';
```

Grant privileges to that user:

```sql
GRANT ALL PRIVILEGES ON DATABASE your_database_name TO your_user;
```

Exit `psql`:

```sql
\q
```

---

### On Windows:

1. Download the installer from [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
2. Run the installer and follow the steps (PgAdmin is optional but recommended if you prefer a GUI)
3. Keep the credentials you set during installation (default user is usually `postgres`)

---

## 🧬 Prisma Setup with Better-Auth

Generate the necessary Prisma files and push the schema to your database:

```bash
npx prisma generate
npx @better-auth/cli generate
npx prisma db push
```

If the Subscription model is not automatically added to your schema.prisma file, you can manually copy it from this source:
https://github.com/Thomas97417/base-better-auth/blob/main/prisma/schema.prisma

(Optional) Open Prisma Studio:

```bash
npx prisma studio
```

> **Note:** Do **not** use `prisma migrate` with Better Auth. Use `generate` and `push` instead.

---

## 🔐 OAuth Setup (GitHub & Google)

To enable social login, you’ll need to configure OAuth credentials for both **GitHub** and **Google**.

---

### 🚀 GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click on **"New OAuth App"**
3. Fill in the following fields:
   - **Application name:** (e.g. Your App Name)
   - **Homepage URL:** `http://localhost:3000`
   - **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github`
4. After creating the app, you’ll get:
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
5. Add them to your `.env` file:
   ```env
   GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_client_secret
   ```

---

### 🌐 Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Navigate to **APIs & Services > Credentials**
4. Click **"Create Credentials" > "OAuth 2.0 Client IDs"**
5. Configure the OAuth consent screen if you haven’t already
6. Fill in the following:
   - **Application type:** Web application
   - **Authorized JavaScript origins:** `http://localhost:3000`
   - **Authorized redirect URIs:** `http://localhost:3000/api/auth/callback/google`
7. After creating, you’ll get:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
8. Add them to your `.env` file:
   ```env
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   ```

---

## 📧 Resend API Setup (Transactional Emails)

To enable transactional emails in your project, you'll need a `RESEND_API_KEY`.

### 🛠️ Steps to get your Resend API Key:

1. Go to [https://resend.com](https://resend.com) and create an account (or log in).
2. Once logged in, go to your [API Keys dashboard](https://resend.com/api-keys).
3. Click **"Create API Key"**, give it a name (e.g., `Local Dev Key`), and select the appropriate permissions (usually "Full Access" for development).
4. Copy the generated API key.

### 🧪 (Optional) Add and verify a domain

If you plan to send emails from a custom domain:

- Go to **"Domains"** in the Resend dashboard.
- Click **"Add Domain"**, enter your domain name, and follow the DNS configuration instructions.
- Domain verification may take a few minutes to a few hours depending on your DNS provider.

### ➕ Add to your `.env` file:

```env
RESEND_API_KEY=your_resend_api_key
```

> 📝 Don’t forget to restart your dev server after updating the `.env` file.

---

## 💳 Stripe Setup

To use Stripe in your project, you’ll need the following keys:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

### Get your API key:

Go to your Stripe dashboard: [https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)

### Set up your webhook for local testing:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### 💼 Stripe Subscription Setup – Creating Products and Pricing Tiers

To enable **subscription-based billing** in your application, you need to create one or more **products with recurring pricing plans** in your Stripe dashboard.

These subscriptions will define the tiers your users can subscribe to (e.g., Basic, Pro, Premium).

---

### ➕ Create a Subscription Product

1. Go to your [Stripe Dashboard](https://dashboard.stripe.com/)
2. In the left sidebar, click on **"Products"**
3. Click the **"Add product"** button
4. Fill in the following details:
   - **Name:** (e.g., `Pro Plan`, `Premium Subscription`, etc.)
   - **Description:** Optional, but recommended to clearly describe the subscription offering
5. During product creation, click **"Add pricing plan"**

> 📌 Each product represents a type of **subscription** your users can sign up for.

---

### 💰 Add Recurring Pricing (Subscription Tiers)

For each subscription tier you want to offer, add a **recurring pricing plan**:

- **Type:** Recurring
- **Billing period:** Choose between Monthly or Yearly (or both)
- **Price:** Set the cost of the subscription (e.g., $10/month, $30/month, etc.)

You can add multiple prices to the same product to support both monthly and yearly billing options.

After creating each pricing plan, Stripe will generate a unique **Price ID** (e.g., `price_ABC123...`) that you'll use in your code.

---

### 📄 Add the Price IDs to your `constant.ts` or `.env` File

To connect your frontend and backend logic with Stripe, store the Price IDs in your environment variables or constants file:

```env
STRIPE_PRICE_ID_BASIC=price_xxxxxxxxxxxx
STRIPE_PRICE_ID_PRO=price_yyyyyyyyyyyy
STRIPE_PRICE_ID_PREMIUM=price_zzzzzzzzzzzz
```

> 📝 Rename the keys as needed based on your subscription logic (e.g., BASIC, PRO, PREMIUM, etc.)

---

### 🪙 Stripe Token Purchase Setup – One-Time Payments

In addition to subscriptions, your application can also offer users the ability to **buy tokens** via **one-time payments**. This is useful for pay-as-you-go models where users consume tokens for specific actions (e.g., API usage, content generation, etc.).

---

### ➕ Create a Token Purchase Product

1. Go to your [Stripe Dashboard](https://dashboard.stripe.com/)
2. In the sidebar, click on **"Products"**
3. Click **"Add product"**
4. Fill in the product details:
   - **Name:** (e.g., `100 Tokens`, `500 Tokens`, `1000 Tokens`, etc.)
   - **Description:** Optional, describe what the token package includes
5. Under **Pricing**, choose:
   - **Type:** One-time
   - **Price:** Set the price based on the number of tokens (e.g., $5 for 100 tokens)

Repeat this process for each token package you want to offer.

After creation, Stripe will assign a unique **Price ID** to each one-time pricing option.

---

### 📄 Add the Token Price IDs to `constant.ts`

In your codebase, you should have a `PACKAGE_TOKENS` array defined in `constant.ts`. Add the corresponding `priceId`s to this array to make the packages available in your frontend.

### ✅ You’re now ready to link your pricing tiers with your frontend/backend logic using these `priceId`s!

## 🌐 Environment Variable for Production Deployment

When deploying your application to a production environment—such as Vercel, Netlify, Render, or any other hosting provider; you must define the `NEXT_PUBLIC_VERCEL_URL` environment variable.

### 🔧 Why this variable is important

The `NEXT_PUBLIC_VERCEL_URL` environment variable represents the public URL of your deployed application. It is used for:

- Generating absolute URLs (e.g., OAuth callbacks, email links)
- Redirects and external service callbacks
- General use in frontend components that require the site URL

If not set correctly, some features like authentication, email verification links, or third-party integrations might break or behave unpredictably.

### 🛠️ How to set it up

You need to add the following key to your environment variables configuration on your hosting provider:

```env
NEXT_PUBLIC_VERCEL_URL=https://your-domain.com
```

## 🔐 OAuth Providers Setup for Production

When moving your application to production, you **must create new OAuth applications** for both GitHub and Google. This is necessary because the redirect URIs and authorized domains must exactly match your production environment.

### 🚀 GitHub OAuth – Production Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click on **"New OAuth App"**
3. Fill in the following fields:
   - **Application name:** (e.g. Your App Name)
   - **Homepage URL:** `https://your-domain.com`
   - **Authorization callback URL:** `https://your-domain.com/api/auth/callback/github`
4. After creating the app, you’ll get:
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`

### 🌐 Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Navigate to **APIs & Services > Credentials**
4. Click **"Create Credentials" > "OAuth 2.0 Client IDs"**
5. Configure the OAuth consent screen if you haven’t already
6. Fill in the following:
   - **Application type:** Web application
   - **Authorized JavaScript origins:** `https://your-domain.com
   - **Authorized redirect URIs:** `https://your-domain.com/api/auth/callback/google`
7. After creating, you’ll get:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
