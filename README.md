# Brain² Research Peptides — Full Stack MERN Application

A complete e-commerce platform for research peptides with real-time SSE notifications, admin panel, email notifications, and image upload via Multer.

---

## Project Structure

```
brain2-peptides/
├── backend/                  # Node.js + Express + MongoDB
│   ├── controllers/          # Business logic
│   ├── middleware/           # Auth + Multer
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API routes
│   ├── utils/               # SSE + Email helpers
│   ├── uploads/             # Product images (auto-created)
│   ├── server.js            # Entry point
│   ├── seed.js              # Seed initial products
│   └── .env.example         # Environment variables
│
└── frontend/                 # React 18 + React Router v6
    └── src/
        ├── components/
        │   └── common/       # Navbar, Footer, CartDrawer, ProductCard, Icons
        ├── context/          # AuthContext, CartContext
        ├── hooks/            # useSSENotifications
        ├── pages/
        │   ├── shop/         # Home, Shop, Product, Checkout, About, Quality, Contact
        │   └── admin/        # Login, Dashboard, Products, Orders, Subscribers, Notifications
        └── utils/            # Axios API instance
```

---

## Setup Instructions

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and SMTP credentials
npm install
npm run dev
```

**Seed products (first time):**
```bash
node seed.js
```

**Default admin credentials:**
- Email: `admin@brain2peptides.com`
- Password: `Admin@123`

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on: `http://localhost:3000`
Backend runs on: `http://localhost:5000`

---

## Environment Variables (backend/.env)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/brain2peptides
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=30d

# Admin seeded on first startup
ADMIN_EMAIL=admin@brain2peptides.com
ADMIN_PASSWORD=Admin@123

# SMTP (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_app_password_here
FROM_EMAIL=noreply@brain2peptides.com

CLIENT_URL=http://localhost:3000
```

> **Gmail tip:** Enable 2FA → generate an App Password → use that as SMTP_PASS

---

## API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/auth/login | Public |
| GET | /api/auth/me | Protected |
| PUT | /api/auth/change-password | Protected |

### Products
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/products | Public |
| GET | /api/products/:slug | Public |
| GET | /api/products/admin/all | Admin |
| POST | /api/products | Admin |
| PUT | /api/products/:id | Admin |
| DELETE | /api/products/:id | Admin |

### Orders
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/orders | Public |
| GET | /api/orders | Admin |
| GET | /api/orders/stats/dashboard | Admin |
| GET | /api/orders/:id | Admin |
| PUT | /api/orders/:id/status | Admin |

### Subscribers
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/subscribers | Public |
| GET | /api/subscribers | Admin |
| DELETE | /api/subscribers/:id | Admin |

### Notifications
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/notifications | Admin |
| POST | /api/notifications | Admin |
| PUT | /api/notifications/mark-all-read | Admin |
| PUT | /api/notifications/:id/read | Admin |
| DELETE | /api/notifications/:id | Admin |

### SSE (Real-time)
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/sse/notifications | Public |

---

## Features

### Shop (Frontend)
- **Homepage** — Hero section with sci-fi blue design, featured products carousel, feature highlights
- **Shop Page** — All products with search, category filter, pagination
- **Product Detail** — Full product page with trust badges and add-to-cart
- **Cart Drawer** — Slide-in cart with quantity controls
- **Checkout** — Customer info + shipping form, order confirmation
- **Quality Page** — 6-step process + standards
- **About Page** — Brand story, values, stats
- **Contact Page** — Contact form + info

### Admin Panel
- **Dashboard** — Revenue, total orders, pending orders, active products, recent orders table
- **Products** — Full CRUD with image upload (Multer), featured toggle, all product flags
- **Orders** — Table with inline status update dropdown, order detail modal
- **Subscribers** — Email list management with stats
- **Notifications** — Send real-time SSE notifications + optional email to all subscribers

### SSE Notification System
- Admin panel connects to `/api/sse/notifications` via EventSource
- New orders → instant push to admin panel with toast notification
- Notification broadcasts → instant push to all connected browsers
- Product additions → instant admin notification
- Auto-reconnects on connection drop (5 second delay)
- Unread badge count on notification bell

### Email System (Nodemailer)
- Order confirmation email to customer on new order
- Bulk notification email to all active subscribers when admin sends a notification with email toggle enabled
- Dark-themed HTML email templates

---

## Technology Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, React Router v6, Axios, React Hot Toast |
| Styling | Tailwind CSS + Custom CSS (dark sci-fi theme) |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose ODM |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Real-time | Server-Sent Events (SSE) |
| Email | Nodemailer (SMTP) |
| File Upload | Multer (disk storage) |
| Icons | Custom SVG icon library (no emoji) |

---

## Design

- **Theme:** Dark sci-fi blue (`#020817` background, `#3b82f6` accent)
- **Font:** Inter (Google Fonts)
- **Icons:** Custom SVG components — no emoji, no icon libraries
- **Images:** Hero background uses provided sci-fi vial image
- **Logo:** Brain² capsule design with P·R branding
- **Cards:** Glassmorphism style with blue glow on hover

---

*For research use only. Not for human consumption.*
