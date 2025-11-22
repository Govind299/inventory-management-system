# IMS - Modern Inventory Management System

A production-quality, fully functional UI/UX MVP for a Modular Inventory Management System. Built with Next.js 14, React, TypeScript, and Tailwind CSS.

## 🎯 Overview

This system digitizes and streamlines all stock operations across a business, replacing manual logs, Excel sheets, and ad-hoc tracking with a modern, intuitive interface.

## ✨ Features

### Core Modules

- **Dashboard** - Real-time inventory snapshot with KPI cards, charts, and activity timeline
- **Products** - Complete product management with SKU, categories, and reordering rules
- **Receipts** - Incoming stock management with supplier tracking and validation
- **Deliveries** - Outgoing orders with picking, packing, and shipping workflows
- **Transfers** - Internal stock transfers between warehouses/locations
- **Adjustments** - Stock adjustments for cycle counts, damage, and corrections
- **Stock Ledger** - Complete audit trail of all stock movements
- **Settings** - Warehouse, location, and user profile management

### UI/UX Highlights

- **Professional Design** - Clean, neutral color palette (Deep Teal #117A65 accent)
- **Fully Responsive** - Mobile, tablet, and desktop optimized
- **Accessible** - WCAG AA compliant with keyboard navigation and screen reader support
- **Micro-interactions** - Smooth animations and transitions (100-200ms)
- **Confirmation Flows** - Preview + confirmation for all stock-affecting actions
- **Real-time Feedback** - Toast notifications with undo capabilities

## 🎨 Design System

### Color Palette

```css
Background: #F6F7F9
Surface: #FFFFFF
Primary (Accent): #117A65
Text Primary: #0F1724
Text Secondary: #475569
Border: #E6E9EE
Warning: #D97706
Danger: #B91C1C
Success: #0F9D58
Info: #0EA5E9
```

### Typography

- **Font:** Inter
- **Base Size:** 14px
- **Scale:** 12/13/14/15/16/20/24px

### Spacing System

4px grid: 4 / 8 / 12 / 16 / 24 / 32 / 48

## 🏗️ Architecture

```
src/
├── app/                    # Next.js 14 App Router
│   ├── dashboard/         # Dashboard page
│   ├── products/          # Products module
│   ├── receipts/          # Receipts module
│   ├── deliveries/        # Deliveries module
│   ├── transfers/         # Transfers module
│   ├── adjustments/       # Adjustments module
│   ├── ledger/            # Stock ledger
│   ├── settings/          # Settings
│   ├── login/             # Authentication
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home redirect
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Table.tsx
│   │   ├── Modal.tsx
│   │   ├── Badge.tsx
│   │   ├── Toast.tsx
│   │   └── KPICard.tsx
│   └── layout/            # Layout components
│       ├── Sidebar.tsx
│       ├── Topbar.tsx
│       └── MainLayout.tsx
├── lib/
│   ├── design-tokens.ts   # Design system tokens
│   ├── api-contracts.ts   # API contracts
│   └── mock-data.ts       # Sample data
├── types/
│   └── index.ts           # TypeScript types
└── styles/
    └── globals.css        # Global styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Modern browser with ES6 support

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run Storybook (component library)
npm run storybook
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Default Login Credentials

```
Admin:
Email: admin@ims.com
Password: (any password 6+ characters)

Inventory Manager:
Email: manager@ims.com
Password: (any password 6+ characters)

Warehouse Staff:
Email: staff@ims.com
Password: (any password 6+ characters)
```

## 📚 API Contracts

All API endpoints are documented in `src/lib/api-contracts.ts` with TypeScript interfaces for:

- Request/Response types
- Authentication flows
- CRUD operations
- Stock movement operations

### Sample API Endpoints

```
POST   /api/auth/login
POST   /api/auth/password-reset/request
GET    /api/products
POST   /api/products
POST   /api/products/import
POST   /api/receipts
POST   /api/receipts/:id/validate
POST   /api/deliveries
POST   /api/deliveries/:id/ship
POST   /api/transfers
POST   /api/adjustments
GET    /api/ledger
```

## 🧩 Component Library

### Core UI Components

- **Button** - Primary, Secondary, Tertiary, Danger, Ghost variants
- **Input** - With label, error states, icons, and helper text
- **Card** - Surface container with optional padding and hover effects
- **Table** - Sortable, filterable with loading states
- **Modal** - Dialog system with backdrop and animations
- **Badge** - Status indicators with color variants
- **Toast** - Notification system with auto-dismiss and actions
- **KPICard** - Dashboard stat cards with trends and sparklines

### Layout Components

- **Sidebar** - Collapsible navigation with active state
- **Topbar** - Search, notifications, and user menu
- **MainLayout** - Wrapper combining sidebar and topbar

## 🎯 Key Workflows

### Receipt Flow
1. Create Receipt → Add Products → Enter Expected Qty
2. Receive Items → Enter Received Qty
3. Validate → Stock Increases → Ledger Entry Created

### Delivery Flow
1. Create Delivery → Pick Items → Pack Items
2. Validate/Ship → Stock Decreases → Tracking Number

### Transfer Flow
1. Create Transfer → Select Source/Destination
2. Schedule → Ship → Receive → Stock Moves

### Adjustment Flow
1. Select Product + Location → Enter Counted Qty
2. System Calculates Difference → Confirm → Ledger Updated

## 📱 Responsive Design

- **Mobile (< 768px):** Single column, drawer navigation
- **Tablet (768px - 1024px):** 2-column grid, sidebar visible
- **Desktop (> 1024px):** Full layout with 3-column dashboard

## ♿ Accessibility

- WCAG AA contrast ratios
- Keyboard navigation (Tab, Enter, Escape)
- ARIA labels and roles
- Screen reader announcements
- Focus visible states
- Error message announcements

## 🧪 Testing

### QA Checklist

- [ ] All pages responsive across devices
- [ ] Stock actions show preview + confirmation
- [ ] Ledger accurately tracks all movements
- [ ] No console errors or warnings
- [ ] Forms validate inputs properly
- [ ] Keyboard navigation works
- [ ] Screen reader accessible

## 📦 Production Deployment

```bash
# Build optimized production bundle
npm run build

# Test production build locally
npm start

# Deploy to Vercel (recommended)
vercel --prod
```

## 🛠️ Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI (accessible primitives)
- **Charts:** Recharts
- **Icons:** Lucide React
- **State:** Zustand (minimal)
- **Forms:** React Hook Form + Zod
- **Date:** date-fns

## 📄 License

© 2024 IMS. All rights reserved.

## 🤝 Contributing

This is an MVP demonstration project. For production use, integrate with your backend API by replacing mock data in `src/lib/mock-data.ts` with actual API calls.

## 📞 Support

For questions or issues, please refer to the documentation or contact the development team.

---

**Built with ❤️ for modern inventory management**
