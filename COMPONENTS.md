# Component Library Documentation

## Button Component

### Usage

```tsx
import { Button } from '@/components/ui/Button';

<Button variant="primary" size="md" leftIcon={<Icon />}>
  Click Me
</Button>
```

### Props

- `variant`: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `isLoading`: boolean
- `leftIcon`: ReactNode
- `rightIcon`: ReactNode

### Examples

```tsx
// Primary action
<Button variant="primary">Save</Button>

// Loading state
<Button variant="primary" isLoading>Saving...</Button>

// With icon
<Button variant="secondary" leftIcon={<Plus />}>Add Item</Button>

// Danger action
<Button variant="danger">Delete</Button>
```

---

## Input Component

### Usage

```tsx
import { Input } from '@/components/ui/Input';

<Input
  label="Email Address"
  type="email"
  placeholder="you@example.com"
  error={errors.email}
/>
```

### Props

- `label`: string
- `error`: string
- `helperText`: string
- `leftIcon`: ReactNode
- `rightIcon`: ReactNode

### Examples

```tsx
// Basic input
<Input label="Product Name" placeholder="Enter product name" />

// With error
<Input label="Email" error="Invalid email format" />

// With icon
<Input leftIcon={<Search />} placeholder="Search..." />

// With helper text
<Input label="SKU" helperText="Must be unique" />
```

---

## Card Component

### Usage

```tsx
import { Card, CardHeader } from '@/components/ui/Card';

<Card>
  <CardHeader title="Products" subtitle="123 items" />
  {/* Content */}
</Card>
```

### Props

- `padding`: boolean (default: true)
- `hover`: boolean
- `className`: string

---

## Table Component

### Usage

```tsx
import { Table } from '@/components/ui/Table';

const columns = [
  { key: 'name', header: 'Name', render: (item) => item.name },
  { key: 'status', header: 'Status', width: '120px' },
];

<Table
  data={items}
  columns={columns}
  onRowClick={(item) => console.log(item)}
  isLoading={false}
/>
```

### Column Definition

```tsx
interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
  width?: string;
}
```

---

## Modal Component

### Usage

```tsx
import { Modal, ConfirmModal } from '@/components/ui/Modal';

// Standard modal
<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Create Product"
  footer={<Button>Save</Button>}
>
  {/* Content */}
</Modal>

// Confirmation modal
<ConfirmModal
  isOpen={isOpen}
  onClose={onClose}
  onConfirm={handleConfirm}
  title="Delete Product"
  message="Are you sure you want to delete this product?"
  variant="danger"
/>
```

---

## Toast Component

### Usage

```tsx
import { useToast } from '@/components/ui/Toast';

const { showToast } = useToast();

showToast({
  message: 'Product created successfully',
  type: 'success',
  duration: 5000,
  action: {
    label: 'Undo',
    onClick: handleUndo,
  },
});
```

### Types

- `success`: Green checkmark
- `error`: Red alert
- `warning`: Orange warning
- `info`: Blue info

---

## Badge Component

### Usage

```tsx
import { Badge, getStatusBadge } from '@/components/ui/Badge';

<Badge variant="success">Active</Badge>

// Status helper
const { variant, label } = getStatusBadge('done');
<Badge variant={variant}>{label}</Badge>
```

### Variants

- `default`: Teal (primary)
- `success`: Green
- `warning`: Orange
- `danger`: Red
- `info`: Blue
- `neutral`: Gray

---

## KPICard Component

### Usage

```tsx
import { KPICard } from '@/components/ui/KPICard';

<KPICard
  title="Total Products"
  value={1247}
  icon={<Package />}
  variant="default"
  trend={{ value: 12, isPositive: true }}
  subtitle="Last 30 days"
/>
```

### Variants

- `default`: Standard border
- `warning`: Orange left border
- `danger`: Red left border
- `success`: Green left border

---

## Layout Components

### MainLayout

Wrapper component combining Sidebar and Topbar.

```tsx
import { MainLayout } from '@/components/layout/MainLayout';

<MainLayout
  user={{ name: 'John Doe', email: 'john@example.com', role: 'admin' }}
  onLogout={handleLogout}
>
  {/* Page content */}
</MainLayout>
```

### Sidebar

Navigation sidebar with collapsible functionality.

### Topbar

Top header with search, notifications, and user menu.

---

## Accessibility Guidelines

### Keyboard Navigation

- Tab: Navigate between interactive elements
- Enter/Space: Activate buttons
- Escape: Close modals/dialogs
- Arrow keys: Navigate lists/tables

### ARIA Labels

Always provide aria-labels for icon-only buttons:

```tsx
<button aria-label="Close modal">
  <X />
</button>
```

### Color Contrast

All text meets WCAG AA standards:
- Large text: 3:1 minimum
- Normal text: 4.5:1 minimum

### Focus States

All interactive elements have visible focus indicators.

---

## Design Tokens

Import design tokens for consistent styling:

```tsx
import { colors, spacing, fontSize } from '@/lib/design-tokens';

const customStyle = {
  color: colors.primary.DEFAULT,
  padding: spacing.base,
  fontSize: fontSize.base,
};
```

---

## Best Practices

### Component Composition

```tsx
// ✅ Good
<Card>
  <CardHeader title="Products" />
  <Table data={products} columns={columns} />
</Card>

// ❌ Avoid
<div className="card">
  <div className="card-header">...</div>
</div>
```

### Loading States

Always provide loading states for async operations:

```tsx
<Button isLoading={isSubmitting}>Save</Button>
<Table isLoading={isLoading} data={data} />
```

### Error Handling

Display errors inline with inputs:

```tsx
<Input
  label="Email"
  value={email}
  error={errors.email}
/>
```

### Confirmation Flows

Use ConfirmModal for destructive actions:

```tsx
<ConfirmModal
  title="Delete Product"
  message="This action cannot be undone."
  variant="danger"
  onConfirm={handleDelete}
/>
```
