// Google Sheets Utilities
window.SheetsUtils = {
    async fetchCsv(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.text();
        } catch (error) {
            console.error('Error fetching CSV:', error);
            throw error;
        }
    },

    parseCsv(csvText) {
        const lines = csvText.split('\n');
        const rows = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line) {
                // Simple CSV parsing - split by comma but handle quoted values
                const row = this.parseCsvLine(line);
                if (row.length > 0) {
                    rows.push(row);
                }
            }
        }
        
        return rows;
    },

    parseCsvLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current.trim());
        return result;
    },

    rowsToObjects(rows) {
        if (rows.length === 0) return [];
        
        const headers = rows[0];
        const objects = [];
        
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (row.length >= headers.length) {
                const obj = {};
                for (let j = 0; j < headers.length; j++) {
                    obj[headers[j]] = row[j] || '';
                }
                objects.push(obj);
            }
        }
        
        return objects;
    },

    clearElement(element) {
        if (element) {
            element.innerHTML = '';
        }
    },

    currency(value) {
        if (value === undefined || value === null || value === '') return '-';
        const num = parseFloat(String(value).replace(/[^\d.-]/g, ''));
        if (isNaN(num)) return '-';
        return '₹' + num.toLocaleString('en-IN');
    }
};
