export function exportToCSV(data: any[], filename: string) {
  if (!data || !data.length) {
    window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'No hay datos para exportar.', type: 'warning' } }));
    return;
  }
  
  // Get headers
  const headers = Object.keys(data[0]);
  
  // Format rows
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        let cell = row[header] === null || row[header] === undefined ? '' : row[header];
        // Escape quotes and wrap in quotes if there's a comma
        cell = String(cell).replace(/"/g, '""');
        if (cell.search(/("|,|\n)/g) >= 0) {
          cell = `"${cell}"`;
        }
        return cell;
      }).join(',')
    )
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: `Archivo ${filename}.csv exportado exitosamente.`, type: 'success' } }));
}
