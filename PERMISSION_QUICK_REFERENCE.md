# Quick Permission Reference Card

## 🔐 Role Comparison at a Glance

### Login Credentials
```
Admin: admin@example.com / admin123
User:  user@example.com / user123
```

---

## ✅ What Each Role Can Do

### 📦 **PRODUCTS**
| Action | Admin | User |
|--------|:-----:|:----:|
| View/Search | ✅ | ✅ |
| Create New | ✅ | ❌ |
| Edit Existing | ✅ | ❌ |
| Delete | ✅ | ❌ |
| Export CSV | ✅ | ✅ |
| Import CSV | ✅ | ❌ |

**User Limitation**: Cannot modify product catalog

---

### 📥 **RECEIPTS**
| Action | Admin | User |
|--------|:-----:|:----:|
| View All | ✅ | ✅ |
| Create Receipt | ✅ | ✅ |
| Validate Receipt | ✅ | ✅ |
| Delete | ✅ | ❌ |

**Key**: Both can create & validate (stock increases)

---

### 📤 **DELIVERIES**
| Action | Admin | User |
|--------|:-----:|:----:|
| View All | ✅ | ✅ |
| Create Delivery | ✅ | ✅ |
| Pick/Pack/Ship | ✅ | ✅ |
| Cancel/Delete | ✅ | ❌ |

**User Limitation**: Cannot cancel orders

---

### 🔄 **TRANSFERS**
| Action | Admin | User |
|--------|:-----:|:----:|
| View All | ✅ | ✅ |
| Create Transfer | ✅ | ✅ |
| Ship/Receive | ✅ | ✅ |
| Cancel/Delete | ✅ | ❌ |

**User Limitation**: Cannot cancel transfers

---

### ⚖️ **ADJUSTMENTS** ⭐ BIGGEST DIFFERENCE
| Action | Admin | User |
|--------|:-----:|:----:|
| View All | ✅ | ✅ |
| Create Adjustment | ✅ | ✅ |
| **Approve** | ✅ | ❌ |
| Delete | ✅ | ❌ |

**Critical**: User creates, Admin approves!

---

### 📊 **STOCK LEDGER**
| Action | Admin | User |
|--------|:-----:|:----:|
| View Entries | ✅ | ✅ |
| Search/Filter | ✅ | ✅ |
| Export CSV | ✅ | ✅ |

**Equal Access**: Both roles have full read access

---

### ⚙️ **SETTINGS** ⭐ ADMIN ONLY
| Action | Admin | User |
|--------|:-----:|:----:|
| Access Settings Page | ✅ | ❌ |
| Manage Warehouses | ✅ | ❌ |
| Add/Edit/Delete WH | ✅ | ❌ |
| System Config | ✅ | ❌ |

**Critical**: Users cannot see Settings at all!

---

## 🎯 Quick Decision Guide

### "Can I create this?"
- **Products**: Admin only
- **Everything else**: Both roles

### "Can I approve this?"
- **Adjustments**: Admin only
- **Receipts (Validate)**: Both roles

### "Can I delete this?"
- **Anything**: Admin only
- **Nothing**: User cannot delete

### "Can I import data?"
- **Product CSV**: Admin only
- **Nothing else**: No imports for users

### "Can I access Settings?"
- **Admin**: Yes, full access
- **User**: No, page hidden completely

---

## 📝 Real Testing Scenarios

### Scenario 1: Daily Receipt Processing
1. **User** creates receipt for incoming goods ✅
2. **User** validates receipt (stock updates) ✅
3. Both roles can do this equally

### Scenario 2: Stock Count Discrepancy
1. **User** creates adjustment ✅
2. **User** tries to approve ❌ (button hidden)
3. **Admin** logs in and approves ✅
4. Stock corrects automatically

### Scenario 3: New Product Setup
1. **User** tries to create product ❌ (button hidden)
2. **Admin** logs in
3. **Admin** creates product ✅
4. Now **User** can create receipts for it ✅

### Scenario 4: Warehouse Management
1. **User** looks for Settings ❌ (not in sidebar)
2. **Admin** goes to Settings ✅
3. **Admin** adds new warehouse ✅
4. Now both roles can use it in operations

---

## 🚨 Common Questions

**Q: Why can't users delete anything?**
A: Prevents accidental data loss. Only admins should remove records.

**Q: Why can't users approve adjustments?**
A: Ensures oversight. Prevents unauthorized stock changes.

**Q: Can users see what admins create?**
A: Yes! Users can view everything, just cannot modify master data.

**Q: What happens if user tries to access Settings?**
A: The menu item is hidden. Direct URL access will redirect.

**Q: Can users export data?**
A: Yes! Both roles can export Products and Ledger to CSV.

---

## 🧪 5-Minute Test Script

### Test 1: Login as Admin
```
✅ See Settings in sidebar
✅ Create a product (TEST-001)
✅ Create an adjustment (Cycle Count)
✅ Approve the adjustment
✅ Delete test product
```

### Test 2: Login as User
```
❌ Settings NOT in sidebar
❌ Cannot create product (button hidden)
✅ Can create receipt
✅ Can validate receipt
✅ Create adjustment
❌ Cannot approve (button hidden)
```

### Test 3: Approval Workflow
```
1. Login as User → Create adjustment
2. Logout → Login as Admin
3. See pending adjustment
4. Approve it ✅
5. Stock updates automatically
```

---

## 💡 Remember

**Admin** = Manager (full control)
**User** = Warehouse Worker (operations only)

**The Rule**:
- Users can **process** daily operations
- Admins can **approve** and **configure**
- Only admins can **delete** anything
- Only admins see **Settings**

---

**Print this card and keep it near your workstation!** 📌
