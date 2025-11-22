/**
 * API Contract Documentation
 * Inventory Management System
 */

// ========================================
// Authentication Endpoints
// ========================================

/**
 * POST /api/auth/login
 * Authenticate user and return access token
 */
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      email: string;
      name: string;
      role: 'admin' | 'inventory_manager' | 'warehouse_staff';
    };
    accessToken: string;
    refreshToken: string;
  };
}

/**
 * POST /api/auth/password-reset/request
 * Request password reset OTP
 */
export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetRequestResponse {
  success: boolean;
  message: string;
}

/**
 * POST /api/auth/password-reset/verify
 * Verify OTP and reset password
 */
export interface PasswordResetVerify {
  email: string;
  otp: string;
  newPassword: string;
}

// ========================================
// Products Endpoints
// ========================================

/**
 * GET /api/products
 * Get paginated list of products
 */
export interface GetProductsRequest {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  sortBy?: 'name' | 'sku' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface GetProductsResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

/**
 * POST /api/products
 * Create a new product
 */
export interface CreateProductRequest {
  sku: string;
  name: string;
  description?: string;
  categoryId: string;
  unit: string;
  reorderPoint?: number;
  reorderQuantity?: number;
}

export interface CreateProductResponse {
  success: boolean;
  data: {
    product: Product;
  };
}

/**
 * POST /api/products/import
 * Import products from CSV
 */
export interface ImportProductsRequest {
  file: File;
  warehouseId: string;
}

export interface ImportProductsResponse {
  success: boolean;
  data: {
    imported: number;
    failed: number;
    errors?: Array<{ row: number; error: string }>;
  };
}

// ========================================
// Receipts Endpoints
// ========================================

/**
 * GET /api/receipts
 * Get paginated list of receipts
 */
export interface GetReceiptsRequest {
  page?: number;
  limit?: number;
  status?: 'draft' | 'waiting' | 'ready' | 'done' | 'cancelled';
  warehouseId?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * POST /api/receipts
 * Create a new receipt
 */
export interface CreateReceiptRequest {
  supplierId?: string;
  supplierName: string;
  warehouseId: string;
  expectedDate: string;
  lines: Array<{
    productId: string;
    locationId: string;
    expectedQuantity: number;
    unitPrice?: number;
  }>;
  notes?: string;
}

export interface CreateReceiptResponse {
  success: boolean;
  data: {
    receipt: Receipt;
  };
}

/**
 * POST /api/receipts/:id/validate
 * Validate receipt and update stock
 */
export interface ValidateReceiptRequest {
  lines: Array<{
    lineId: string;
    receivedQuantity: number;
  }>;
}

export interface ValidateReceiptResponse {
  success: boolean;
  data: {
    receipt: Receipt;
    stockUpdates: Array<{
      productId: string;
      locationId: string;
      previousQuantity: number;
      newQuantity: number;
    }>;
  };
}

// ========================================
// Deliveries Endpoints
// ========================================

/**
 * POST /api/deliveries
 * Create a new delivery order
 */
export interface CreateDeliveryRequest {
  customerId?: string;
  customerName: string;
  warehouseId: string;
  scheduledDate: string;
  lines: Array<{
    productId: string;
    locationId: string;
    orderedQuantity: number;
  }>;
  notes?: string;
}

/**
 * POST /api/deliveries/:id/ship
 * Ship delivery and update stock
 */
export interface ShipDeliveryRequest {
  lines: Array<{
    lineId: string;
    shippedQuantity: number;
  }>;
  trackingNumber?: string;
}

export interface ShipDeliveryResponse {
  success: boolean;
  data: {
    delivery: Delivery;
    stockUpdates: Array<{
      productId: string;
      locationId: string;
      previousQuantity: number;
      newQuantity: number;
    }>;
  };
}

// ========================================
// Transfers Endpoints
// ========================================

/**
 * POST /api/transfers
 * Create internal transfer
 */
export interface CreateTransferRequest {
  sourceWarehouseId: string;
  destinationWarehouseId: string;
  scheduledDate: string;
  lines: Array<{
    productId: string;
    sourceLocationId: string;
    destinationLocationId: string;
    quantity: number;
  }>;
  notes?: string;
}

export interface CreateTransferResponse {
  success: boolean;
  data: {
    transfer: Transfer;
  };
}

// ========================================
// Adjustments Endpoints
// ========================================

/**
 * POST /api/adjustments
 * Create stock adjustment
 */
export interface CreateAdjustmentRequest {
  warehouseId: string;
  type: 'cycle_count' | 'damage' | 'correction' | 'other';
  reason: string;
  lines: Array<{
    productId: string;
    locationId: string;
    systemQuantity: number;
    countedQuantity: number;
  }>;
}

export interface CreateAdjustmentResponse {
  success: boolean;
  data: {
    adjustment: StockAdjustment;
    stockUpdates: Array<{
      productId: string;
      locationId: string;
      difference: number;
      newQuantity: number;
    }>;
  };
}

// ========================================
// Ledger Endpoints
// ========================================

/**
 * GET /api/ledger
 * Get stock ledger entries
 */
export interface GetLedgerRequest {
  page?: number;
  limit?: number;
  productId?: string;
  locationId?: string;
  documentType?: 'receipt' | 'delivery' | 'transfer_in' | 'transfer_out' | 'adjustment';
  startDate?: string;
  endDate?: string;
}

export interface GetLedgerResponse {
  success: boolean;
  data: {
    entries: StockLedgerEntry[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

// Import types
import type {
  Product,
  Receipt,
  Delivery,
  Transfer,
  StockAdjustment,
  StockLedgerEntry,
} from '@/types';
