'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { productAPI, warehouseAPI, deliveryAPI } from '@/services/api';
import {
  Plus,
  Search,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';

interface DeliveryLine {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  orderedQty: number;
  pickedQty: number;
  packedQty: number;
  unit: string;
}

interface Delivery {
  id: string;
  documentNumber: string;
  customerId: string;
  customerName: string;
  warehouseId: string;
  warehouseName: string;
  status: 'draft' | 'picking' | 'packing' | 'ready' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  expectedDeliveryDate: string;
  shippedDate?: string;
  deliveredDate?: string;
  lines: DeliveryLine[];
  totalItems: number;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

// Mock data
const mockDeliveries: Delivery[] = [
  {
    id: '1',
    documentNumber: 'DEL-2024-001',
    customerId: 'CUST-001',
    customerName: 'ABC Manufacturing Ltd.',
    warehouseId: 'WH-001',
    warehouseName: 'Main Warehouse',
    status: 'picking',
    orderDate: '2024-11-20',
    expectedDeliveryDate: '2024-11-25',
    lines: [
      { id: '1', productId: 'PROD-001', productName: 'Industrial Bolt M12', sku: 'PROD-001', orderedQty: 100, pickedQty: 50, packedQty: 0, unit: 'pcs' },
      { id: '2', productId: 'PROD-015', productName: 'Steel Plate 10mm', sku: 'PROD-015', orderedQty: 25, pickedQty: 0, packedQty: 0, unit: 'pcs' },
    ],
    totalItems: 2,
    createdBy: 'John Doe',
    createdAt: '2024-11-20T09:30:00',
  },
  {
    id: '2',
    documentNumber: 'DEL-2024-002',
    customerId: 'CUST-002',
    customerName: 'XYZ Industries',
    warehouseId: 'WH-001',
    warehouseName: 'Main Warehouse',
    status: 'ready',
    orderDate: '2024-11-19',
    expectedDeliveryDate: '2024-11-24',
    lines: [
      { id: '3', productId: 'PROD-032', productName: 'Hydraulic Hose 1/2"', sku: 'PROD-032', orderedQty: 50, pickedQty: 50, packedQty: 50, unit: 'meters' },
    ],
    totalItems: 1,
    createdBy: 'Jane Smith',
    createdAt: '2024-11-19T14:15:00',
  },
  {
    id: '3',
    documentNumber: 'DEL-2024-003',
    customerId: 'CUST-003',
    customerName: 'Global Tech Solutions',
    warehouseId: 'WH-002',
    warehouseName: 'Regional Warehouse',
    status: 'shipped',
    orderDate: '2024-11-18',
    expectedDeliveryDate: '2024-11-23',
    shippedDate: '2024-11-22',
    lines: [
      { id: '4', productId: 'PROD-089', productName: 'Bearing 6205-2RS', sku: 'PROD-089', orderedQty: 20, pickedQty: 20, packedQty: 20, unit: 'pcs' },
      { id: '5', productId: 'PROD-124', productName: 'Electric Motor 2HP', sku: 'PROD-124', orderedQty: 5, pickedQty: 5, packedQty: 5, unit: 'pcs' },
    ],
    totalItems: 2,
    notes: 'Fragile items - handle with care',
    createdBy: 'Mike Johnson',
    createdAt: '2024-11-18T11:00:00',
  },
];

const getStatusBadge = (status: Delivery['status']) => {
  const variants: Record<Delivery['status'], { variant: 'default' | 'warning' | 'success' | 'danger'; label: string }> = {
    draft: { variant: 'default', label: 'Draft' },
    picking: { variant: 'warning', label: 'Picking' },
    packing: { variant: 'warning', label: 'Packing' },
    ready: { variant: 'success', label: 'Ready to Ship' },
    shipped: { variant: 'success', label: 'Shipped' },
    delivered: { variant: 'success', label: 'Delivered' },
    cancelled: { variant: 'danger', label: 'Cancelled' },
  };
  const { variant, label } = variants[status];
  return <Badge variant={variant}>{label}</Badge>;
};

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [isPickingModalOpen, setIsPickingModalOpen] = useState(false);
  const [isPackingModalOpen, setIsPackingModalOpen] = useState(false);
  const [isShipModalOpen, setIsShipModalOpen] = useState(false);
  const { showToast } = useToast();

  // Load data from API
  useEffect(() => {
    loadDeliveries();
    loadProducts();
    loadWarehouses();
  }, []);

  const loadDeliveries = async () => {
    try {
      const data = await deliveryAPI.getAll();
      setDeliveries(data);
    } catch (error) {
      console.error('Failed to load deliveries:', error);
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

  // Form state for create delivery
  const [formData, setFormData] = useState({
    customerName: '',
    warehouseName: 'Main Warehouse',
    expectedDeliveryDate: '',
    notes: '',
  });
  const [deliveryLines, setDeliveryLines] = useState<DeliveryLine[]>([]);

  const filteredDeliveries = deliveries.filter(
    (delivery) =>
      delivery.documentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateDelivery = async () => {
    if (!formData.customerName || !formData.expectedDeliveryDate || deliveryLines.length === 0) {
      showToast({ message: 'Please fill all required fields and add at least one product', type: 'error' });
      return;
    }

    try {
      const warehouse = warehouses.length > 0 ? warehouses[0] : { id: 'WH-001', name: 'Main Warehouse' };
      const newDelivery = {
        documentNumber: `DEL-2024-${String(deliveries.length + 1).padStart(3, '0')}`,
        customerId: `CUST-${deliveries.length + 1}`,
        customerName: formData.customerName,
        warehouseId: warehouse.id,
        warehouseName: formData.warehouseName || warehouse.name,
        status: 'draft',
        orderDate: new Date().toISOString().split('T')[0],
        expectedDeliveryDate: formData.expectedDeliveryDate,
        lines: deliveryLines.map((line, idx) => ({ ...line, id: `${idx + 1}`, pickedQty: 0, packedQty: 0 })),
        totalItems: deliveryLines.length,
        notes: formData.notes,
        createdBy: 'Current User',
        createdAt: new Date().toISOString(),
      };

      const created = await deliveryAPI.create(newDelivery);
      setDeliveries([created, ...deliveries]);
      setIsCreateModalOpen(false);
      setFormData({ customerName: '', warehouseName: 'Main Warehouse', expectedDeliveryDate: '', notes: '' });
      setDeliveryLines([]);
      showToast({ message: `Delivery order ${created.documentNumber} created successfully`, type: 'success' });
    } catch (error) {
      console.error('Failed to create delivery:', error);
      showToast({ message: 'Failed to create delivery', type: 'error' });
    }
  };

  const handleAddLine = () => {
    setDeliveryLines([
      ...deliveryLines,
      { id: '', productId: '', productName: '', sku: '', orderedQty: 0, pickedQty: 0, packedQty: 0, unit: 'pcs' },
    ]);
  };

  const handleRemoveLine = (index: number) => {
    setDeliveryLines(deliveryLines.filter((_, i) => i !== index));
  };

  const handleLineChange = (index: number, field: keyof DeliveryLine, value: any) => {
    const newLines = [...deliveryLines];
    newLines[index] = { ...newLines[index], [field]: value };
    
    // Auto-fill product details when SKU is selected
    if (field === 'sku') {
      const product = products.find((p: any) => p.sku === value);
      if (product) {
        newLines[index].productId = product.id;
        newLines[index].productName = product.name;
        newLines[index].unit = product.unit;
      }
    }
    
    setDeliveryLines(newLines);
  };

  const handleStartPicking = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setIsPickingModalOpen(true);
  };

  const handleSavePicking = () => {
    if (!selectedDelivery) return;
    
    const updatedDeliveries = deliveries.map(d =>
      d.id === selectedDelivery.id
        ? { ...selectedDelivery, status: 'packing' as const }
        : d
    );
    setDeliveries(updatedDeliveries);
    setIsPickingModalOpen(false);
    setSelectedDelivery(null);
    showToast({ message: 'Picking completed. Ready for packing.', type: 'success' });
  };

  const handleStartPacking = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setIsPackingModalOpen(true);
  };

  const handleSavePacking = () => {
    if (!selectedDelivery) return;
    
    const updatedDeliveries = deliveries.map(d =>
      d.id === selectedDelivery.id
        ? { ...selectedDelivery, status: 'ready' as const }
        : d
    );
    setDeliveries(updatedDeliveries);
    setIsPackingModalOpen(false);
    setSelectedDelivery(null);
    showToast({ message: 'Packing completed. Ready to ship.', type: 'success' });
  };

  const handleShip = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setIsShipModalOpen(true);
  };

  const handleConfirmShip = () => {
    if (!selectedDelivery) return;
    
    const updatedDeliveries = deliveries.map(d =>
      d.id === selectedDelivery.id
        ? { ...d, status: 'shipped' as const, shippedDate: new Date().toISOString().split('T')[0] }
        : d
    );
    setDeliveries(updatedDeliveries);
    setIsShipModalOpen(false);
    setSelectedDelivery(null);
    showToast({ message: `Delivery ${selectedDelivery.documentNumber} has been shipped`, type: 'success' });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Delivery Orders</h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage outgoing stock and customer deliveries
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create Delivery
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Draft Orders</p>
              <p className="text-2xl font-semibold text-text-primary mt-1">
                {deliveries.filter(d => d.status === 'draft').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-text-secondary" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">In Progress</p>
              <p className="text-2xl font-semibold text-text-primary mt-1">
                {deliveries.filter(d => ['picking', 'packing'].includes(d.status)).length}
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
              <p className="text-sm text-text-secondary">Ready to Ship</p>
              <p className="text-2xl font-semibold text-text-primary mt-1">
                {deliveries.filter(d => d.status === 'ready').length}
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
              <p className="text-sm text-text-secondary">Shipped</p>
              <p className="text-2xl font-semibold text-text-primary mt-1">
                {deliveries.filter(d => d.status === 'shipped').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>
      </div>

      {/* Deliveries Table */}
      <Card padding={false}>
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <CardHeader title="All Deliveries" subtitle={`${filteredDeliveries.length} total orders`} />
            <div className="w-80">
              <Input
                placeholder="Search by document #, customer, or status..."
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
                <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Customer</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Warehouse</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Order Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Expected Delivery</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Items</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Status</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-border">
              {filteredDeliveries.map((delivery) => (
                <tr key={delivery.id} className="hover:bg-background transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-primary">{delivery.documentNumber}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{delivery.customerName}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{delivery.warehouseName}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{delivery.orderDate}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{delivery.expectedDeliveryDate}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{delivery.totalItems} items</td>
                  <td className="px-6 py-4">{getStatusBadge(delivery.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {delivery.status === 'draft' && (
                        <Button variant="primary" size="sm" onClick={() => handleStartPicking(delivery)}>
                          Start Picking
                        </Button>
                      )}
                      {delivery.status === 'picking' && (
                        <Button variant="primary" size="sm" onClick={() => handleStartPicking(delivery)}>
                          Continue Picking
                        </Button>
                      )}
                      {delivery.status === 'packing' && (
                        <Button variant="primary" size="sm" onClick={() => handleStartPacking(delivery)}>
                          Continue Packing
                        </Button>
                      )}
                      {delivery.status === 'ready' && (
                        <Button variant="success" size="sm" onClick={() => handleShip(delivery)}>
                          Ship Order
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

      {/* Create Delivery Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Delivery Order"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateDelivery}>
              Create Delivery
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Customer Name"
              placeholder="Enter customer name"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              required
            />
            <div>
              <label className="label">Warehouse</label>
              <select
                className="input-base"
                value={formData.warehouseName}
                onChange={(e) => setFormData({ ...formData, warehouseName: e.target.value })}
              >
                <option>Main Warehouse</option>
                <option>Regional Warehouse</option>
              </select>
            </div>
          </div>

          <Input
            label="Expected Delivery Date"
            type="date"
            value={formData.expectedDeliveryDate}
            onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
            required
          />

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="label">Products</label>
              <Button variant="secondary" size="sm" onClick={handleAddLine}>
                <Plus className="w-4 h-4 mr-1" /> Add Product
              </Button>
            </div>
            <div className="space-y-3">
              {deliveryLines.map((line, index) => (
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
                          {p.sku} - {p.name} (Available: {p.availableStock || 0} {p.unit})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      className="input-base"
                      placeholder="Quantity"
                      value={line.orderedQty || ''}
                      onChange={(e) => handleLineChange(index, 'orderedQty', parseInt(e.target.value) || 0)}
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

      {/* Picking Modal */}
      {selectedDelivery && (
        <Modal
          isOpen={isPickingModalOpen}
          onClose={() => setIsPickingModalOpen(false)}
          title={`Pick Items - ${selectedDelivery.documentNumber}`}
          size="lg"
          footer={
            <>
              <Button variant="secondary" onClick={() => setIsPickingModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSavePicking}>
                Complete Picking
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">
              Update picked quantities for each item. Picked quantities cannot exceed ordered quantities.
            </p>
            <div className="space-y-3">
              {selectedDelivery.lines.map((line, index) => (
                <div key={line.id} className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-text-primary">{line.productName}</p>
                      <p className="text-sm text-text-secondary">SKU: {line.sku}</p>
                    </div>
                    <Badge>Ordered: {line.orderedQty} {line.unit}</Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="text-sm text-text-secondary">Picked Quantity:</label>
                    <input
                      type="number"
                      className="input-base w-32"
                      max={line.orderedQty}
                      value={line.pickedQty}
                      onChange={(e) => {
                        const newLines = [...selectedDelivery.lines];
                        newLines[index].pickedQty = Math.min(parseInt(e.target.value) || 0, line.orderedQty);
                        setSelectedDelivery({ ...selectedDelivery, lines: newLines });
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

      {/* Packing Modal */}
      {selectedDelivery && (
        <Modal
          isOpen={isPackingModalOpen}
          onClose={() => setIsPackingModalOpen(false)}
          title={`Pack Items - ${selectedDelivery.documentNumber}`}
          size="lg"
          footer={
            <>
              <Button variant="secondary" onClick={() => setIsPackingModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSavePacking}>
                Complete Packing
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">
              Update packed quantities. Packed quantities cannot exceed picked quantities.
            </p>
            <div className="space-y-3">
              {selectedDelivery.lines.map((line, index) => (
                <div key={line.id} className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-text-primary">{line.productName}</p>
                      <p className="text-sm text-text-secondary">SKU: {line.sku}</p>
                    </div>
                    <Badge>Picked: {line.pickedQty} {line.unit}</Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="text-sm text-text-secondary">Packed Quantity:</label>
                    <input
                      type="number"
                      className="input-base w-32"
                      max={line.pickedQty}
                      value={line.packedQty}
                      onChange={(e) => {
                        const newLines = [...selectedDelivery.lines];
                        newLines[index].packedQty = Math.min(parseInt(e.target.value) || 0, line.pickedQty);
                        setSelectedDelivery({ ...selectedDelivery, lines: newLines });
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

      {/* Ship Confirmation Modal */}
      {selectedDelivery && (
        <Modal
          isOpen={isShipModalOpen}
          onClose={() => setIsShipModalOpen(false)}
          title="Confirm Shipment"
          size="md"
          footer={
            <>
              <Button variant="secondary" onClick={() => setIsShipModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="success" onClick={handleConfirmShip}>
                Confirm Ship
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">
              Are you sure you want to mark this delivery as shipped?
            </p>
            <div className="p-4 bg-background rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-text-secondary">Document #:</span>
                <span className="text-sm font-medium text-text-primary">{selectedDelivery.documentNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-text-secondary">Customer:</span>
                <span className="text-sm font-medium text-text-primary">{selectedDelivery.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-text-secondary">Total Items:</span>
                <span className="text-sm font-medium text-text-primary">{selectedDelivery.totalItems}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
