# 📦 Inventory Management System (IMS)

A modern, full-featured inventory management system built with Next.js 14, TypeScript, and Tailwind CSS. Features role-based access control, real-time stock tracking, and comprehensive warehouse management.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![License](https://img.shields.io/badge/License-MIT-green)

## 🚀 Features

### Core Functionality
- ✅ **Product Management** - Create, edit, delete products with SKU tracking
- ✅ **Stock Receipts** - Record incoming inventory with validation
- ✅ **Deliveries** - Manage outgoing stock with picking/packing workflow
- ✅ **Transfers** - Inter-warehouse stock transfers
- ✅ **Adjustments** - Stock adjustments with approval workflow
- ✅ **Stock Ledger** - Complete audit trail of all stock movements
- ✅ **Warehouse Management** - Multi-warehouse support

### Advanced Features
- 🔐 **Role-Based Access Control** (Admin & User roles)
- 📊 **Real-time Dashboard** with KPIs and analytics
- 📥 **CSV Import/Export** for bulk operations
- 🔍 **Advanced Search & Filtering**
- 📱 **Responsive Design** - Works on all devices
- 🎨 **Modern UI** with custom design system

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS 3.4, Custom Design Tokens
- **Database:** JSON Server (development), easily replaceable
- **State:** React Context API
- **Icons:** Lucide React
- **Charts:** Recharts

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/inventory-management-system.git
cd inventory-management-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Servers

```bash
npm run dev
```

This runs both Next.js (port 3000) and JSON Server (port 3001) concurrently.

### 4. Access the Application

- **Frontend:** http://localhost:3000
- **API:** http://localhost:3001

### 5. Login Credentials

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`

**User Account:**
- Email: `user@example.com`
- Password: `user123`

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── dashboard/         # Dashboard page
│   ├── products/          # Product management
│   ├── receipts/          # Stock receipts
│   ├── deliveries/        # Delivery orders
│   ├── transfers/         # Stock transfers
│   ├── adjustments/       # Stock adjustments
│   ├── ledger/           # Stock ledger
│   └── settings/         # System settings
├── components/
│   ├── layout/           # Layout components
│   └── ui/              # Reusable UI components
├── contexts/            # React contexts (Auth, etc.)
├── services/            # API service layer
├── utils/              # Utility functions
└── styles/             # Global styles

db.json                 # JSON Server database
```

## 🔐 Role-Based Permissions

### Admin Can:
- ✅ Create/edit/delete products
- ✅ Import/export CSV
- ✅ Approve adjustments
- ✅ Manage warehouses
- ✅ Access all settings
- ✅ Full CRUD on all modules

### User Can:
- ✅ View all data
- ✅ Create receipts, deliveries, transfers
- ✅ Create adjustments (but NOT approve)
- ✅ Export data
- ❌ Cannot create/edit products
- ❌ Cannot approve adjustments
- ❌ Cannot access settings

## 📊 Available Scripts

```bash
npm run dev          # Run both Next.js and JSON Server
npm run next         # Run Next.js only
npm run db           # Run JSON Server only
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🗄️ Database

The project uses JSON Server for development. Data is stored in `db.json` with the following collections:

- `products` - Product master data
- `receipts` - Incoming stock records
- `deliveries` - Outgoing deliveries
- `transfers` - Inter-warehouse transfers
- `adjustments` - Stock adjustments
- `ledgerEntries` - Stock movement history
- `warehouses` - Warehouse master
- `users` - User accounts
- `categories` - Product categories

### Replace with Real Database

To use a real database (PostgreSQL, MongoDB, etc.), replace the API calls in `src/services/api.ts` with your backend endpoints.

## 🎨 Design System

Custom design tokens defined in `src/lib/design-tokens.ts`:

- **Colors:** Primary (Deep Teal), Surface, Background, Text hierarchy
- **Typography:** Inter font, responsive sizing
- **Spacing:** Consistent 4px grid system
- **Components:** Reusable Button, Input, Card, Modal, Badge, Table

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🧪 Testing

### Manual Testing

Follow the testing guide in `USER_TESTING_GUIDE.md` for comprehensive test scenarios.

### Quick Test

1. Login as admin
2. Create a product
3. Create a receipt and validate
4. Check stock ledger for entry
5. Create an adjustment and approve
6. Login as user and verify limited access

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Manual Deployment

```bash
npm run build
npm start
```

## 🔧 Configuration

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📝 Documentation

- `IMPLEMENTATION_SUMMARY.md` - Complete feature overview
- `USER_TESTING_GUIDE.md` - Testing scenarios
- `PERMISSION_QUICK_REFERENCE.md` - Role permissions
- `COMPONENTS.md` - Component documentation

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ for CHARUSAT Hackathon SPIT

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS
- Lucide for beautiful icons

---

**⭐ Star this repo if you find it helpful!**
