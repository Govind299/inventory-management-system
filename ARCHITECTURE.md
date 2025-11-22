# System Architecture & Sitemap

## 📐 Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     IMS Application                          │
│                  (Next.js 14 App Router)                     │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
    ┌───▼───┐         ┌─────▼─────┐       ┌────▼────┐
    │ Pages │         │ Components │       │  Styles │
    └───┬───┘         └─────┬─────┘       └────┬────┘
        │                   │                   │
        │                   │                   │
┌───────▼────────┐   ┌──────▼──────┐    ┌──────▼──────┐
│  Public Routes │   │ UI Library  │    │  Tailwind   │
│  - Login       │   │ - Button    │    │  - Tokens   │
│  - Forgot PW   │   │ - Input     │    │  - Globals  │
└────────────────┘   │ - Card      │    └─────────────┘
                     │ - Table     │
┌────────────────┐   │ - Modal     │    ┌─────────────┐
│ Protected      │   │ - Badge     │    │   Types     │
│ - Dashboard    │   │ - Toast     │    │ - Products  │
│ - Products     │   │ - KPICard   │    │ - Receipts  │
│ - Receipts     │   └─────────────┘    │ - Users     │
│ - Deliveries   │                      │ - Ledger    │
│ - Transfers    │   ┌─────────────┐    └─────────────┘
│ - Adjustments  │   │   Layout    │
│ - Ledger       │   │ - Sidebar   │    ┌─────────────┐
│ - Settings     │   │ - Topbar    │    │  API Mocks  │
└────────────────┘   │ - Main      │    │ - Products  │
                     └─────────────┘    │ - Warehouses│
                                        │ - Categories│
                                        └─────────────┘
```

---

## 🗺️ Application Sitemap

```
┌──────────────────┐
│   Root (/)       │──────► Redirect to /login
└──────────────────┘

┌──────────────────┐
│   /login         │──────► Login Page
└──────────────────┘        - Email/Password
                            - Remember Me
                            - Forgot Password Link

         ↓ (After Authentication)

┌──────────────────────────────────────────────────────┐
│              Main Application                        │
│         (With Sidebar & Topbar)                      │
└──────────────────────────────────────────────────────┘
         │
         ├─► /dashboard        Dashboard
         │   ├─ KPI Cards (6)
         │   ├─ Stock Movement Chart
         │   ├─ Recent Activity
         │   └─ Low Stock Items Table
         │
         ├─► /products         Products Module
         │   ├─ Product List Table
         │   ├─ Search & Filters
         │   ├─ Create Product Modal
         │   └─ Product Details (future)
         │
         ├─► /receipts         Receipts Module
         │   ├─ Receipt List
         │   ├─ Create Receipt Flow
         │   ├─ Validate Receipt
         │   └─ Receipt Details (future)
         │
         ├─► /deliveries       Deliveries Module (planned)
         │   ├─ Delivery List
         │   ├─ Create Delivery
         │   ├─ Pick Items
         │   ├─ Pack Items
         │   └─ Ship Order
         │
         ├─► /transfers        Transfers Module (planned)
         │   ├─ Transfer List
         │   ├─ Create Transfer
         │   ├─ Schedule Transfer
         │   └─ Receive Transfer
         │
         ├─► /adjustments      Adjustments Module (planned)
         │   ├─ Adjustment List
         │   ├─ Create Adjustment
         │   ├─ Cycle Count
         │   └─ Damage Report
         │
         ├─► /ledger          Stock Ledger
         │   ├─ Ledger Entries Table
         │   ├─ Filters by Type/Date
         │   ├─ Export to CSV
         │   └─ Entry Details
         │
         └─► /settings        Settings
             ├─ Warehouses Management
             ├─ Locations Management
             ├─ User Profile
             └─ Security/Password
```

---

## 🔄 User Workflows

### 1. Receipt Flow
```
Start ──► Create Receipt ──► Add Products ──► Enter Expected Qty
          └─ Supplier Info       │
          └─ Warehouse           │
          └─ Expected Date       │
                                 ▼
         Save Draft ◄──────── Review
                                 │
                                 ▼
                          Wait for Delivery
                                 │
                                 ▼
         Receive Items ──► Enter Received Qty ──► Preview Changes
                                                         │
                                                         ▼
         Validate ──► Confirm ──► Stock Updated ──► Ledger Entry Created
