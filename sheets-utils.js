// Lightweight CSV fetch and parse utilities

async function fetchCsv(url) {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Failed to fetch CSV: ${response.status}`);
    return await response.text();
}

function parseCsv(csvText) {
    // Simple CSV parser, handles quoted fields and commas
    const rows = [];
    let current = '';
    let row = [];
    let inQuotes = false;
    for (let i = 0; i < csvText.length; i++) {
        const char = csvText[i];
        if (char === '"') {
            if (inQuotes && csvText[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            row.push(current);
            current = '';
        } else if ((char === '\n' || char === '\r') && !inQuotes) {
            if (current !== '' || row.length) {
                row.push(current);
                rows.push(row);
                row = [];
                current = '';
            }
        } else {
            current += char;
        }
    }
    if (current !== '' || row.length) {
        row.push(current);
        rows.push(row);
    }
    return rows;
}

function rowsToObjects(rows) {
    if (!rows || rows.length === 0) return [];
    const headers = rows[0].map(h => h.trim());
    return rows.slice(1).filter(r => r.some(v => v && v.trim() !== '')).map(r => {
        const obj = {};
        headers.forEach((h, idx) => {
            obj[h] = (r[idx] || '').trim();
        });
        return obj;
    });
}

function currency(value) {
    if (value === undefined || value === null || value === '') return '-';
    const num = Number(String(value).replace(/[,\s]/g, ''));
    if (Number.isNaN(num)) return value;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num).replace('₹\u00A0', '₹');
}

function clearElement(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
}

window.SheetsUtils = { fetchCsv, parseCsv, rowsToObjects, currency, clearElement };


