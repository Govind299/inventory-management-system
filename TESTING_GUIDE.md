# 🧪 Complete Testing Guide - IMS Inventory Management System

## 📋 Quick Start

**URL:** http://localhost:3000  
**Login:** `admin@example.com` / `admin123`

---

## ✅ Testing Checklist (Follow This Order)

### 1️⃣ **Authentication Module**

#### Test Login
- [ ] Open http://localhost:3000
- [ ] Should redirect to `/login`
- [ ] Enter wrong credentials → Should show error toast
- [ ] Enter `admin@example.com` / `admin123` → Should login successfully
- [ ] Should redirect to `/dashboard`
- [ ] Check if user name appears in top-right ("Admin User")

#### Test Protected Routes
- [ ] Open new incognito tab
- [ ] Try to visit http://localhost:3000/dashboard directly
- [ ] Should redirect to `/login` (proves route protection works)

#### Test Logout
- [ ] Click user menu in top-right corner
- [ ] Click "Logout" button
- [ ] Should redirect to `/login`
- [ ] Should clear session

#### Test Session Persistence
- [ ] Login with credentials
- [ ] Refresh the page (F5)
- [ ] Should remain logged in (not redirect to login)

---

### 2️⃣ **Dashboard Module**

#### Test KPI Cards
- [ ] Navigate to `/dashboard`
- [ ] Verify 6 KPI cards are displayed:
  - Total Products: 1247
  - Low Stock Items: 23
  - Out of Stock: 5
  - Pending Receipts: 12
  - Pending Deliveries: 18
  - Scheduled Transfers: 7
- [ ] Check that icons display correctly
- [ ] Check color coding (warning/danger colors)

#### Test Chart
- [ ] Scroll to "Stock Movement" chart
- [ ] Verify chart shows 7 days (Mon-Sun)
- [ ] Two lines: Receipts (teal) and Deliveries (blue)
- [ ] Hover over chart → Should show tooltip with values

#### Test Recent Activity
- [ ] Check "Recent Activity" card on right
- [ ] Should show 5 recent activities
- [ ] Different icons for each type
- [ ] Timestamp displays correctly

#### Test Low Stock Table
- [ ] Scroll to "Low Stock Items" table
- [ ] Should show 5 products
- [ ] SKU, Name, Current Stock, Reorder Point columns
- [ ] Status badges (Critical/Low) display
- [ ] "Create Receipt" buttons visible

---

### 3️⃣ **Products Module**

#### Test Product List
- [ ] Navigate to `/products`
- [ ] Table shows products with columns: SKU, Name, Category, Total Stock, Available, Reorder Point
- [ ] Search box at top works
- [ ] Type "bolt" in search → Should filter to Industrial Bolt

#### Test Create Product
- [ ] Click "Add Product" button
- [ ] Modal opens
- [ ] Fill in form:
  - SKU: `TEST-001`
  - Name: `Test Product`
  - Category: `Fasteners`
  - Unit: `pcs`
  - Reorder Point: `50`
  - Reorder Quantity: `200`
- [ ] Click "Create Product"
- [ ] Modal closes
- [ ] New product appears in table
- [ ] Success toast notification shows

#### Test Validation
- [ ] Click "Add Product" again
- [ ] Leave fields empty
- [ ] Click "Create Product"
- [ ] Should show validation error

---

### 4️⃣ **Receipts Module**

#### Test Receipt List
- [ ] Navigate to `/receipts`
- [ ] Should see table with existing receipts
- [ ] Status badges visible (Draft/Validated/Pending)

#### Test Create Receipt
- [ ] Click "Create Receipt" button
- [ ] Modal opens
- [ ] Fill in:
  - Supplier: `Test Supplier Inc.`
  - Warehouse: Select "Main Warehouse"
  - Expected Date: Choose tomorrow's date
- [ ] Click "Add Product"
- [ ] Select product from dropdown
- [ ] Enter expected quantity: `100`
- [ ] Click "Create Receipt"
- [ ] New receipt appears in table
- [ ] Document number auto-generated (RCP-2024-XXX)

#### Test Validate Receipt
- [ ] Find a receipt with "Pending" status
- [ ] Click "Validate" button
- [ ] Modal opens showing products
- [ ] Enter received quantities
- [ ] Click "Preview Changes"
- [ ] Should show stock impact
- [ ] Click "Confirm Validation"
- [ ] Status changes to "Validated"
- [ ] Success toast shows

---

### 5️⃣ **Deliveries Module** ⭐ (NEW)

#### Test Delivery Stats
- [ ] Navigate to `/deliveries`
- [ ] Check 4 stat cards at top:
  - Draft Orders
  - In Progress
  - Ready to Ship
  - Shipped

#### Test Create Delivery
- [ ] Click "Create Delivery" button
- [ ] Fill in:
  - Customer Name: `Test Customer Corp`
  - Warehouse: `Main Warehouse`
  - Expected Delivery Date: Choose future date
  - Notes: `Test order`
