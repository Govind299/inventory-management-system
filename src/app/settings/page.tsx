'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader } from '@/components/ui/Card';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Modal, ConfirmModal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { warehouseAPI, userAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<any | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Redirect non-admin users
  useEffect(() => {
    if (user && user.role !== 'admin') {
      showToast({ message: 'Access denied. Admin privileges required.', type: 'error' });
      router.push('/dashboard');
    }
  }, [user, router, showToast]);
  
  const [warehouseForm, setWarehouseForm] = useState({
    name: '',
    code: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    loadWarehouses();
  }, []);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  const loadWarehouses = async () => {
    try {
      const data = await warehouseAPI.getAll();
      setWarehouses(data);
    } catch (error) {
      showToast({ message: 'Failed to load warehouses', type: 'error' });
    }
  };

  const handleAddWarehouse = async () => {
    if (!warehouseForm.name || !warehouseForm.code) {
      showToast({ message: 'Please fill all required fields', type: 'error' });
      return;
    }

    try {
      const newWarehouse = {
        id: `WH-${Date.now()}`,
        ...warehouseForm,
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      await warehouseAPI.create(newWarehouse);
      showToast({ message: 'Warehouse created successfully', type: 'success' });
      loadWarehouses();
      setIsWarehouseModalOpen(false);
      resetWarehouseForm();
    } catch (error) {
      showToast({ message: 'Failed to create warehouse', type: 'error' });
    }
  };

  const handleEditWarehouse = async () => {
    if (!selectedWarehouse) return;

    try {
      const updatedWarehouse = {
        ...selectedWarehouse,
        ...warehouseForm,
      };
      await warehouseAPI.update(selectedWarehouse.id, updatedWarehouse);
      showToast({ message: 'Warehouse updated successfully', type: 'success' });
      loadWarehouses();
      setIsWarehouseModalOpen(false);
      setIsEditMode(false);
      setSelectedWarehouse(null);
      resetWarehouseForm();
    } catch (error) {
      showToast({ message: 'Failed to update warehouse', type: 'error' });
    }
  };

  const handleDeleteWarehouse = async () => {
    if (!selectedWarehouse) return;

    try {
      await warehouseAPI.delete(selectedWarehouse.id);
      showToast({ message: 'Warehouse deleted successfully', type: 'success' });
      loadWarehouses();
      setIsDeleteModalOpen(false);
      setSelectedWarehouse(null);
    } catch (error) {
      showToast({ message: 'Failed to delete warehouse', type: 'error' });
    }
  };

  const openEditModal = (warehouse: any) => {
    setSelectedWarehouse(warehouse);
    setWarehouseForm({
      name: warehouse.name,
      code: warehouse.code,
      address: warehouse.address || '',
      city: warehouse.city || '',
      state: warehouse.state || '',
      zip: warehouse.zip || '',
    });
    setIsEditMode(true);
    setIsWarehouseModalOpen(true);
  };

  const resetWarehouseForm = () => {
    setWarehouseForm({
      name: '',
      code: '',
      address: '',
      city: '',
      state: '',
      zip: '',
    });
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    try {
      const updatedUser = {
        ...user,
        name: profileForm.name,
      };
      await userAPI.update(user.id, updatedUser);
      showToast({ message: 'Profile updated successfully', type: 'success' });
    } catch (error) {
      showToast({ message: 'Failed to update profile', type: 'error' });
    }
  };

  const handleUpdatePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      showToast({ message: 'Please fill all password fields', type: 'error' });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast({ message: 'New passwords do not match', type: 'error' });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showToast({ message: 'Password must be at least 6 characters', type: 'error' });
      return;
    }

    try {
      // In a real app, this would verify current password
      showToast({ message: 'Password updated successfully', type: 'success' });
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      showToast({ message: 'Failed to update password', type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Settings</h1>
        <p className="text-sm text-text-secondary mt-1">
          Manage warehouses, locations, and system preferences
        </p>
      </div>

      {/* Warehouses Section */}
      <Card>
        <CardHeader
          title="Warehouses"
          subtitle="Manage warehouse locations"
          action={
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsWarehouseModalOpen(true)}
            >
              Add Warehouse
            </Button>
          }
        />

        <div className="mt-6 space-y-3">
          {warehouses.map((warehouse) => (
            <div
              key={warehouse.id}
              className="flex items-center justify-between p-4 border border-border rounded hover:bg-background transition-colors"
            >
              <div className="flex-1">
                <div className="font-medium text-text-primary">{warehouse.name}</div>
                <div className="text-sm text-text-secondary mt-1">
                  {warehouse.code} • {warehouse.city || 'N/A'}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  leftIcon={<Edit2 className="w-3 h-3" />}
                  onClick={() => openEditModal(warehouse)}
                >
                  Edit
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  leftIcon={<Trash2 className="w-3 h-3" />}
                  onClick={() => {
                    setSelectedWarehouse(warehouse);
                    setIsDeleteModalOpen(true);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
          
          {warehouses.length === 0 && (
            <div className="text-center py-8 text-text-tertiary">
              No warehouses found. Click "Add Warehouse" to create one.
            </div>
          )}
        </div>
      </Card>

      {/* User Profile Section */}
      <Card>
        <CardHeader title="User Profile" subtitle="Update your account information" />

        <div className="mt-6 space-y-4 max-w-2xl">
          <Input 
            label="Name" 
            value={profileForm.name}
            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
          />
          <Input 
            label="Email" 
            type="email" 
            value={profileForm.email}
            disabled 
          />
          <Input 
            label="Role" 
            value={user?.role || 'User'}
            disabled 
          />
          <div className="flex justify-end pt-4">
            <Button variant="primary" onClick={handleUpdateProfile}>
              Save Changes
            </Button>
          </div>
        </div>
      </Card>

      {/* Security Section */}
      <Card>
        <CardHeader title="Security" subtitle="Manage your password and security settings" />

        <div className="mt-6 space-y-4 max-w-2xl">
          <Input 
            label="Current Password" 
            type="password"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
          />
          <Input 
            label="New Password" 
            type="password"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
          />
          <Input 
            label="Confirm New Password" 
            type="password"
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
          />
          <div className="flex justify-end pt-4">
            <Button variant="primary" onClick={handleUpdatePassword}>
              Update Password
            </Button>
          </div>
        </div>
      </Card>

      {/* Add/Edit Warehouse Modal */}
      <Modal
        isOpen={isWarehouseModalOpen}
        onClose={() => {
          setIsWarehouseModalOpen(false);
          setIsEditMode(false);
          setSelectedWarehouse(null);
          resetWarehouseForm();
        }}
        title={isEditMode ? "Edit Warehouse" : "Add Warehouse"}
        footer={
          <>
            <Button variant="secondary" onClick={() => {
              setIsWarehouseModalOpen(false);
              setIsEditMode(false);
              setSelectedWarehouse(null);
              resetWarehouseForm();
            }}>
              Cancel
            </Button>
            <Button variant="primary" onClick={isEditMode ? handleEditWarehouse : handleAddWarehouse}>
              {isEditMode ? "Update" : "Create"} Warehouse
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Warehouse Name *" 
              placeholder="Main Warehouse"
              value={warehouseForm.name}
              onChange={(e) => setWarehouseForm({ ...warehouseForm, name: e.target.value })}
              required 
            />
            <Input 
              label="Code *" 
              placeholder="WH-001"
              value={warehouseForm.code}
              onChange={(e) => setWarehouseForm({ ...warehouseForm, code: e.target.value })}
              required 
            />
          </div>
          <Input 
            label="Address" 
            placeholder="123 Industrial Park"
            value={warehouseForm.address}
            onChange={(e) => setWarehouseForm({ ...warehouseForm, address: e.target.value })}
          />
          <div className="grid grid-cols-3 gap-4">
            <Input 
              label="City" 
              placeholder="Mumbai"
              value={warehouseForm.city}
              onChange={(e) => setWarehouseForm({ ...warehouseForm, city: e.target.value })}
            />
            <Input 
              label="State" 
              placeholder="Maharashtra"
              value={warehouseForm.state}
              onChange={(e) => setWarehouseForm({ ...warehouseForm, state: e.target.value })}
            />
            <Input 
              label="Zip Code" 
              placeholder="400001"
              value={warehouseForm.zip}
              onChange={(e) => setWarehouseForm({ ...warehouseForm, zip: e.target.value })}
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedWarehouse(null);
        }}
        onConfirm={handleDeleteWarehouse}
        title="Delete Warehouse"
        message={`Are you sure you want to delete ${selectedWarehouse?.name}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
