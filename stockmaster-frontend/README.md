# StockMaster Frontend

Modern, responsive Next.js frontend for the StockMaster Inventory Management System.

## Technology Stack

- **Framework**: Next.js 16.0.3 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Forms**: React Hook Form
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios

## Features

### ✅ Complete Pages

1. **Authentication** - Login/Register with JWT
2. **Dashboard** - KPIs, Charts, Low Stock Alerts
3. **Products** - Full CRUD with search/filter
4. **Warehouses** - Location management
5. **Stock** - Real-time inventory tracking
6. **Receipts** - Incoming stock management
7. **Deliveries** - Outgoing stock management

## Getting Started

### Prerequisites
- Node.js 18+
- Backend running on `http://localhost:8080`

### Installation

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Test Account
```
Email: ayush@stockmaster.com
Password: ayush123
```

## Project Structure

```
app/                    # Pages (login, dashboard, products, etc.)
components/             # Reusable components (Layout, ProtectedRoute)
lib/                    # API client with Axios
store/                  # Zustand state management
types/                  # TypeScript interfaces
```

## Key Features

- 🔐 JWT Authentication with auto-refresh
- 📊 Real-time dashboard analytics
- 🔍 Advanced search and filtering
- 📦 Multi-item receipts/deliveries
- 🎨 Responsive design (mobile/tablet/desktop)
- ⚡ Fast builds with Turbopack
- 🎯 Type-safe with TypeScript

## API Integration

All endpoints integrated via `lib/api.ts`:
- Auth, Products, Warehouses, Stock
- Dashboard, Receipts, Deliveries
- Automatic JWT token injection
- Global error handling

---

**Built with Next.js 16 + TypeScript + Tailwind CSS**
