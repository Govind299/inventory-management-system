# Role-Based Access Control & User Testing Guide

## 👥 User Roles Overview

### **Admin Role** (admin@example.com / admin123)
- **Full System Access** - Complete control over all features
- Can perform ALL operations without restrictions

### **User Role** (user@example.com / user123)
- **Limited Access** - Read-only for sensitive operations
- Cannot delete, cannot access settings, restricted workflows

---

## 📋 Feature Access Comparison

| Feature | Admin Can Do | User Can Do | User Cannot Do |
|---------|-------------|------------|----------------|
| **Dashboard** | ✅ View all KPIs & charts | ✅ View all KPIs & charts | ❌ N/A - Full access |
| **Products** | ✅ Create, Edit, Delete<br>✅ Import/Export CSV<br>✅ View all products | ✅ View all products<br>✅ Search products<br>✅ Export CSV | ❌ Create new products<br>❌ Edit products<br>❌ Delete products<br>❌ Import CSV |
| **Receipts** | ✅ Create receipts<br>✅ Validate receipts<br>✅ Delete receipts | ✅ Create receipts<br>✅ Validate receipts<br>✅ View all receipts | ❌ Delete receipts |
| **Deliveries** | ✅ Create deliveries<br>✅ Pick items<br>✅ Pack items<br>✅ Ship orders<br>✅ Cancel deliveries | ✅ Create deliveries<br>✅ Pick items<br>✅ Pack items<br>✅ Ship orders | ❌ Cancel/delete deliveries |
| **Transfers** | ✅ Create transfers<br>✅ Ship transfers<br>✅ Receive transfers<br>✅ Cancel transfers | ✅ Create transfers<br>✅ Ship transfers<br>✅ Receive transfers | ❌ Cancel/delete transfers |
| **Adjustments** | ✅ Create adjustments<br>✅ **Approve adjustments**<br>✅ Delete adjustments | ✅ Create adjustments<br>✅ View adjustments | ❌ **Approve adjustments**<br>❌ Delete adjustments |
| **Stock Ledger** | ✅ View all entries<br>✅ Search & filter<br>✅ Export CSV | ✅ View all entries<br>✅ Search & filter<br>✅ Export CSV | ❌ N/A - Full access |
| **Settings** | ✅ **Full access**<br>✅ Add/edit/delete warehouses<br>✅ Manage all users<br>✅ System configuration | ❌ **No access to Settings page** | ❌ Cannot access Settings<br>❌ Cannot manage warehouses<br>❌ Cannot manage users |

---

## 🧪 Testing Guide: Admin vs User

### **Test 1: Login & Dashboard**

**Admin Testing:**
```
1. Go to http://localhost:3000
2. Login: admin@example.com / admin123
3. ✅ See full dashboard with all metrics
4. ✅ Notice "Settings" in sidebar
```

**User Testing:**
```
1. Logout if logged in
2. Login: user@example.com / user123
3. ✅ See same dashboard
4. ❌ "Settings" option hidden in sidebar
```

---

### **Test 2: Products Module**

**Admin Testing:**
```
1. Navigate to Products
2. ✅ Click "Add Product" button (visible)
3. ✅ Create new product with SKU: TEST-001
4. ✅ Click "Import CSV" button (visible)
5. ✅ Click "Export" (works)
6. ✅ Hover over product row - see "Delete" option
```

**User Testing:**
```
1. Navigate to Products
2. ❌ "Add Product" button is HIDDEN
3. ❌ "Import CSV" button is HIDDEN
4. ✅ "Export" button visible (can export)
5. ✅ Can search products
6. ❌ No delete option on hover
7. ❌ Cannot edit products (no edit button)
```

---

### **Test 3: Receipts Module**

**Admin Testing:**
```
1. Navigate to Receipts
2. ✅ Click "Create Receipt"
3. ✅ Add supplier, date, warehouse
4. ✅ Add multiple items
5. ✅ Create receipt successfully
6. ✅ Click "Validate" button on pending receipt
7. ✅ Stock increases automatically
8. ✅ Can delete receipts (delete option visible)
```

**User Testing:**
```
1. Navigate to Receipts
2. ✅ Click "Create Receipt" (allowed)
3. ✅ Can add items and create
4. ✅ Can validate receipts (stock updates)
5. ❌ No delete option available
6. ❌ Cannot cancel validated receipts
```

**Key Difference:**
- **Admin**: Full control, can delete/cancel
- **User**: Can create & validate but cannot delete

---

### **Test 4: Deliveries Module**

