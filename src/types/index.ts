export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'inventory_manager' | 'warehouse_staff';
  warehouseId?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  categoryId: string;
  category?: Category;
  unit: string;
  reorderPoint?: number;
  reorderQuantity?: number;
  stockByLocation: StockLocation[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  createdAt: string;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  isActive: boolean;
  createdAt: string;
}

export interface Location {
  id: string;
  warehouseId: string;
  warehouse?: Warehouse;
  name: string;
  code: string;
  type: 'zone' | 'aisle' | 'rack' | 'bin';
  parentId?: string;
  createdAt: string;
}

export interface StockLocation {
  productId: string;
  locationId: string;
  location?: Location;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  updatedAt: string;
}

export interface Receipt {
  id: string;
  receiptNumber: string;
  supplierId?: string;
  supplierName?: string;
  warehouseId: string;
  warehouse?: Warehouse;
  status: 'draft' | 'waiting' | 'ready' | 'done' | 'cancelled';
  expectedDate: string;
  receivedDate?: string;
  lines: ReceiptLine[];
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReceiptLine {
  id: string;
  receiptId: string;
  productId: string;
  product?: Product;
  locationId: string;
  location?: Location;
  expectedQuantity: number;
  receivedQuantity: number;
  unitPrice?: number;
}

export interface Delivery {
  id: string;
  deliveryNumber: string;
  customerId?: string;
  customerName?: string;
  warehouseId: string;
  warehouse?: Warehouse;
  status: 'draft' | 'waiting' | 'ready' | 'picked' | 'packed' | 'shipped' | 'cancelled';
  scheduledDate: string;
  shippedDate?: string;
  lines: DeliveryLine[];
  trackingNumber?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryLine {
  id: string;
  deliveryId: string;
  productId: string;
  product?: Product;
  locationId: string;
  location?: Location;
  orderedQuantity: number;
  pickedQuantity: number;
  packedQuantity: number;
  shippedQuantity: number;
}

export interface Transfer {
  id: string;
  transferNumber: string;
  sourceWarehouseId: string;
  sourceWarehouse?: Warehouse;
  destinationWarehouseId: string;
  destinationWarehouse?: Warehouse;
  status: 'draft' | 'scheduled' | 'in_transit' | 'done' | 'cancelled';
  scheduledDate: string;
  shippedDate?: string;
  receivedDate?: string;
  lines: TransferLine[];
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransferLine {
  id: string;
  transferId: string;
  productId: string;
  product?: Product;
  sourceLocationId: string;
  sourceLocation?: Location;
  destinationLocationId: string;
  destinationLocation?: Location;
  quantity: number;
  receivedQuantity: number;
}

export interface StockAdjustment {
  id: string;
  adjustmentNumber: string;
  warehouseId: string;
  warehouse?: Warehouse;
  type: 'cycle_count' | 'damage' | 'correction' | 'other';
  reason: string;
  lines: AdjustmentLine[];
  status: 'draft' | 'done' | 'cancelled';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdjustmentLine {
  id: string;
  adjustmentId: string;
  productId: string;
  product?: Product;
  locationId: string;
  location?: Location;
  systemQuantity: number;
  countedQuantity: number;
  difference: number;
}

export interface StockLedgerEntry {
  id: string;
  productId: string;
  product?: Product;
  locationId: string;
  location?: Location;
  documentType: 'receipt' | 'delivery' | 'transfer_in' | 'transfer_out' | 'adjustment';
  documentId: string;
  documentNumber: string;
  quantity: number;
  balanceAfter: number;
  createdAt: string;
  createdBy: string;
}

export interface KPIData {
  totalProducts: number;
  lowStockItems: number;
  outOfStockItems: number;
  pendingReceipts: number;
  pendingDeliveries: number;
  scheduledTransfers: number;
}

export interface ActivityLog {
  id: string;
  type: 'receipt' | 'delivery' | 'transfer' | 'adjustment' | 'product_created';
  description: string;
  user: string;
  timestamp: string;
  documentId?: string;
  documentNumber?: string;
}

export interface ChartData {
  date: string;
  receipts: number;
  deliveries: number;
  adjustments: number;
}

export type DocumentStatus = 
  | 'draft' 
  | 'waiting' 
  | 'ready' 
  | 'picked' 
  | 'packed' 
  | 'shipped' 
  | 'done' 
  | 'in_transit' 
  | 'scheduled' 
  | 'cancelled';

export type UserRole = 'admin' | 'inventory_manager' | 'warehouse_staff';
