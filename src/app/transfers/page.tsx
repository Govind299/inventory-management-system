'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { productAPI, warehouseAPI, transferAPI } from '@/services/api';
import {
  Plus,
  Search,
  ArrowLeftRight,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  Truck,
  Eye,
  Trash2,
} from 'lucide-react';

interface TransferLine {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  requestedQty: number;
  shippedQty: number;
  receivedQty: number;
  unit: string;
}

interface Transfer {
  id: string;
  documentNumber: string;
  fromWarehouseId: string;
  fromWarehouseName: string;
  toWarehouseId: string;
  toWarehouseName: string;
  status: 'draft' | 'scheduled' | 'in_transit' | 'completed' | 'cancelled';
  requestDate: string;
  scheduledDate?: string;
  shippedDate?: string;
  receivedDate?: string;
  lines: TransferLine[];
  totalItems: number;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

// Mock data
const mockTransfers: Transfer[] = [
  {
    id: '1',
    documentNumber: 'TRF-2024-001',
    fromWarehouseId: 'WH-001',
    fromWarehouseName: 'Main Warehouse',
    toWarehouseId: 'WH-002',
    toWarehouseName: 'Regional Warehouse',
    status: 'scheduled',
    requestDate: '2024-11-20',
    scheduledDate: '2024-11-23',
    lines: [
      { id: '1', productId: 'PROD-001', productName: 'Industrial Bolt M12', sku: 'PROD-001', requestedQty: 200, shippedQty: 0, receivedQty: 0, unit: 'pcs' },
      { id: '2', productId: 'PROD-015', productName: 'Steel Plate 10mm', sku: 'PROD-015', requestedQty: 30, shippedQty: 0, receivedQty: 0, unit: 'pcs' },
    ],
    totalItems: 2,
    createdBy: 'John Doe',
    createdAt: '2024-11-20T10:00:00',
  },
  {
    id: '2',
    documentNumber: 'TRF-2024-002',
    fromWarehouseId: 'WH-002',
    fromWarehouseName: 'Regional Warehouse',
    toWarehouseId: 'WH-001',
    toWarehouseName: 'Main Warehouse',
    status: 'in_transit',
    requestDate: '2024-11-19',
    scheduledDate: '2024-11-22',
    shippedDate: '2024-11-22',
    lines: [
      { id: '3', productId: 'PROD-032', productName: 'Hydraulic Hose 1/2"', sku: 'PROD-032', requestedQty: 25, shippedQty: 25, receivedQty: 0, unit: 'meters' },
    ],
    totalItems: 1,
    notes: 'Urgent transfer for customer order',
    createdBy: 'Jane Smith',
    createdAt: '2024-11-19T14:30:00',
  },
  {
    id: '3',
    documentNumber: 'TRF-2024-003',
    fromWarehouseId: 'WH-001',
    fromWarehouseName: 'Main Warehouse',
    toWarehouseId: 'WH-002',
    toWarehouseName: 'Regional Warehouse',
    status: 'completed',
    requestDate: '2024-11-18',
    scheduledDate: '2024-11-20',
    shippedDate: '2024-11-20',
    receivedDate: '2024-11-21',
    lines: [
      { id: '4', productId: 'PROD-089', productName: 'Bearing 6205-2RS', sku: 'PROD-089', requestedQty: 15, shippedQty: 15, receivedQty: 15, unit: 'pcs' },
      { id: '5', productId: 'PROD-124', productName: 'Electric Motor 2HP', sku: 'PROD-124', requestedQty: 3, shippedQty: 3, receivedQty: 3, unit: 'pcs' },
    ],
    totalItems: 2,
    createdBy: 'Mike Johnson',
    createdAt: '2024-11-18T09:15:00',
  },
];

const getStatusBadge = (status: Transfer['status']) => {
  const variants: Record<Transfer['status'], { variant: 'default' | 'warning' | 'success' | 'danger'; label: string }> = {
    draft: { variant: 'default', label: 'Draft' },
    scheduled: { variant: 'warning', label: 'Scheduled' },
    in_transit: { variant: 'warning', label: 'In Transit' },
    completed: { variant: 'success', label: 'Completed' },
    cancelled: { variant: 'danger', label: 'Cancelled' },
  };
  const { variant, label } = variants[status];
  return <Badge variant={variant}>{label}</Badge>;
};

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);
  const [isShipModalOpen, setIsShipModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const { showToast } = useToast();

  // Load data from API
  useEffect(() => {
    loadTransfers();
    loadProducts();
    loadWarehouses();
  }, []);

  const loadTransfers = async () => {
    try {
      const data = await transferAPI.getAll();
      setTransfers(data);
    } catch (error) {
      console.error('Failed to load transfers:', error);
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

  // Form state for create transfer
  const [formData, setFormData] = useState({
    fromWarehouseId: '',
    toWarehouseId: '',
    scheduledDate: '',
    notes: '',
  });
  const [transferLines, setTransferLines] = useState<TransferLine[]>([]);

  // Set default warehouses when loaded
  useEffect(() => {
    if (warehouses.length > 0 && !formData.fromWarehouseId) {
      const defaultFrom = warehouses[0].id;
      const defaultTo = warehouses.length > 1 ? warehouses[1].id : warehouses[0].id;
      setFormData(prev => ({ ...prev, fromWarehouseId: defaultFrom, toWarehouseId: defaultTo }));
    }
  }, [warehouses, formData.fromWarehouseId]);

  const filteredTransfers = transfers.filter(
    (transfer) =>
      transfer.documentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.fromWarehouseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.toWarehouseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTransfer = async () => {
    if (!formData.scheduledDate || transferLines.length === 0) {
      showToast({ message: 'Please select a scheduled date and add at least one product', type: 'error' });
      return;
    }

    if (formData.fromWarehouseId === formData.toWarehouseId) {
      showToast({ message: 'Source and destination warehouses must be different', type: 'error' });
      return;
    }

    try {
      const fromWarehouse = warehouses.find((w: any) => w.id === formData.fromWarehouseId);
      const toWarehouse = warehouses.find((w: any) => w.id === formData.toWarehouseId);
      
      const newTransfer = {
        documentNumber: `TRF-2024-${String(transfers.length + 1).padStart(3, '0')}`,
        fromWarehouseId: formData.fromWarehouseId,
        fromWarehouseName: fromWarehouse?.name || '',
        toWarehouseId: formData.toWarehouseId,
        toWarehouseName: toWarehouse?.name || '',
        status: 'scheduled',
        requestDate: new Date().toISOString().split('T')[0],
        scheduledDate: formData.scheduledDate,
        lines: transferLines.map((line, idx) => ({ ...line, id: `${idx + 1}`, shippedQty: 0, receivedQty: 0 })),
        totalItems: transferLines.length,
        notes: formData.notes,
        createdBy: 'Current User',
        createdAt: new Date().toISOString(),
      };

      const created = await transferAPI.create(newTransfer);
      setTransfers([created, ...transfers]);
      setIsCreateModalOpen(false);
      const defaultFrom = warehouses.length > 0 ? warehouses[0].id : '';
      const defaultTo = warehouses.length > 1 ? warehouses[1].id : '';
      setFormData({ fromWarehouseId: defaultFrom, toWarehouseId: defaultTo, scheduledDate: '', notes: '' });
      setTransferLines([]);
      showToast({ message: `Transfer ${created.documentNumber} created successfully`, type: 'success' });
    } catch (error) {
      console.error('Failed to create transfer:', error);
      showToast({ message: 'Failed to create transfer', type: 'error' });
    }
  };

  const handleAddLine = () => {
    setTransferLines([
      ...transferLines,
      { id: '', productId: '', productName: '', sku: '', requestedQty: 0, shippedQty: 0, receivedQty: 0, unit: 'pcs' },
    ]);
  };

  const handleRemoveLine = (index: number) => {
    setTransferLines(transferLines.filter((_, i) => i !== index));
  };

  const handleLineChange = (index: number, field: keyof TransferLine, value: any) => {
    const newLines = [...transferLines];
    newLines[index] = { ...newLines[index], [field]: value };
    
    if (field === 'sku') {
      const product = products.find((p: any) => p.sku === value);
      if (product) {
        newLines[index].productId = product.id;
        newLines[index].productName = product.name;
        newLines[index].unit = product.unit;
      }
    }
    
    setTransferLines(newLines);
  };

  const handleShip = (transfer: Transfer) => {
    setSelectedTransfer({ ...transfer, lines: transfer.lines.map(l => ({ ...l, shippedQty: l.requestedQty })) });
    setIsShipModalOpen(true);
  };

  const handleConfirmShip = () => {
    if (!selectedTransfer) return;
    
    const updatedTransfers = transfers.map(t =>
      t.id === selectedTransfer.id
        ? {
            ...selectedTransfer,
            status: 'in_transit' as const,
            shippedDate: new Date().toISOString().split('T')[0],
          }
        : t
    );
    setTransfers(updatedTransfers);
    setIsShipModalOpen(false);
    setSelectedTransfer(null);
    showToast({ message: 'Transfer has been shipped', type: 'success' });
  };

  const handleReceive = (transfer: Transfer) => {
    setSelectedTransfer({ ...transfer });
    setIsReceiveModalOpen(true);
  };

  const handleConfirmReceive = () => {
    if (!selectedTransfer) return;
    
    const updatedTransfers = transfers.map(t =>
      t.id === selectedTransfer.id
        ? {
            ...selectedTransfer,
            status: 'completed' as const,
            receivedDate: new Date().toISOString().split('T')[0],
          }
        : t
    );
    setTransfers(updatedTransfers);
    setIsReceiveModalOpen(false);
    setSelectedTransfer(null);
    showToast({ message: 'Transfer has been received and completed', type: 'success' });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Internal Transfers</h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage stock movements between warehouses
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create Transfer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Scheduled</p>
              <p className="text-2xl font-semibold text-text-primary mt-1">
                {transfers.filter(t => t.status === 'scheduled').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-warning" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">In Transit</p>
              <p className="text-2xl font-semibold text-text-primary mt-1">
                {transfers.filter(t => t.status === 'in_transit').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-info" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Completed</p>
              <p className="text-2xl font-semibold text-text-primary mt-1">
                {transfers.filter(t => t.status === 'completed').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Total Items</p>
              <p className="text-2xl font-semibold text-text-primary mt-1">
                {transfers.reduce((sum, t) => sum + t.totalItems, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>
      </div>

      {/* Transfers Table */}
      <Card padding={false}>
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <CardHeader title="All Transfers" subtitle={`${filteredTransfers.length} total transfers`} />
            <div className="w-80">
              <Input
                placeholder="Search by document #, warehouse, or status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-background">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Document #</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">From</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">To</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Request Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Scheduled Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Items</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Status</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-border">
              {filteredTransfers.map((transfer) => (
                <tr key={transfer.id} className="hover:bg-background transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-primary">{transfer.documentNumber}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{transfer.fromWarehouseName}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{transfer.toWarehouseName}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{transfer.requestDate}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{transfer.scheduledDate || '-'}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{transfer.totalItems} items</td>
                  <td className="px-6 py-4">{getStatusBadge(transfer.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {transfer.status === 'scheduled' && (
                        <Button variant="primary" size="sm" onClick={() => handleShip(transfer)}>
                          Ship Transfer
                        </Button>
                      )}
                      {transfer.status === 'in_transit' && (
                        <Button variant="success" size="sm" onClick={() => handleReceive(transfer)}>
                          Receive Transfer
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Transfer Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Stock Transfer"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateTransfer}>
              Create Transfer
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">From Warehouse</label>
              <select
                className="input-base"
                value={formData.fromWarehouseId}
                onChange={(e) => setFormData({ ...formData, fromWarehouseId: e.target.value })}
              >
                {warehouses.map((wh: any) => (
                  <option key={wh.id} value={wh.id}>
                    {wh.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">To Warehouse</label>
              <select
                className="input-base"
                value={formData.toWarehouseId}
                onChange={(e) => setFormData({ ...formData, toWarehouseId: e.target.value })}
              >
                {warehouses.map((wh: any) => (
                  <option key={wh.id} value={wh.id}>
                    {wh.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Scheduled Date"
            type="date"
            value={formData.scheduledDate}
            onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
            required
          />

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="label">Products to Transfer</label>
              <Button variant="secondary" size="sm" onClick={handleAddLine}>
                <Plus className="w-4 h-4 mr-1" /> Add Product
              </Button>
            </div>
            <div className="space-y-3">
              {transferLines.map((line, index) => (
                <div key={index} className="flex gap-3 items-end">
                  <div className="flex-1">
                    <select
                      className="input-base"
                      value={line.sku}
                      onChange={(e) => handleLineChange(index, 'sku', e.target.value)}
                    >
                      <option value="">Select Product</option>
                      {products.map((p: any) => (
                        <option key={p.id} value={p.sku}>
                          {p.sku} - {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      className="input-base"
                      placeholder="Quantity"
                      value={line.requestedQty || ''}
                      onChange={(e) => handleLineChange(index, 'requestedQty', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <Button variant="danger" size="sm" onClick={() => handleRemoveLine(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Input
            label="Notes (Optional)"
            placeholder="Add any special instructions..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>
      </Modal>

      {/* Ship Transfer Modal */}
      {selectedTransfer && (
        <Modal
          isOpen={isShipModalOpen}
          onClose={() => setIsShipModalOpen(false)}
          title={`Ship Transfer - ${selectedTransfer.documentNumber}`}
          size="lg"
          footer={
            <>
              <Button variant="secondary" onClick={() => setIsShipModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleConfirmShip}>
                Confirm Ship
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="p-4 bg-background rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-text-secondary">From:</span>
                <span className="text-sm font-medium text-text-primary">{selectedTransfer.fromWarehouseName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-text-secondary">To:</span>
                <span className="text-sm font-medium text-text-primary">{selectedTransfer.toWarehouseName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-text-secondary">Scheduled Date:</span>
                <span className="text-sm font-medium text-text-primary">{selectedTransfer.scheduledDate}</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="label">Items to Ship</label>
              {selectedTransfer.lines.map((line, index) => (
                <div key={line.id} className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-text-primary">{line.productName}</p>
                      <p className="text-sm text-text-secondary">SKU: {line.sku}</p>
                    </div>
                    <Badge>Requested: {line.requestedQty} {line.unit}</Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="text-sm text-text-secondary">Shipped Quantity:</label>
                    <input
                      type="number"
                      className="input-base w-32"
                      max={line.requestedQty}
                      value={line.shippedQty}
                      onChange={(e) => {
                        const newLines = [...selectedTransfer.lines];
                        newLines[index].shippedQty = Math.min(parseInt(e.target.value) || 0, line.requestedQty);
                        setSelectedTransfer({ ...selectedTransfer, lines: newLines });
                      }}
                    />
                    <span className="text-sm text-text-secondary">{line.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}

      {/* Receive Transfer Modal */}
      {selectedTransfer && (
        <Modal
          isOpen={isReceiveModalOpen}
          onClose={() => setIsReceiveModalOpen(false)}
          title={`Receive Transfer - ${selectedTransfer.documentNumber}`}
          size="lg"
          footer={
            <>
              <Button variant="secondary" onClick={() => setIsReceiveModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="success" onClick={handleConfirmReceive}>
                Confirm Receipt
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="p-4 bg-background rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-text-secondary">From:</span>
                <span className="text-sm font-medium text-text-primary">{selectedTransfer.fromWarehouseName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-text-secondary">To:</span>
                <span className="text-sm font-medium text-text-primary">{selectedTransfer.toWarehouseName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-text-secondary">Shipped Date:</span>
                <span className="text-sm font-medium text-text-primary">{selectedTransfer.shippedDate}</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="label">Items to Receive</label>
              {selectedTransfer.lines.map((line, index) => (
                <div key={line.id} className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-text-primary">{line.productName}</p>
                      <p className="text-sm text-text-secondary">SKU: {line.sku}</p>
                    </div>
                    <Badge>Shipped: {line.shippedQty} {line.unit}</Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="text-sm text-text-secondary">Received Quantity:</label>
                    <input
                      type="number"
                      className="input-base w-32"
                      max={line.shippedQty}
                      value={line.receivedQty || line.shippedQty}
                      onChange={(e) => {
                        const newLines = [...selectedTransfer.lines];
                        newLines[index].receivedQty = Math.min(parseInt(e.target.value) || 0, line.shippedQty);
                        setSelectedTransfer({ ...selectedTransfer, lines: newLines });
                      }}
                    />
                    <span className="text-sm text-text-secondary">{line.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