**Admin Testing:**
```
1. Navigate to Deliveries
2. ✅ Create new delivery order
3. ✅ Pick items (status: Picking)
4. ✅ Pack items (status: Packing)
5. ✅ Ship order (status: Shipped)
6. ✅ Can cancel delivery before shipping
7. ✅ Can delete draft deliveries
```

**User Testing:**
```
1. Navigate to Deliveries
2. ✅ Create new delivery order
3. ✅ Complete pick → pack → ship workflow
4. ❌ Cannot cancel deliveries
5. ❌ Cannot delete deliveries
```

**Key Difference:**
- **Admin**: Can cancel/delete at any stage
- **User**: Can process but cannot cancel/delete

---

### **Test 5: Transfers Module**

**Admin Testing:**
```
1. Navigate to Transfers
2. ✅ Create transfer (WH-001 → WH-002)
3. ✅ Ship transfer
4. ✅ Receive at destination
5. ✅ Can cancel before completion
6. ✅ Can delete draft transfers
```

**User Testing:**
```
1. Navigate to Transfers
2. ✅ Create transfer
3. ✅ Ship and receive
4. ❌ Cannot cancel transfers
5. ❌ Cannot delete transfers
```

---

### **Test 6: Adjustments Module** ⭐ **BIGGEST DIFFERENCE**

**Admin Testing:**
```
1. Navigate to Adjustments
2. ✅ Create adjustment (e.g., Cycle Count)
3. ✅ Enter system qty: 100, actual qty: 95
4. ✅ Status shows "Pending Approval"
5. ✅ Click "Approve" button (visible to admin only)
6. ✅ Status changes to "Approved"
7. ✅ Stock updates automatically
8. ✅ Can delete adjustments
```

**User Testing:**
```
1. Navigate to Adjustments
2. ✅ Create adjustment
3. ✅ Enter quantities
4. ✅ Save adjustment
5. ❌ "Approve" button is HIDDEN
6. ❌ Cannot approve adjustments (admin-only)
7. ❌ Cannot delete adjustments
8. ℹ️ Can only create and view
```

**Key Difference:**
- **Admin**: Creates AND approves (full control)
- **User**: Creates only, waits for admin approval

---

### **Test 7: Stock Ledger**

**Admin Testing:**
```
1. Navigate to Stock Ledger
2. ✅ View all stock movements
3. ✅ Search by product/document
4. ✅ Filter by type (receipt, delivery, etc.)
5. ✅ Export to CSV
6. ✅ See all transactions
```

**User Testing:**
```
1. Navigate to Stock Ledger
2. ✅ Same access as admin
3. ✅ Can search, filter, export
4. ✅ Full read access
```

**Key Difference:**
- **None** - Both roles have equal access (read-only for both)

---

### **Test 8: Settings Module** ⭐ **ADMIN ONLY**

**Admin Testing:**
```
1. Navigate to Settings
2. ✅ See "Settings" option in sidebar
3. ✅ View all warehouses
4. ✅ Click "Add Warehouse"
5. ✅ Create warehouse (WH-003, "Regional Hub")
6. ✅ Edit existing warehouse
7. ✅ Delete warehouse
8. ✅ Update profile name
9. ✅ Change password
```

**User Testing:**
```
1. Look for Settings in sidebar
2. ❌ Settings option is COMPLETELY HIDDEN
3. ❌ Cannot access /settings URL directly
4. ❌ No warehouse management
5. ✅ Can update own profile (if profile page added)
6. ✅ Can change own password (if profile page added)
```

**Key Difference:**
- **Admin**: Full Settings access
- **User**: No Settings page at all (complete restriction)

---

## 🔐 Permission Matrix

### Create Operations
| Module | Admin | User |
|--------|-------|------|
| Products | ✅ | ❌ |
| Receipts | ✅ | ✅ |
| Deliveries | ✅ | ✅ |
| Transfers | ✅ | ✅ |
| Adjustments | ✅ | ✅ |
| Warehouses | ✅ | ❌ |

### Edit Operations
| Module | Admin | User |
|--------|-------|------|
| Products | ✅ | ❌ |
| Receipts | ✅ | ⚠️ Validate only |
| Deliveries | ✅ | ⚠️ Process only |
| Transfers | ✅ | ⚠️ Process only |
| Adjustments | ✅ | ❌ |
| Warehouses | ✅ | ❌ |

### Delete Operations
| Module | Admin | User |
|--------|-------|------|
| Products | ✅ | ❌ |
| Receipts | ✅ | ❌ |
| Deliveries | ✅ | ❌ |
| Transfers | ✅ | ❌ |
| Adjustments | ✅ | ❌ |
| Warehouses | ✅ | ❌ |