- [ ] Click "Add Product"
- [ ] Select product: `PROD-001 - Industrial Bolt M12`
- [ ] Enter quantity: `50`
- [ ] Click "Add Product" again for second item
- [ ] Select another product, enter quantity
- [ ] Click "Create Delivery"
- [ ] New delivery appears with status "Draft"

#### Test Picking Process
- [ ] Find the delivery you just created
- [ ] Click "Start Picking" button
- [ ] Modal opens showing products
- [ ] For each product:
  - Enter picked quantity (can be ≤ ordered quantity)
  - Example: If ordered 50, enter picked: 45
- [ ] Click "Complete Picking"
- [ ] Status changes to "Packing"
- [ ] Success toast: "Picking completed. Ready for packing."

#### Test Packing Process
- [ ] Click "Continue Packing" on same delivery
- [ ] Modal shows items with picked quantities
- [ ] Enter packed quantities (≤ picked quantity)
- [ ] Click "Complete Packing"
- [ ] Status changes to "Ready to Ship"
- [ ] Success toast: "Packing completed. Ready to ship."

#### Test Shipping
- [ ] Click "Ship Order" button
- [ ] Confirmation modal shows delivery details
- [ ] Click "Confirm Ship"
- [ ] Status changes to "Shipped"
- [ ] Shipped date gets recorded
- [ ] Success toast shows

---

### 6️⃣ **Transfers Module** ⭐ (NEW)

#### Test Transfer Stats
- [ ] Navigate to `/transfers`
- [ ] Check 4 stat cards:
  - Scheduled
  - In Transit
  - Completed
  - Total Items

#### Test Create Transfer
- [ ] Click "Create Transfer" button
- [ ] Fill in:
  - From Warehouse: `Main Warehouse`
  - To Warehouse: `Regional Warehouse`
  - Scheduled Date: Choose future date
  - Notes: `Urgent restocking`
- [ ] Click "Add Product"
- [ ] Select product: `PROD-032 - Hydraulic Hose`
- [ ] Enter quantity: `25`
- [ ] Click "Create Transfer"
- [ ] New transfer appears with status "Scheduled"

#### Test Validation (Same Warehouse)
- [ ] Click "Create Transfer" again
- [ ] Set From = To = Same warehouse
- [ ] Try to create
- [ ] Should show error: "Source and destination warehouses must be different"

#### Test Ship Transfer
- [ ] Find your scheduled transfer
- [ ] Click "Ship Transfer"
- [ ] Modal shows products with requested quantities
- [ ] Shipped quantities auto-filled (can adjust)
- [ ] Click "Confirm Ship"
- [ ] Status changes to "In Transit"
- [ ] Shipped date recorded

#### Test Receive Transfer
- [ ] Click "Receive Transfer" on in-transit transfer
- [ ] Modal shows shipped quantities
- [ ] Received quantities auto-filled (can adjust for discrepancies)
- [ ] Click "Confirm Receipt"
- [ ] Status changes to "Completed"
- [ ] Received date recorded

---

### 7️⃣ **Adjustments Module** ⭐ (NEW)

#### Test Adjustment Stats
- [ ] Navigate to `/adjustments`
- [ ] Check 4 stat cards:
  - Total Adjustments
  - Pending Approval
  - Total Increase (+)
  - Total Decrease (-)

#### Test Create Adjustment
- [ ] Click "Create Adjustment" button
- [ ] Fill in:
  - Warehouse: `Main Warehouse`
  - Adjustment Type: `Cycle Count`
  - Adjustment Date: Today's date
  - Notes: `Monthly inventory check`
- [ ] Click "Add Product"
- [ ] Select product: `PROD-001 - Industrial Bolt M12`
- [ ] Shows current quantity (e.g., 500)
- [ ] Enter new quantity: `485` (15 less)
- [ ] Adjustment auto-calculates: `-15` (in red)
- [ ] Enter reason: `Physical count discrepancy`
- [ ] Click "Add Product" for another item
- [ ] Select product, enter new qty higher than current
- [ ] Adjustment shows in green (+)
- [ ] Click "Create Adjustment"
- [ ] New adjustment appears with status "Draft"

#### Test Adjustment Types
- [ ] Create adjustments with different types:
  - [ ] Damage (decrease quantity, reason: "Forklift damage")
  - [ ] Found (increase quantity, reason: "Found in alternate location")
  - [ ] Correction (either direction, reason: "Fix data entry error")

#### Test Approval
- [ ] Find a draft adjustment
- [ ] Click "Approve" button
- [ ] Confirmation modal shows:
  - Document number
  - Warehouse
  - Type badge
  - Total lines
  - Total increase/decrease
- [ ] Click "Approve Adjustment"
- [ ] Status changes to "Approved"
- [ ] Success toast shows

#### Test Type Badges
- [ ] Verify different types show different badges:
  - Cycle Count
  - Damage
  - Loss/Theft
  - Found
  - Correction

