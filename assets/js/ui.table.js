/**
 * WorkBridge PH — Table utilities
 */

export function renderTable(columns, rows, opts = {}) {
  const { emptyMessage = 'No data found', rowClick } = opts;
  if (!rows || rows.length === 0) {
    return `<div class="empty-state"><p>${emptyMessage}</p></div>`;
  }
  let html = '<div class="table-wrap"><table class="table"><thead><tr>';
  columns.forEach(col => {
    html += `<th>${col.label}</th>`;
  });
  html += '</tr></thead><tbody>';
  rows.forEach((row, i) => {
    const tr = rowClick ? ` role="button" tabindex="0" data-row-index="${i}"` : '';
    html += `<tr${tr}>`;
    columns.forEach(col => {
      const val = typeof col.render === 'function' ? col.render(row[col.key], row) : (row[col.key] ?? '-');
      html += `<td>${val}</td>`;
    });
    html += '</tr>';
  });
  html += '</tbody></table></div>';
  return html;
}
