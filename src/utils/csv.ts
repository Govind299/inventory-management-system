// CSV Utilities
export function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';

  const headers = ['SKU', 'Name', 'Description', 'Category', 'Unit', 'Reorder Point', 'Reorder Quantity', 'Total Stock', 'Available Stock'];
  const rows = data.map(product => [
    product.sku || '',
    product.name || '',
    product.description || '',
    product.category || '',
    product.unit || '',
    product.reorderPoint || '',
    product.reorderQuantity || '',
    product.totalStock || '',
    product.availableStock || '',
  ]);

  return [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
}

export function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function parseCSV(csv: string): any[] {
  const lines = csv.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const products = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    if (values.length >= 7) {
      products.push({
        sku: values[0],
        name: values[1],
        description: values[2],
        category: values[3],
        unit: values[4] || 'pcs',
        reorderPoint: parseInt(values[5]) || 0,
        reorderQuantity: parseInt(values[6]) || 0,
        totalStock: 0,
        availableStock: 0,
        reservedStock: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }

  return products;
}