```

### 2. Product Creation Flow
```
Start ──► Click "Add Product"
            │
            ▼
         Fill Form ──► Enter Details
         ├─ SKU*            │
         ├─ Name*           │
         ├─ Description     │
         ├─ Category*       │
         ├─ Unit*           │
         ├─ Reorder Point   │
         └─ Reorder Qty     │
                            ▼
                         Validate
                            │
                            ▼
         Save ──► Product Created ──► Toast Notification
                      │
                      ▼
                  Add to Table
```

### 3. Dashboard View Flow
```
Login ──► Dashboard
           │
           ├─► View KPIs ──► See Real-time Stats
           │                 ├─ Total Products
           │                 ├─ Low Stock Items
           │                 ├─ Out of Stock
           │                 ├─ Pending Receipts
           │                 ├─ Pending Deliveries
           │                 └─ Scheduled Transfers
           │
           ├─► View Chart ──► Stock Movement (7 days)
           │                  ├─ Receipts Line
           │                  └─ Deliveries Line
           │
           ├─► Activity Log ──► Recent Actions
           │                    ├─ Receipt validated
           │                    ├─ Delivery shipped
           │                    └─ Product created
           │
           └─► Low Stock ──► View Items Below Reorder Point
                             └─► Create Receipt (Quick Action)
```

---

## 🎨 Component Hierarchy

```
App
└─ RootLayout
   ├─ Font (Inter)
   └─ Global Styles

   Public Routes:
   └─ LoginPage
      ├─ Input (Email)
      ├─ Input (Password)
      └─ Button (Submit)

   Protected Routes:
   └─ MainLayout
      ├─ Sidebar
      │  ├─ Navigation Items
      │  └─ Collapse Toggle
      │
      ├─ Topbar
      │  ├─ Search Input
      │  ├─ Notifications
      │  └─ User Menu
      │
      └─ Page Content
         ├─ Dashboard
         │  ├─ KPICard × 6
         │  ├─ Card (Chart)
         │  │  └─ AreaChart (Recharts)
         │  ├─ Card (Activity)
         │  └─ Card (Low Stock Table)
         │     └─ Table
         │
         ├─ Products
         │  ├─ Card (Search)
         │  │  └─ Input
         │  ├─ Card (Table)
         │  │  └─ Table
         │  └─ Modal (Create Product)
         │     ├─ Input × Multiple
         │     └─ Button × 2
         │
         ├─ Receipts
         │  ├─ Card (Filters)
         │  ├─ Card (Table)
         │  ├─ Modal (Create)
         │  └─ ConfirmModal (Validate)
         │
         ├─ Ledger
         │  ├─ Card (Stats) × 4
         │  └─ Card (Table)
         │
         └─ Settings
            ├─ Card (Warehouses)
            ├─ Card (Profile)
            ├─ Card (Security)
            └─ Modal (Add Warehouse)
```

---

## 🔌 Data Flow

```
Component
    │
    ├──► State (useState)
    │     - Local UI state
    │     - Form data
    │
    ├──► Props
    │     - Data from parent
    │     - Event handlers
    │
    └──► API Call (Future)
          │
          ├──► Mock Data (Current)
          │     - src/lib/mock-data.ts
          │     - Static JSON
          │
          └──► Real API (To Implement)
                │
                ├──► POST /api/products
                ├──► GET  /api/receipts
                ├──► POST /api/receipts/:id/validate
                └──► etc...
                      │
                      ▼
                  Backend Server
                      │
                      ▼
                   Database
```

---

## 🌐 Technology Stack Layers

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  - Next.js Pages (App Router)           │
│  - React Components                     │
│  - Tailwind CSS                         │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│         Component Layer                 │
│  - UI Components (Button, Input, etc.)  │
│  - Layout Components (Sidebar, Topbar)  │
│  - Radix UI Primitives                  │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│         Business Logic Layer            │
│  - API Contracts (TypeScript)           │
│  - Data Validation (Zod - future)       │
│  - State Management (React State)       │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│         Data Layer (Current: Mock)      │
│  - Mock Data                            │
│  - Helper Functions                     │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│         Data Layer (Future: API)        │
│  - REST API Calls                       │
│  - Authentication                       │
│  - Error Handling                       │
└─────────────────────────────────────────┘
```

---

## 📊 State Management

```
Current Approach: Local State (useState)

Component State
    │
    ├─► Form Inputs
    │   - Controlled components
    │   - Validation state
    │
    ├─► UI State
    │   - Modal open/closed
    │   - Loading states
    │   - Error messages
    │
    └─► Data State
        - Fetched data (mock)
        - Search queries
        - Filter selections

Future: Consider Zustand/Redux
    - Global auth state
    - User preferences
    - Cart/selections
```

---

This architecture provides a clean separation of concerns and is ready for backend integration.
