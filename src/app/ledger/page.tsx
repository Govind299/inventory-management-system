'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Search, Filter, Download } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { ledgerAPI } from '@/services/api';
import { convertToCSV, downloadCSV } from '@/utils/csv';

export default function LedgerPage() {
  const { showToast } = useToast();
  const [entries, setEntries] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  useEffect(() => {
    loadLedger();
  }, []);

  const loadLedger = async () => {
    try {
      setIsLoading(true);
      const data = await ledgerAPI.getAll();
      // Sort by date descending
      setEntries(data.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (error) {
      showToast({ message: 'Failed to load ledger entries', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    const exportData = filteredEntries.map(entry => ({
      Date: new Date(entry.createdAt).toLocaleDateString(),
      Time: new Date(entry.createdAt).toLocaleTimeString(),
      'Document Number': entry.documentNumber,
      'Document Type': entry.documentType,
      Product: entry.productName,
      SKU: entry.sku,
      Location: entry.locationName,
      Quantity: entry.quantity,
      'Balance After': entry.balanceAfter,
      'Created By': entry.createdBy,
    }));
    const csv = convertToCSV(exportData);
    downloadCSV(csv, `stock-ledger-${new Date().toISOString().split('T')[0]}.csv`);
    showToast({ message: 'Ledger exported successfully', type: 'success' });
  };

  const getDocumentTypeBadge = (type: string) => {
    const badges: Record<string, { variant: any; label: string }> = {
      receipt: { variant: 'success', label: 'Receipt' },
      delivery: { variant: 'warning', label: 'Delivery' },
      transfer_in: { variant: 'info', label: 'Transfer In' },
      transfer_out: { variant: 'warning', label: 'Transfer Out' },
      adjustment: { variant: 'neutral', label: 'Adjustment' },
    };
    return badges[type] || { variant: 'neutral', label: type };
  };

  // Filter entries
  const filteredEntries = entries.filter(entry => {
    // Filter by type
    if (filterType !== 'all' && entry.documentType !== filterType) {
      return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        entry.documentNumber?.toLowerCase().includes(query) ||
        entry.productName?.toLowerCase().includes(query) ||
        entry.sku?.toLowerCase().includes(query) ||
        entry.locationName?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const columns = [
    {
      key: 'createdAt',
      header: 'Date & Time',
      width: '180px',
      render: (entry: any) => (
        <div className="text-sm">
          <div className="font-medium text-text-primary">
            {new Date(entry.createdAt).toLocaleDateString()}
          </div>
          <div className="text-text-tertiary text-xs">
            {new Date(entry.createdAt).toLocaleTimeString()}
          </div>
        </div>
      ),
    },
    {
      key: 'document',
      header: 'Document',
      width: '160px',
      render: (entry: any) => (
        <div className="text-sm">
          <div className="font-medium text-primary">{entry.documentNumber}</div>
          <div className="mt-1">
            <Badge variant={getDocumentTypeBadge(entry.documentType).variant} size="sm">
              {getDocumentTypeBadge(entry.documentType).label}
            </Badge>
          </div>
        </div>
      ),
    },
    {
      key: 'product',
      header: 'Product',
      render: (entry: any) => (
        <div className="text-sm">
          <div className="font-medium text-text-primary">{entry.productName}</div>
          <div className="text-text-tertiary text-xs">{entry.sku}</div>
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      width: '150px',
      render: (entry: any) => (
        <span className="text-sm text-text-secondary">{entry.locationName}</span>
      ),
    },
    {
      key: 'quantity',
      header: 'Quantity',
      width: '120px',
      render: (entry: any) => (
        <span
          className={`text-sm font-medium ${
            entry.quantity > 0 ? 'text-success' : 'text-danger'
          }`}
        >
          {entry.quantity > 0 ? '+' : ''}
          {entry.quantity}
        </span>
      ),
    },
    {
      key: 'balance',
      header: 'Balance After',
      width: '140px',
      render: (entry: any) => (
        <span className="text-sm font-medium text-text-primary">
          {entry.balanceAfter}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Stock Ledger</h1>
          <p className="text-sm text-text-secondary mt-1">
            Complete audit trail of all stock movements
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="md" leftIcon={<Download className="w-4 h-4" />} onClick={handleExport}>
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search by product, SKU, or document number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="w-48">
            <select
              className="input-base"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="receipt">Receipts</option>
              <option value="delivery">Deliveries</option>
              <option value="transfer_in">Transfers In</option>
              <option value="transfer_out">Transfers Out</option>
              <option value="adjustment">Adjustments</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-sm text-text-secondary mb-1">Total Entries</div>
          <div className="text-2xl font-semibold text-text-primary">{filteredEntries.length}</div>
        </Card>
        <Card>
          <div className="text-sm text-text-secondary mb-1">Receipts</div>
          <div className="text-2xl font-semibold text-success">
            {filteredEntries.filter((e) => e.documentType === 'receipt').length}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-text-secondary mb-1">Deliveries</div>
          <div className="text-2xl font-semibold text-warning">
            {filteredEntries.filter((e) => e.documentType === 'delivery').length}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-text-secondary mb-1">Adjustments</div>
          <div className="text-2xl font-semibold text-info">
            {filteredEntries.filter((e) => e.documentType === 'adjustment').length}
          </div>
        </Card>
      </div>

      {/* Ledger Table */}
      <Card padding={false}>
        <Table
          data={filteredEntries}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No ledger entries found."
          onRowClick={(entry) => console.log('View entry:', entry.id)}
        />
      </Card>
    </div>
  );
}
