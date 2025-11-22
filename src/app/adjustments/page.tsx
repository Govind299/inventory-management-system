'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { productAPI, warehouseAPI, adjustmentAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { hasPermission } from '@/utils/permissions';
import {
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Package,
  CheckCircle,
  Eye,
  Trash2,
} from 'lucide-react';

interface AdjustmentLine {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  currentQty: number;
  newQty: number;
  adjustmentQty: number;
  unit: string;
  reason: string;
}

interface Adjustment {
  id: string;
  documentNumber: string;
  warehouseId: string;
  warehouseName: string;
  type: 'cycle_count' | 'damage' | 'loss' | 'found' | 'correction' | 'other';
  status: 'draft' | 'approved' | 'rejected';
  adjustmentDate: string;
  lines: AdjustmentLine[];
  totalLines: number;
  totalIncrease: number;
  totalDecrease: number;
  notes?: string;
  createdBy: string;
  approvedBy?: string;
  createdAt: string;
  approvedAt?: string;
}

// Mock data
const mockAdjustments: Adjustment[] = [
  {
    id: '1',
    documentNumber: 'ADJ-2024-001',
    warehouseId: 'WH-001',
    warehouseName: 'Main Warehouse',
    type: 'cycle_count',
    status: 'approved',
    adjustmentDate: '2024-11-20',
    lines: [
      {
        id: '1',
        productId: 'PROD-001',
        productName: 'Industrial Bolt M12',
        sku: 'PROD-001',
        currentQty: 500,
        newQty: 485,
        adjustmentQty: -15,
        unit: 'pcs',
        reason: 'Physical count discrepancy',
      },
      {
        id: '2',
        productId: 'PROD-015',
        productName: 'Steel Plate 10mm',
        sku: 'PROD-015',
        currentQty: 75,
        newQty: 78,
        adjustmentQty: 3,
        unit: 'pcs',
        reason: 'Found in alternate location',
      },
    ],
    totalLines: 2,
    totalIncrease: 3,
    totalDecrease: 15,
    notes: 'Monthly cycle count - Zone A',
    createdBy: 'John Doe',
    approvedBy: 'Manager',
    createdAt: '2024-11-20T09:00:00',
    approvedAt: '2024-11-20T10:30:00',
  },
  {
    id: '2',
    documentNumber: 'ADJ-2024-002',
    warehouseId: 'WH-001',
    warehouseName: 'Main Warehouse',
    type: 'damage',
    status: 'draft',
    adjustmentDate: '2024-11-22',
    lines: [
      {
        id: '3',
        productId: 'PROD-032',
        productName: 'Hydraulic Hose 1/2"',
        sku: 'PROD-032',
        currentQty: 120,
        newQty: 115,
        adjustmentQty: -5,
        unit: 'meters',
        reason: 'Damaged during handling',
      },
    ],
    totalLines: 1,
    totalIncrease: 0,
    totalDecrease: 5,
    notes: 'Forklift incident - damage report filed',
    createdBy: 'Jane Smith',
    createdAt: '2024-11-22T14:15:00',
  },
  {
    id: '3',
    documentNumber: 'ADJ-2024-003',
    warehouseId: 'WH-002',
    warehouseName: 'Regional Warehouse',
    type: 'correction',
    status: 'approved',
    adjustmentDate: '2024-11-19',
    lines: [
      {
        id: '4',
        productId: 'PROD-089',
        productName: 'Bearing 6205-2RS',
        sku: 'PROD-089',
        currentQty: 45,
        newQty: 47,
        adjustmentQty: 2,
        unit: 'pcs',
        reason: 'System entry error correction',
      },
    ],
    totalLines: 1,
    totalIncrease: 2,
    totalDecrease: 0,
    notes: 'Correcting receipt entry mistake',
    createdBy: 'Mike Johnson',
    approvedBy: 'Manager',
    createdAt: '2024-11-19T11:00:00',
    approvedAt: '2024-11-19T11:30:00',
  },
];