---

### 8️⃣ **Stock Ledger Module**

#### Test Ledger View
- [ ] Navigate to `/ledger`
- [ ] Table shows all stock movements
- [ ] Columns: Date/Time, Document #, Product, Location, Quantity, Balance

#### Test Document Type Filter
- [ ] Check document type badges:
  - Receipt (blue)
  - Delivery (orange)
  - Transfer (purple)
  - Adjustment (gray)
- [ ] Each links to source document number

#### Test Quantity Colors
- [ ] Positive quantities (+) in green
- [ ] Negative quantities (-) in red
- [ ] Running balance in "Balance After" column

#### Test Stats Cards
- [ ] Check entry count cards:
  - Total Receipts
  - Total Deliveries
  - Total Transfers
  - Total Adjustments

---

### 9️⃣ **Settings Module**

#### Test Warehouse Management
- [ ] Navigate to `/settings`
- [ ] See list of warehouses

#### Test Add Warehouse
- [ ] Click "Add Warehouse" button
- [ ] Fill in:
  - Name: `Test Distribution Center`
  - Code: `TDC-01`
  - Address: `123 Test St`
  - City: `Test City`
  - State: `TS`
  - ZIP: `12345`
- [ ] Click "Add Warehouse"
- [ ] New warehouse appears in list

#### Test User Profile
- [ ] Scroll to "User Profile" section
- [ ] Shows current user info (Admin User)
- [ ] Email: admin@example.com
- [ ] Role: Administrator

#### Test Password Change
- [ ] Scroll to "Security" section
- [ ] Enter:
  - Current Password: `admin123`
  - New Password: `newpass123`
  - Confirm: `newpass123`
- [ ] Click "Change Password"
- [ ] Success toast shows

---

## 🎯 Advanced Testing

### Test Search Functionality
- [ ] Products page → Search for SKU
- [ ] Deliveries page → Search by customer name
- [ ] Transfers page → Search by warehouse
- [ ] Adjustments page → Search by document number

### Test Toast Notifications
- [ ] Create actions → Success toast (green checkmark)
- [ ] Validation errors → Error toast (red X)
- [ ] Warnings → Warning toast (yellow triangle)
- [ ] Toasts auto-dismiss after 5 seconds
- [ ] Can manually close with X button

### Test Responsive Design
- [ ] Resize browser to mobile width (375px)
- [ ] Sidebar should collapse
- [ ] Tables should scroll horizontally
- [ ] Modals should be mobile-friendly
- [ ] Cards stack vertically

### Test Navigation
- [ ] Click all sidebar menu items
- [ ] Active route highlighted in sidebar
- [ ] Breadcrumbs work (if implemented)
- [ ] Browser back/forward buttons work

---

## 🐛 Bug Testing

### Test Edge Cases
- [ ] Create delivery with 0 quantity → Should prevent
- [ ] Try to ship more than picked → Should cap at picked qty
- [ ] Transfer to same warehouse → Should show error
- [ ] Empty form submission → Should show validation
- [ ] Very long product names → Should truncate/wrap
- [ ] Large numbers (9999999) → Should handle

### Test Concurrent Actions
- [ ] Open two browser tabs
- [ ] Make changes in one tab
- [ ] Refresh other tab
- [ ] Changes should persist (via mock data state)

---

## 📊 Expected Results Summary

After completing all tests, you should have:

✅ **Created:**
- 1+ Products
- 1+ Receipts (validated)
- 1+ Delivery Orders (shipped)
- 1+ Internal Transfers (completed)
- 1+ Stock Adjustments (approved)
- 1+ Warehouses

✅ **Verified:**
- All 9 modules functional
- Authentication works
- Protected routes work
- All CRUD operations work
- All workflows complete successfully
- UI responsive
- Notifications working

---

## 🎥 Demo Script (5 Minutes)

**For presentations, follow this quick demo:**

1. **Login** (30 sec)
   - Show login page, enter credentials

2. **Dashboard** (45 sec)
   - Show KPIs, chart, activity log

3. **Create Product** (30 sec)
   - Quick add a test product

4. **Create Delivery** (90 sec)
   - Show full pick→pack→ship workflow

5. **Create Transfer** (45 sec)
   - Show warehouse-to-warehouse movement

6. **Create Adjustment** (45 sec)
   - Show cycle count adjustment

7. **View Ledger** (30 sec)
   - Show complete audit trail

**Total:** 5 minutes covering all major features!

---

## 🚨 Troubleshooting

### If something doesn't work:

**App won't start:**
```bash
# Delete cache and restart
rm -rf .next
npm run dev
```

**Changes not showing:**
```bash
# Hard refresh browser
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)
```

**Login not working:**
- Make sure using exact credentials: `admin@example.com` / `admin123`
- Clear browser localStorage: F12 → Application → Local Storage → Clear

---

## ✅ Testing Complete!

Once you've checked all boxes, your IMS system is **100% verified and working!** 🎉
