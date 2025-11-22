'use client';

import React from 'react';
import { KPICard } from '@/components/ui/KPICard';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Package,
  AlertTriangle,
  PackageX,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  Plus,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data - replace with actual API calls
const kpiData = {
  totalProducts: 1247,
  lowStock: 23,
  outOfStock: 5,
  pendingReceipts: 12,
  pendingDeliveries: 18,
  scheduledTransfers: 7,
};

const activityData = [
  { id: '1', type: 'receipt', description: 'Receipt #RCP-2024-001 validated', user: 'John Doe', timestamp: '2 minutes ago', documentNumber: 'RCP-2024-001' },
  { id: '2', type: 'delivery', description: 'Delivery #DEL-2024-045 shipped', user: 'Jane Smith', timestamp: '15 minutes ago', documentNumber: 'DEL-2024-045' },
  { id: '3', type: 'transfer', description: 'Transfer #TRN-2024-012 completed', user: 'Mike Johnson', timestamp: '1 hour ago', documentNumber: 'TRN-2024-012' },
  { id: '4', type: 'adjustment', description: 'Stock adjustment #ADJ-2024-008 processed', user: 'Sarah Williams', timestamp: '2 hours ago', documentNumber: 'ADJ-2024-008' },
  { id: '5', type: 'product_created', description: 'New product "Industrial Valve 3/4" created', user: 'John Doe', timestamp: '3 hours ago' },
];

const lowStockItems = [
  { id: '1', sku: 'PROD-001', name: 'Industrial Bolt M12', currentStock: 45, reorderPoint: 100, unit: 'pcs' },
  { id: '2', sku: 'PROD-015', name: 'Steel Plate 10mm', currentStock: 12, reorderPoint: 50, unit: 'pcs' },
  { id: '3', sku: 'PROD-032', name: 'Hydraulic Hose 1/2"', currentStock: 8, reorderPoint: 25, unit: 'meters' },
  { id: '4', sku: 'PROD-089', name: 'Bearing 6205-2RS', currentStock: 15, reorderPoint: 40, unit: 'pcs' },
  { id: '5', sku: 'PROD-124', name: 'Electric Motor 2HP', currentStock: 3, reorderPoint: 10, unit: 'pcs' },
];

const chartData = [
  { date: 'Mon', receipts: 24, deliveries: 18, adjustments: 3 },
  { date: 'Tue', receipts: 32, deliveries: 25, adjustments: 5 },
  { date: 'Wed', receipts: 28, deliveries: 22, adjustments: 2 },
  { date: 'Thu', receipts: 35, deliveries: 30, adjustments: 4 },
  { date: 'Fri', receipts: 42, deliveries: 35, adjustments: 6 },
  { date: 'Sat', receipts: 20, deliveries: 15, adjustments: 1 },
  { date: 'Sun', receipts: 15, deliveries: 12, adjustments: 2 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-secondary mt-1">
            Inventory overview and recent activities
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="md">
            Export Report
          </Button>
          <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
            Quick Actions
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <KPICard
          title="Total Products"
          value={kpiData.totalProducts.toLocaleString()}
          icon={<Package className="w-5 h-5" />}
          subtitle="In inventory"
        />
        <KPICard
          title="Low Stock Items"
          value={kpiData.lowStock}
          icon={<AlertTriangle className="w-5 h-5" />}
          variant="warning"
          subtitle="Below reorder point"
        />
        <KPICard
          title="Out of Stock"
          value={kpiData.outOfStock}
          icon={<PackageX className="w-5 h-5" />}
          variant="danger"
          subtitle="Requires attention"
        />
        <KPICard
          title="Pending Receipts"
          value={kpiData.pendingReceipts}
          icon={<ArrowDownToLine className="w-5 h-5" />}
          subtitle="Awaiting validation"
        />
        <KPICard
          title="Pending Deliveries"
          value={kpiData.pendingDeliveries}
          icon={<ArrowUpFromLine className="w-5 h-5" />}
          subtitle="To be shipped"
        />
        <KPICard
          title="Scheduled Transfers"
          value={kpiData.scheduledTransfers}
          icon={<ArrowLeftRight className="w-5 h-5" />}
          subtitle="In progress"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock Movement Chart */}
        <Card className="lg:col-span-2" padding={false}>
          <div className="p-6 border-b border-border">
            <CardHeader title="Stock Movement" subtitle="Last 7 days" />
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorReceipts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#117A65" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#117A65" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorDeliveries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E6E9EE" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 12, fill: '#475569' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E6E9EE',
                    borderRadius: '6px',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="receipts"
                  stroke="#117A65"
                  fillOpacity={1}
                  fill="url(#colorReceipts)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="deliveries"
                  stroke="#0EA5E9"
                  fillOpacity={1}
                  fill="url(#colorDeliveries)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-sm text-text-secondary">Receipts</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-info rounded-full"></div>
                <span className="text-sm text-text-secondary">Deliveries</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card padding={false}>
          <div className="p-6 border-b border-border">
            <CardHeader title="Recent Activity" />
          </div>
          <div className="p-4 max-h-[400px] overflow-y-auto">
            <div className="space-y-4">
              {activityData.map((activity) => (
                <div key={activity.id} className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center">
                    {activity.type === 'receipt' && <ArrowDownToLine className="w-4 h-4" />}
                    {activity.type === 'delivery' && <ArrowUpFromLine className="w-4 h-4" />}
                    {activity.type === 'transfer' && <ArrowLeftRight className="w-4 h-4" />}
                    {activity.type === 'adjustment' && <AlertTriangle className="w-4 h-4" />}
                    {activity.type === 'product_created' && <Package className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-text-tertiary">{activity.user}</span>
                      <span className="text-xs text-text-tertiary">•</span>
                      <span className="text-xs text-text-tertiary">{activity.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Low Stock Items */}
      <Card padding={false}>
        <div className="p-6 border-b border-border">
          <CardHeader
            title="Low Stock Items"
            subtitle={`${lowStockItems.length} products below reorder point`}
            action={
              <Button variant="secondary" size="sm">
                View All
              </Button>
            }
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-background">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">SKU</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Product Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Current Stock</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Reorder Point</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">Status</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-text-primary">Action</th>
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-border">
              {lowStockItems.map((item) => {
                const isVeryLow = item.currentStock < item.reorderPoint * 0.5;
                return (
                  <tr key={item.id} className="hover:bg-background transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-text-primary">{item.sku}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {item.currentStock} {item.unit}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {item.reorderPoint} {item.unit}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={isVeryLow ? 'danger' : 'warning'}>
                        {isVeryLow ? 'Critical' : 'Low'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm">
                        Create Receipt
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
