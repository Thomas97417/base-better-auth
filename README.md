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

## 💼 Stripe Product & Pricing Setup (Subscription Tiers)

To set up subscription tiers for your app, you'll need to create a product and pricing plans in your Stripe dashboard.

### 🛠️ Steps to Create a Product and Tiers in Stripe:

1. Go to your [Stripe Dashboard](https://dashboard.stripe.com/)
2. In the left sidebar, click on **"Products"**
3. Click the **"Add product"** button

### ➕ Create a Product:

- **Name:** (e.g., `Pro Plan`, `Premium Subscription`, etc.)
- **Description:** Optional, but helpful to identify the product
- Click **"Add pricing plan"** during product creation

### 💰 Add Pricing (Tiers):

For each tier you want to support, add a pricing plan:

- **Type:** Recurring
- **Billing period:** Monthly or yearly, depending on your model
- **Price:** Set according to your tier (e.g., $10/month, $30/month, etc.)

You can add multiple prices to the same product (e.g., one for monthly, one for yearly).

Once created, each pricing plan will have a unique **Price ID** (looks like `price_ABC123...`).

---

### 📄 Update your `constant.ts` file with the Price IDs:

```env
STRIPE_PRICE_ID_1=price_xxxxxxxxxxxx
STRIPE_PRICE_ID_2=price_yyyyyyyyyyyy
STRIPE_PRICE_ID_3=price_zzzzzzzzzzzz
```

> 📝 Rename the keys as needed based on your subscription logic (e.g., BASIC, PRO, PREMIUM, etc.)

---

### ✅ You’re now ready to link your pricing tiers with your frontend/backend logic using these `priceId`s!
