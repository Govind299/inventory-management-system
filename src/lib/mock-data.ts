import type {
  Product,
  Category,
  Warehouse,
  Location,
  Receipt,
  Delivery,
  Transfer,
  StockAdjustment,
  StockLedgerEntry,
  KPIData,
  ActivityLog,
  User,
} from '@/types';

// ========================================
// Users
// ========================================

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'admin@ims.com',
    name: 'John Administrator',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user-2',
    email: 'manager@ims.com',
    name: 'Jane Manager',
    role: 'inventory_manager',
    warehouseId: 'wh-1',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user-3',
    email: 'staff@ims.com',
    name: 'Mike Staff',
    role: 'warehouse_staff',
    warehouseId: 'wh-1',
    createdAt: '2024-01-01T00:00:00Z',
  },
];

// ========================================
// Warehouses & Locations
// ========================================

export const mockWarehouses: Warehouse[] = [
  {
    id: 'wh-1',
    name: 'Main Warehouse',
    code: 'WH-001',
    address: '123 Industrial Park',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400001',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'wh-2',
    name: 'Secondary Warehouse',
    code: 'WH-002',
    address: '456 Storage Lane',
    city: 'Pune',
    state: 'Maharashtra',
    zipCode: '411001',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export const mockLocations: Location[] = [
  {
    id: 'loc-1',
    warehouseId: 'wh-1',
    name: 'Zone A - Rack 1',
    code: 'A-R1',
    type: 'rack',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'loc-2',
    warehouseId: 'wh-1',
    name: 'Zone A - Rack 2',
    code: 'A-R2',
    type: 'rack',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'loc-3',
    warehouseId: 'wh-2',
    name: 'Zone B - Rack 1',
    code: 'B-R1',
    type: 'rack',
    createdAt: '2024-01-01T00:00:00Z',
  },
];

// ========================================
// Categories
// ========================================

export const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Fasteners',
    description: 'Bolts, nuts, screws, washers',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-2',
    name: 'Raw Materials',
    description: 'Steel, aluminum, copper materials',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-3',
    name: 'Tools',
    description: 'Hand tools, power tools',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-4',
    name: 'Electronics',
    description: 'Electrical components',
    createdAt: '2024-01-01T00:00:00Z',
  },
];

// ========================================
// Products
// ========================================

export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    sku: 'PROD-001',
    name: 'Industrial Bolt M12',
    description: 'High-strength steel bolt M12x40mm',
    categoryId: 'cat-1',
    unit: 'pcs',
    reorderPoint: 100,
    reorderQuantity: 500,
    stockByLocation: [
      {
        productId: 'prod-1',
        locationId: 'loc-1',
        quantity: 450,
        reservedQuantity: 50,
        availableQuantity: 400,
        updatedAt: '2024-01-15T10:00:00Z',
      },
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'prod-2',
    sku: 'PROD-015',
    name: 'Steel Plate 10mm',
    description: 'Carbon steel plate 1000x2000mm',
    categoryId: 'cat-2',
    unit: 'pcs',
    reorderPoint: 50,
    reorderQuantity: 100,
    stockByLocation: [
      {
        productId: 'prod-2',
        locationId: 'loc-1',
        quantity: 125,
        reservedQuantity: 25,
        availableQuantity: 100,
        updatedAt: '2024-01-15T10:00:00Z',
      },
    ],
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'prod-3',
    sku: 'PROD-032',
    name: 'Hydraulic Hose 1/2"',
    description: 'Rubber hydraulic hose, 1/2" diameter',
    categoryId: 'cat-3',
    unit: 'meters',
    reorderPoint: 25,
    reorderQuantity: 100,
    stockByLocation: [
      {
        productId: 'prod-3',
        locationId: 'loc-1',
        quantity: 8,
        reservedQuantity: 0,
        availableQuantity: 8,
        updatedAt: '2024-01-14T10:00:00Z',
      },
    ],
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-14T10:00:00Z',
  },
];

// ========================================
// KPI Data
// ========================================

export const mockKPIData: KPIData = {
  totalProducts: 1247,
  lowStockItems: 23,
  outOfStockItems: 5,
  pendingReceipts: 12,
  pendingDeliveries: 18,
  scheduledTransfers: 7,
};

// ========================================
// Activity Logs
// ========================================

export const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    type: 'receipt',
    description: 'Receipt #RCP-2024-001 validated',
    user: 'John Doe',
    timestamp: '2024-01-15T10:30:00Z',
    documentNumber: 'RCP-2024-001',
  },
  {
    id: '2',
    type: 'delivery',
    description: 'Delivery #DEL-2024-045 shipped',
    user: 'Jane Smith',
    timestamp: '2024-01-15T09:15:00Z',
    documentNumber: 'DEL-2024-045',
  },
  {
    id: '3',
    type: 'transfer',
    description: 'Transfer #TRN-2024-012 completed',
    user: 'Mike Johnson',
    timestamp: '2024-01-15T08:00:00Z',
    documentNumber: 'TRN-2024-012',
  },
];

// ========================================
// Stock Ledger Entries
// ========================================

export const mockLedgerEntries: StockLedgerEntry[] = [
  {
    id: 'ledger-1',
    productId: 'prod-1',
    locationId: 'loc-1',
    documentType: 'receipt',
    documentId: 'rcp-1',
    documentNumber: 'RCP-2024-001',
    quantity: 500,
    balanceAfter: 450,
    createdAt: '2024-01-15T10:00:00Z',
    createdBy: 'user-1',
  },
  {
    id: 'ledger-2',
    productId: 'prod-1',
    locationId: 'loc-1',
    documentType: 'delivery',
    documentId: 'del-1',
    documentNumber: 'DEL-2024-045',
    quantity: -50,
    balanceAfter: 400,
    createdAt: '2024-01-15T14:00:00Z',
    createdBy: 'user-1',
  },
];

// ========================================
// Helper Functions
// ========================================

export function getProductById(id: string): Product | undefined {
  return mockProducts.find((p) => p.id === id);
}

export function getProductBySku(sku: string): Product | undefined {
  return mockProducts.find((p) => p.sku === sku);
}

export function getCategoryById(id: string): Category | undefined {
  return mockCategories.find((c) => c.id === id);
}

export function getWarehouseById(id: string): Warehouse | undefined {
  return mockWarehouses.find((w) => w.id === id);
}

export function getLocationById(id: string): Location | undefined {
  return mockLocations.find((l) => l.id === id);
}
