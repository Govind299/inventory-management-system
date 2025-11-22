'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import { Badge, getStatusBadge } from '@/components/ui/Badge';
import { Modal, ConfirmModal } from '@/components/ui/Modal';
import { Card } from '@/components/ui/Card';
import { Plus, Search, Filter, CheckCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { receiptAPI, productAPI, warehouseAPI, ledgerAPI } from '@/services/api';

export default function ReceiptsPage() {
  const { showToast } = useToast();
  const [receipts, setReceipts] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isValidateModalOpen, setIsValidateModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadReceipts();
    loadProducts();
    loadWarehouses();
  }, []);

  const loadReceipts = async () => {
    try {
      setIsLoading(true);
      const data = await receiptAPI.getAll();
      setReceipts(data);
    } catch (error) {
      showToast({ message: 'Failed to load receipts', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await productAPI.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const loadWarehouses = async () => {
    try {
      const data = await warehouseAPI.getAll();
      setWarehouses(data);
    } catch (error) {
      console.error('Failed to load warehouses:', error);
    }
  };

  const handleCreateReceipt = async (receiptData: any) => {
    try {
      await receiptAPI.create(receiptData);
      showToast({ message: 'Receipt created successfully', type: 'success' });
      loadReceipts();
      setIsCreateModalOpen(false);
    } catch (error) {
      showToast({ message: 'Failed to create receipt', type: 'error' });
    }
  };

  const handleValidateReceipt = async () => {
    if (!selectedReceipt) return;

    try {
      // Update receipt status
      const updatedReceipt = {
        ...selectedReceipt,
        status: 'done',
        receivedDate: new Date().toISOString(),
      };
      await receiptAPI.update(selectedReceipt.id, updatedReceipt);

      // Update product stock
      for (const line of selectedReceipt.lines) {
        const product = products.find(p => p.id === line.productId);
        if (product) {
          const updatedProduct = {
            ...product,
            totalStock: (product.totalStock || 0) + line.expectedQuantity,
            availableStock: (product.availableStock || 0) + line.expectedQuantity,
          };
          await productAPI.update(product.id, updatedProduct);
        }

        // Create ledger entry
        const ledgerEntry = {
          id: `ledger-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          productId: line.productId,
          productName: line.productName,
          sku: line.sku,
          locationId: selectedReceipt.warehouseId,
          locationName: selectedReceipt.warehouseName,
          documentType: 'receipt',
          documentNumber: selectedReceipt.documentNumber,
          quantity: line.expectedQuantity,
          balanceAfter: (product?.totalStock || 0) + line.expectedQuantity,
          createdAt: new Date().toISOString(),
          createdBy: 'Current User',
        };
        await ledgerAPI.create(ledgerEntry);
      }

      showToast({ message: 'Receipt validated successfully', type: 'success' });
      loadReceipts();
      loadProducts();
      setIsValidateModalOpen(false);
      setSelectedReceipt(null);
    } catch (error) {
      showToast({ message: 'Failed to validate receipt', type: 'error' });
    }
  };

  const filteredReceipts = receipts.filter(receipt => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      receipt.documentNumber?.toLowerCase().includes(query) ||
      receipt.supplierName?.toLowerCase().includes(query)
    );
  });

  const columns = [
    {
      key: 'documentNumber',
      header: 'Receipt #',
      width: '140px',
      render: (receipt: any) => (
        <span className="font-medium text-primary">{receipt.documentNumber}</span>
      ),
    },
    {
      key: 'supplier',
      header: 'Supplier',
      render: (receipt: any) => (
        <span className="text-text-primary">{receipt.supplierName || 'N/A'}</span>
      ),
    },
    {
      key: 'expectedDate',
      header: 'Expected Date',
      width: '140px',
      render: (receipt: any) => (
        <span className="text-text-secondary">
          {new Date(receipt.expectedDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '120px',
      render: (receipt: any) => {
        const { variant, label } = getStatusBadge(receipt.status);
        return <Badge variant={variant}>{label}</Badge>;
      },
    },
    {
      key: 'lines',
      header: 'Items',
      width: '80px',
      render: (receipt: any) => (
        <span className="text-text-tertiary text-sm">{receipt.lines?.length || 0}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '150px',
      render: (receipt: any) => (
        <div className="flex gap-2">
          {receipt.status === 'pending' && (
            <Button
              variant="primary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedReceipt(receipt);
                setIsValidateModalOpen(true);
              }}
            >
              Validate
            </Button>
          )}
          {receipt.status === 'done' && (
            <Button variant="ghost" size="sm">
              View
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Receipts</h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage incoming stock and supplier deliveries
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create Receipt
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search receipts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <Button variant="secondary" leftIcon={<Filter className="w-4 h-4" />}>
            Filters
          </Button>
        </div>
      </Card>

      {/* Receipts Table */}
      <Card padding={false}>
        <Table
          data={filteredReceipts}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No receipts found. Create your first receipt to get started."
          onRowClick={(receipt) => console.log('View receipt:', receipt.id)}
        />
      </Card>

      {/* Create Receipt Modal */}
      <CreateReceiptModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateReceipt}
        products={products}
        warehouses={warehouses}
      />

      {/* Validate Receipt Modal */}
      <ConfirmModal
        isOpen={isValidateModalOpen}
        onClose={() => {
          setIsValidateModalOpen(false);
          setSelectedReceipt(null);
        }}
        onConfirm={handleValidateReceipt}
        title="Validate Receipt"
        message={`Are you sure you want to validate receipt ${selectedReceipt?.documentNumber}? This will increase stock levels for ${selectedReceipt?.lines?.length || 0} items.`}
        confirmText="Validate Receipt"
        variant="primary"
      />
    </div>
  );
}

// Create Receipt Modal
interface CreateReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  products: any[];
  warehouses: any[];
}

function CreateReceiptModal({ isOpen, onClose, onSubmit, products, warehouses }: CreateReceiptModalProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    supplier: '',
    expectedDate: '',
    warehouseId: '',
    warehouseName: '',
  });
  const [lines, setLines] = useState<any[]>([]);

  const handleAddLine = () => {
    setLines([...lines, { productId: '', productName: '', sku: '', expectedQuantity: 0 }]);
  };

  const handleRemoveLine = (index: number) => {
    setLines(lines.filter((_, i) => i !== index));
  };

  const handleLineChange = (index: number, field: string, value: any) => {
    const newLines = [...lines];
    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      newLines[index] = {
        ...newLines[index],
        productId: value,
        productName: product?.name || '',
        sku: product?.sku || '',
      };
    } else {
      newLines[index][field] = value;
    }
    setLines(newLines);
  };

  const handleSubmit = () => {
    if (!formData.supplier || !formData.expectedDate || !formData.warehouseId || lines.length === 0) {
      showToast({ message: 'Please fill all required fields and add at least one item', type: 'error' });
      return;
    }

    const receiptData = {
      id: `RCP-${Date.now()}`,
      documentNumber: `RCP-2024-${String(Date.now()).slice(-3)}`,
      supplierName: formData.supplier,
      warehouseId: formData.warehouseId,
      warehouseName: formData.warehouseName,
      status: 'pending',
      expectedDate: formData.expectedDate,
      receivedDate: null,
      lines: lines.map((line, idx) => ({
        id: `line-${idx}`,
        ...line,
        expectedQuantity: parseInt(line.expectedQuantity) || 0,
      })),
      createdBy: 'Admin User',
      createdAt: new Date().toISOString(),
    };

    onSubmit(receiptData);
    
    // Reset form
    setFormData({ supplier: '', expectedDate: '', warehouseId: '', warehouseName: '' });
    setLines([]);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Receipt"
      size="xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Create Receipt
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Supplier *"
            value={formData.supplier}
            onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
            placeholder="Enter supplier name"
            required
          />
          <Input
            label="Expected Date *"
            type="date"
            value={formData.expectedDate}
            onChange={(e) => setFormData({ ...formData, expectedDate: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="label">Warehouse *</label>
          <select
            className="input-base"
            value={formData.warehouseId}
            onChange={(e) => {
              const wh = warehouses.find(w => w.id === e.target.value);
              setFormData({ ...formData, warehouseId: e.target.value, warehouseName: wh?.name || '' });
            }}
            required
          >
            <option value="">Select warehouse...</option>
            {warehouses.map(wh => (
              <option key={wh.id} value={wh.id}>{wh.name}</option>
            ))}
          </select>
        </div>

        {/* Receipt Lines */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="label">Items *</label>
            <Button variant="secondary" size="sm" onClick={handleAddLine} leftIcon={<Plus className="w-4 h-4" />}>
              Add Item
            </Button>
          </div>
          
          {lines.length === 0 ? (
            <div className="text-center py-8 text-text-tertiary">
              No items added. Click "Add Item" to get started.
            </div>
          ) : (
            <div className="space-y-3">
              {lines.map((line, index) => (
                <div key={index} className="flex items-end gap-3 p-3 bg-surface-secondary rounded">
                  <div className="flex-1">
                    <label className="text-xs text-text-tertiary mb-1 block">Product</label>
                    <select
                      className="input-base"
                      value={line.productId}
                      onChange={(e) => handleLineChange(index, 'productId', e.target.value)}
                    >
                      <option value="">Select product...</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.sku} - {p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-32">
                    <label className="text-xs text-text-tertiary mb-1 block">Quantity</label>
                    <Input
                      type="number"
                      value={line.expectedQuantity}
                      onChange={(e) => handleLineChange(index, 'expectedQuantity', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <Button
                    variant="danger"
                    size="md"
                    onClick={() => handleRemoveLine(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