const adjustmentTypes = [
  { value: 'cycle_count', label: 'Cycle Count' },
  { value: 'damage', label: 'Damage' },
  { value: 'loss', label: 'Loss/Theft' },
  { value: 'found', label: 'Found' },
  { value: 'correction', label: 'Correction' },
  { value: 'other', label: 'Other' },
];

const getStatusBadge = (status: Adjustment['status']) => {
  const variants: Record<Adjustment['status'], { variant: 'default' | 'success' | 'danger'; label: string }> = {
    draft: { variant: 'default', label: 'Draft' },
    approved: { variant: 'success', label: 'Approved' },
    rejected: { variant: 'danger', label: 'Rejected' },
  };
  const { variant, label } = variants[status];
  return <Badge variant={variant}>{label}</Badge>;
};

const getTypeBadge = (type: Adjustment['type']) => {
  const labels: Record<Adjustment['type'], string> = {
    cycle_count: 'Cycle Count',
    damage: 'Damage',
    loss: 'Loss/Theft',
    found: 'Found',
    correction: 'Correction',
    other: 'Other',
  };
  return <Badge variant="default">{labels[type]}</Badge>;
};

export default function AdjustmentsPage() {
  const [adjustments, setAdjustments] = useState<Adjustment[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAdjustment, setSelectedAdjustment] = useState<Adjustment | null>(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const { showToast } = useToast();
  const { user } = useAuth();

  // Load data from API
  useEffect(() => {
    loadAdjustments();
    loadProducts();
    loadWarehouses();
  }, []);

  const loadAdjustments = async () => {
    try {
      const data = await adjustmentAPI.getAll();
      setAdjustments(data);
    } catch (error) {
      console.error('Failed to load adjustments:', error);
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

  // Form state for create adjustment
  const [formData, setFormData] = useState({
    warehouseId: '',
    type: 'cycle_count' as Adjustment['type'],
    adjustmentDate: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [adjustmentLines, setAdjustmentLines] = useState<AdjustmentLine[]>([]);

  // Set default warehouse when warehouses are loaded
  useEffect(() => {
    if (warehouses.length > 0 && !formData.warehouseId) {
      setFormData(prev => ({ ...prev, warehouseId: warehouses[0].id }));
    }
  }, [warehouses, formData.warehouseId]);

  const filteredAdjustments = adjustments.filter(
    (adj) =>
      adj.documentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      adj.warehouseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      adj.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      adj.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateAdjustment = async () => {
    if (adjustmentLines.length === 0) {
      showToast({ message: 'Please add at least one product adjustment', type: 'error' });
      return;
    }

    try {
      const totalInc = adjustmentLines.reduce((sum, l) => sum + (l.adjustmentQty > 0 ? l.adjustmentQty : 0), 0);
      const totalDec = adjustmentLines.reduce((sum, l) => sum + (l.adjustmentQty < 0 ? Math.abs(l.adjustmentQty) : 0), 0);

      const warehouse = warehouses.find((w: any) => w.id === formData.warehouseId);
      const newAdjustment = {
        documentNumber: `ADJ-2024-${String(adjustments.length + 1).padStart(3, '0')}`,
        warehouseId: formData.warehouseId,
        warehouseName: warehouse?.name || '',
        type: formData.type,
        status: 'draft',
        adjustmentDate: formData.adjustmentDate,
        lines: adjustmentLines.map((line, idx) => ({ ...line, id: `${idx + 1}` })),
        totalLines: adjustmentLines.length,
        totalIncrease: totalInc,
        totalDecrease: totalDec,
        notes: formData.notes,
        createdBy: 'Current User',
        createdAt: new Date().toISOString(),
      };

      const created = await adjustmentAPI.create(newAdjustment);
      setAdjustments([created, ...adjustments]);
      setIsCreateModalOpen(false);
      setFormData({ 
        warehouseId: warehouses.length > 0 ? warehouses[0].id : '', 
        type: 'cycle_count', 
        adjustmentDate: new Date().toISOString().split('T')[0], 
        notes: '' 
      });
      setAdjustmentLines([]);
      showToast({ message: `Stock adjustment ${created.documentNumber} created successfully`, type: 'success' });
    } catch (error) {
      console.error('Failed to create adjustment:', error);
      showToast({ message: 'Failed to create adjustment', type: 'error' });
    }
  };

  const handleAddLine = () => {
    setAdjustmentLines([
      ...adjustmentLines,
      {
        id: '',
        productId: '',
        productName: '',
        sku: '',
        currentQty: 0,
        newQty: 0,
        adjustmentQty: 0,
        unit: 'pcs',
        reason: '',
      },
    ]);
  };

  const handleRemoveLine = (index: number) => {
    setAdjustmentLines(adjustmentLines.filter((_, i) => i !== index));
  };

  const handleLineChange = (index: number, field: keyof AdjustmentLine, value: any) => {
    const newLines = [...adjustmentLines];
    newLines[index] = { ...newLines[index], [field]: value };
    
    if (field === 'sku') {
      const product = products.find((p: any) => p.sku === value);
      if (product) {
        newLines[index].productId = product.id;
        newLines[index].productName = product.name;
        newLines[index].currentQty = product.totalStock || 0;
        newLines[index].newQty = product.totalStock || 0;
        newLines[index].unit = product.unit;
      }
    }
    
    if (field === 'newQty') {
      newLines[index].adjustmentQty = value - newLines[index].currentQty;
    }
    
    setAdjustmentLines(newLines);
  };

  const handleApprove = (adjustment: Adjustment) => {
    setSelectedAdjustment(adjustment);
    setIsApproveModalOpen(true);
  };

  const handleConfirmApprove = async () => {
    if (!selectedAdjustment) return;
    
    try {
      const updated = await adjustmentAPI.update(selectedAdjustment.id, {
        ...selectedAdjustment,
        status: 'approved',
        approvedBy: 'Current User',
        approvedAt: new Date().toISOString(),
      });

      const updatedAdjustments = adjustments.map(a =>
        a.id === updated.id ? updated : a
      );
      setAdjustments(updatedAdjustments);
      setIsApproveModalOpen(false);
      setSelectedAdjustment(null);
      showToast({ message: 'Stock adjustment has been approved', type: 'success' });
    } catch (error) {
      console.error('Failed to approve adjustment:', error);
      showToast({ message: 'Failed to approve adjustment', type: 'error' });
    }
  };

  const totalAdjustments = adjustments.length;
  const totalIncrease = adjustments.reduce((sum, a) => sum + (a.status === 'approved' ? a.totalIncrease : 0), 0);
  const totalDecrease = adjustments.reduce((sum, a) => sum + (a.status === 'approved' ? a.totalDecrease : 0), 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Stock Adjustments</h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage inventory adjustments, cycle counts, and corrections
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create Adjustment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Total Adjustments</p>
              <p className="text-2xl font-semibold text-text-primary mt-1">{totalAdjustments}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Pending Approval</p>
              <p className="text-2xl font-semibold text-text-primary mt-1">
                {adjustments.filter(a => a.status === 'draft').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-warning" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Total Increase</p>
              <p className="text-2xl font-semibold text-success mt-1">+{totalIncrease}</p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Total Decrease</p>
              <p className="text-2xl font-semibold text-danger mt-1">-{totalDecrease}</p>
            </div>
            <div className="w-12 h-12 bg-danger/10 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-danger" />
            </div>
          </div>
        </Card>
      </div>

      {/* Adjustments Table */}
      <Card padding={false}>
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <CardHeader title="All Adjustments" subtitle={`${filteredAdjustments.length} total adjustments`} />
            <div className="w-80">
              <Input
                placeholder="Search by document #, warehouse, type..."
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
                <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Warehouse</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Lines</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Increase</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Decrease</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Status</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-border">
              {filteredAdjustments.map((adjustment) => (
                <tr key={adjustment.id} className="hover:bg-background transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-primary">{adjustment.documentNumber}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{adjustment.warehouseName}</td>
                  <td className="px-6 py-4">{getTypeBadge(adjustment.type)}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{adjustment.adjustmentDate}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{adjustment.totalLines} items</td>
                  <td className="px-6 py-4 text-sm font-medium text-success">
                    {adjustment.totalIncrease > 0 ? `+${adjustment.totalIncrease}` : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-danger">
                    {adjustment.totalDecrease > 0 ? `-${adjustment.totalDecrease}` : '-'}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(adjustment.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {adjustment.status === 'draft' && user?.role === 'admin' && (
                        <Button variant="success" size="sm" onClick={() => handleApprove(adjustment)}>
                          <CheckCircle className="w-4 h-4 mr-1" /> Approve
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

      {/* Create Adjustment Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Stock Adjustment"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateAdjustment}>
              Create Adjustment
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Warehouse</label>
              <select
                className="input-base"
                value={formData.warehouseId}
                onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
              >
                {warehouses.map((wh: any) => (
                  <option key={wh.id} value={wh.id}>
                    {wh.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Adjustment Type</label>
              <select
                className="input-base"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Adjustment['type'] })}
              >
                {adjustmentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Adjustment Date"
            type="date"
            value={formData.adjustmentDate}
            onChange={(e) => setFormData({ ...formData, adjustmentDate: e.target.value })}
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
              {adjustmentLines.map((line, index) => (
                <div key={index} className="p-4 border border-border rounded-lg space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <select
                        className="input-base"
                        value={line.sku}
                        onChange={(e) => handleLineChange(index, 'sku', e.target.value)}
                      >
                        <option value="">Select Product</option>
                        {products.map((p: any) => (
                          <option key={p.id} value={p.sku}>
                            {p.sku} - {p.name} (Current: {p.totalStock || 0} {p.unit})
                          </option>
                        ))}
                      </select>
                    </div>
                    <Button variant="danger" size="sm" onClick={() => handleRemoveLine(index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  {line.sku && (
                    <>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs text-text-secondary">Current Qty</label>
                          <input
                            type="number"
                            className="input-base mt-1"
                            value={line.currentQty}
                            disabled
                          />
                        </div>
                        <div>
                          <label className="text-xs text-text-secondary">New Qty</label>
                          <input
                            type="number"
                            className="input-base mt-1"
                            value={line.newQty || ''}
                            onChange={(e) => handleLineChange(index, 'newQty', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-text-secondary">Adjustment</label>
                          <input
                            type="number"
                            className={`input-base mt-1 ${line.adjustmentQty > 0 ? 'text-success' : line.adjustmentQty < 0 ? 'text-danger' : ''}`}
                            value={line.adjustmentQty}
                            disabled
                          />
                        </div>
                      </div>
                      <input
                        type="text"
                        className="input-base"
                        placeholder="Reason for adjustment"
                        value={line.reason}
                        onChange={(e) => handleLineChange(index, 'reason', e.target.value)}
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Input
            label="Notes (Optional)"
            placeholder="Add any additional notes..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>
      </Modal>

      {/* Approve Modal */}
      {selectedAdjustment && (
        <Modal
          isOpen={isApproveModalOpen}
          onClose={() => setIsApproveModalOpen(false)}
          title="Approve Stock Adjustment"
          size="md"
          footer={
            <>
              <Button variant="secondary" onClick={() => setIsApproveModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="success" onClick={handleConfirmApprove}>
                Approve Adjustment
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">
              Are you sure you want to approve this stock adjustment? This will update the inventory quantities.
            </p>
            <div className="p-4 bg-background rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-text-secondary">Document #:</span>
                <span className="text-sm font-medium text-text-primary">{selectedAdjustment.documentNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-text-secondary">Warehouse:</span>
                <span className="text-sm font-medium text-text-primary">{selectedAdjustment.warehouseName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-text-secondary">Type:</span>
                {getTypeBadge(selectedAdjustment.type)}
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-text-secondary">Total Lines:</span>
                <span className="text-sm font-medium text-text-primary">{selectedAdjustment.totalLines}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-text-secondary">Total Increase:</span>
                <span className="text-sm font-medium text-success">+{selectedAdjustment.totalIncrease}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-text-secondary">Total Decrease:</span>
                <span className="text-sm font-medium text-danger">-{selectedAdjustment.totalDecrease}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
