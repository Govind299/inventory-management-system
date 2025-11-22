'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Card } from '@/components/ui/Card';
import { Plus, Search, Filter, Download, Upload } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { productAPI, categoryAPI } from '@/services/api';
import { convertToCSV, downloadCSV, parseCSV } from '@/utils/csv';
import { useAuth } from '@/contexts/AuthContext';
import { hasPermission } from '@/utils/permissions';

export default function ProductsPage() {
  const { showToast } = useToast();
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Debug: Log user role
  useEffect(() => {
    console.log('Products Page - User:', user);
    console.log('Products Page - Role:', user?.role);
    console.log('Can Create:', hasPermission('products', 'canCreate', user?.role));
    console.log('Can Import:', hasPermission('products', 'canImport', user?.role));
  }, [user]);

  // Load products and categories
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await productAPI.getAll();
      setProducts(data);
    } catch (error) {
      showToast({ message: 'Failed to load products', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoryAPI.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleCreateProduct = async (productData: any) => {
    try {
      const newProduct = {
        ...productData,
        id: `PROD-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await productAPI.create(newProduct);
      showToast({ message: 'Product created successfully', type: 'success' });
      loadProducts();
      setIsCreateModalOpen(false);
    } catch (error) {
      showToast({ message: 'Failed to create product', type: 'error' });
    }
  };

  const handleExport = () => {
    const csv = convertToCSV(filteredProducts);
    downloadCSV(csv, 'products.csv');
    showToast({ message: 'Products exported successfully', type: 'success' });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const csv = event.target?.result as string;
        const importedProducts = parseCSV(csv);
        
        for (const product of importedProducts) {
          const newProduct = {
            ...product,
            id: `PROD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          };
          await productAPI.create(newProduct);
        }
        
        showToast({ message: `${importedProducts.length} products imported successfully`, type: 'success' });
        loadProducts();
      } catch (error) {
        showToast({ message: 'Failed to import products', type: 'error' });
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Filter products based on search
  const filteredProducts = products.filter(product => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      product.sku?.toLowerCase().includes(query) ||
      product.name?.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query)
    );
  });

  const columns = [
    {
      key: 'sku',
      header: 'SKU',
      width: '120px',
      render: (product: any) => (
        <span className="font-medium text-text-primary">{product.sku}</span>
      ),
    },
    {
      key: 'name',
      header: 'Product Name',
      render: (product: any) => (
        <div>
          <div className="font-medium text-text-primary">{product.name}</div>
          {product.description && (
            <div className="text-xs text-text-tertiary mt-0.5">{product.description}</div>
          )}
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      width: '150px',
      render: (product: any) => (
        <Badge variant="neutral">{product.category || 'N/A'}</Badge>
      ),
    },
    {
      key: 'stock',
      header: 'Stock',
      width: '120px',
      render: (product: any) => {
        const totalStock = product.totalStock || 0;
        const isLow = product.reorderPoint && totalStock < product.reorderPoint;
        return (
          <span className={isLow ? 'text-warning font-medium' : 'text-text-secondary'}>
            {totalStock} {product.unit}
          </span>
        );
      },
    },
    {
      key: 'available',
      header: 'Available',
      width: '120px',
      render: (product: any) => {
        const totalAvailable = product.availableStock || 0;
        return (
          <span className="text-text-secondary">
            {totalAvailable} {product.unit}
          </span>
        );
      },
    },
    {
      key: 'reorder',
      header: 'Reorder Point',
      width: '120px',
      render: (product: any) => (
        <span className="text-text-tertiary text-sm">
          {product.reorderPoint || '-'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Products</h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage your inventory products and categories
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleImport}
            className="hidden"
          />
          {user?.role === 'admin' && (
            <Button 
              variant="secondary" 
              size="md" 
              leftIcon={<Upload className="w-4 h-4" />}
              onClick={handleImportClick}
            >
              Import CSV
            </Button>
          )}
          <Button 
            variant="secondary" 
            size="md" 
            leftIcon={<Download className="w-4 h-4" />}
            onClick={handleExport}
          >
            Export
          </Button>
          {user?.role === 'admin' && (
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Add Product
            </Button>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search by SKU, name, or description..."
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

      {/* Products Table */}
      <Card padding={false}>
        <Table
          data={filteredProducts}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No products found. Create your first product to get started."
          onRowClick={(product) => console.log('View product:', product.id)}
        />
      </Card>

      {/* Create Product Modal */}
      <CreateProductModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProduct}
        categories={categories}
      />
    </div>
  );
}

// Create Product Modal Component
interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  categories: any[];
}

function CreateProductModal({ isOpen, onClose, onSubmit, categories }: CreateProductModalProps) {
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    description: '',
    categoryId: '',
    category: '',
    unit: 'pcs',
    reorderPoint: '',
    reorderQuantity: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find category name
    const selectedCategory = categories.find(c => c.id === formData.categoryId);
    
    const productData = {
      sku: formData.sku,
      name: formData.name,
      description: formData.description,
      categoryId: formData.categoryId,
      category: selectedCategory?.name || formData.category,
      unit: formData.unit,
      reorderPoint: parseInt(formData.reorderPoint) || 0,
      reorderQuantity: parseInt(formData.reorderQuantity) || 0,
      totalStock: 0,
      availableStock: 0,
      reservedStock: 0,
    };
    
    onSubmit(productData);
    
    // Reset form
    setFormData({
      sku: '',
      name: '',
      description: '',
      categoryId: '',
      category: '',
      unit: 'pcs',
      reorderPoint: '',
      reorderQuantity: '',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Product"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Create Product
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="SKU *"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            placeholder="PROD-001"
            required
          />
          <Input
            label="Product Name *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Industrial Bolt M12"
            required
          />
        </div>

        <Input
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Product description..."
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Category *</label>
            <select
              className="input-base"
              value={formData.categoryId}
              onChange={(e) => {
                const cat = categories.find(c => c.id === e.target.value);
                setFormData({ ...formData, categoryId: e.target.value, category: cat?.name || '' });
              }}
              required
            >
              <option value="">Select category...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Unit of Measure *</label>
            <select
              className="input-base"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            >
              <option value="pcs">Pieces (pcs)</option>
              <option value="kg">Kilograms (kg)</option>
              <option value="meters">Meters (m)</option>
              <option value="liters">Liters (L)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Reorder Point"
            type="number"
            value={formData.reorderPoint}
            onChange={(e) => setFormData({ ...formData, reorderPoint: e.target.value })}
            placeholder="100"
            helperText="Alert when stock falls below this level"
          />
          <Input
            label="Reorder Quantity"
            type="number"
            value={formData.reorderQuantity}
            onChange={(e) => setFormData({ ...formData, reorderQuantity: e.target.value })}
            placeholder="500"
            helperText="Suggested order quantity"
          />
        </div>
      </form>
    </Modal>
  );
}