### Approve Operations
| Module | Admin | User |
|--------|-------|------|
| Adjustments | ✅ | ❌ |
| Receipts (Validate) | ✅ | ✅ |

### Export Operations
| Module | Admin | User |
|--------|-------|------|
| Products CSV | ✅ | ✅ |
| Ledger CSV | ✅ | ✅ |

### Import Operations
| Module | Admin | User |
|--------|-------|------|
| Products CSV | ✅ | ❌ |

---

## 🎯 Real-World Scenarios

### Scenario 1: New Product Arrival
**Admin workflow:**
1. Create product in Products module ✅
2. Create receipt with quantities ✅
3. Validate receipt ✅
4. Stock updated automatically ✅

**User workflow:**
1. ❌ Cannot create product (ask admin)
2. Create receipt for existing product ✅
3. Validate receipt ✅
4. Stock updated automatically ✅

### Scenario 2: Stock Discrepancy Found
**Admin workflow:**
1. Go to Adjustments
2. Create "Cycle Count" adjustment
3. Enter actual quantity
4. Approve immediately ✅
5. Stock corrected ✅

**User workflow:**
1. Go to Adjustments
2. Create "Cycle Count" adjustment
3. Enter actual quantity
4. ❌ Cannot approve (waits for admin)
5. Admin must login and approve
6. Then stock corrects

### Scenario 3: New Warehouse Setup
**Admin workflow:**
1. Go to Settings
2. Add warehouse details
3. Warehouse active immediately ✅

**User workflow:**
1. ❌ Cannot access Settings
2. Must request admin to add warehouse

---

## 📱 User Interface Differences

### Sidebar Menu
**Admin sees:**
- Dashboard
- Products
- Receipts
- Deliveries
- Transfers
- Adjustments
- Stock Ledger
- **Settings** ⭐

**User sees:**
- Dashboard
- Products
- Receipts
- Deliveries
- Transfers
- Adjustments
- Stock Ledger
- ~~Settings~~ (hidden)

### Action Buttons
**Admin sees:**
- "Add Product" button
- "Import CSV" button
- "Delete" buttons on items
- "Approve" button on adjustments
- "Add Warehouse" button
- All edit/delete icons

**User sees:**
- No "Add Product" button
- No "Import CSV" button
- No delete buttons
- No "Approve" button
- No warehouse management
- Limited action buttons

---

## 🧪 Quick Test Checklist

### Test as Admin (5 minutes)
- [ ] Login as admin@example.com
- [ ] Create a product
- [ ] Create a receipt and validate
- [ ] Create an adjustment and approve
- [ ] Go to Settings and add warehouse
- [ ] Export products to CSV
- [ ] Delete a test item

### Test as User (5 minutes)
- [ ] Logout and login as user@example.com
- [ ] Try to create product (button hidden) ❌
- [ ] Create receipt and validate ✅
- [ ] Create adjustment (cannot approve) ⚠️
- [ ] Try to access Settings (hidden) ❌
- [ ] Export products to CSV ✅
- [ ] Try to delete item (no option) ❌

### Switch Between Roles
- [ ] Login as admin, create pending adjustment
- [ ] Logout
- [ ] Login as user, verify cannot approve
- [ ] Logout
- [ ] Login as admin, approve the adjustment
- [ ] Verify stock updated

---

## 💡 Key Takeaways

### Admin = Full Control
- Can do **everything**
- Approves adjustments
- Manages system settings
- Has delete permissions
- Can import data

### User = Operational Worker
- Can **process** transactions (receipts, deliveries, transfers)
- Can **create** adjustments (but not approve)
- Can **view** everything (read access)
- Can **export** data for reports
- **Cannot** modify master data (products, warehouses)
- **Cannot** delete anything
- **No** access to Settings

### The Approval Workflow
This is the **most important** difference:

1. **User creates** adjustment for stock discrepancy
2. **Admin reviews** and approves/rejects
3. **System updates** stock only after admin approval

This ensures accountability and prevents unauthorized stock changes!

---

## 🎓 Training Summary

**Tell warehouse staff (Users):**
- "You can process all daily operations"
- "You cannot delete anything - ask admin"
- "Your adjustments need admin approval"
- "You cannot add new products or warehouses"

**Tell managers (Admins):**
- "You have full control"
- "Review and approve adjustments daily"
- "You manage product catalog and warehouses"
- "Only you can delete records"

---

**Current Status**: Role-based permissions are **ready for implementation**
**Next Step**: Add permission checks to UI components based on user role
