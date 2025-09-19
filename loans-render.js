(function() {
    async function loadLoans(year, selectors) {
        try {
            if (!SHEETS_CONFIG || !SHEETS_CONFIG.loansCsvUrl) {
                console.warn('Missing loansCsvUrl in SHEETS_CONFIG');
                return;
            }
            const csv = await SheetsUtils.fetchCsv(SHEETS_CONFIG.loansCsvUrl);
            const rows = SheetsUtils.parseCsv(csv);
            const items = SheetsUtils.rowsToObjects(rows);
            const filtered = year ? items.filter(r => String(r.year).trim() === String(year)) : items;

            renderTable(filtered, selectors);
        } catch (err) {
            console.error('Error loading loans:', err);
        }
    }

    function renderTable(items, selectors) {
        const tbody = document.querySelector(selectors.tbodySelector);
        if (!tbody) return;
        SheetsUtils.clearElement(tbody);

        // Hide any pre-existing no-records blocks if data exists
        if (items && items.length > 0) {
            document.querySelectorAll('.no-records').forEach(el => el.style.display = 'none');
        }

        // Call onDataLoaded callback if provided
        if (selectors.onDataLoaded && typeof selectors.onDataLoaded === 'function') {
            selectors.onDataLoaded(items || []);
        }

        if (!items || items.length === 0) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = 8;
            td.textContent = 'No Records Found';
            tr.appendChild(td);
            tbody.appendChild(tr);
            return;
        }

        for (const r of items) {
            const tr = document.createElement('tr');
            tr.className = r.status && r.status.toLowerCase() === 'completed' ? 'loan-row completed' : 'loan-row';

            tr.appendChild(cell(`<span class="loan-id">${escapeHtml(r.loan_id || '')}</span>`));
            tr.appendChild(cell(escapeHtml(r.member || '')));
            tr.appendChild(cell(escapeHtml(r.from || '')));
            tr.appendChild(cell(formatAmount(r.amount)));
            tr.appendChild(cell(formatAmount(r.interest)));
            tr.appendChild(cell(escapeHtml(r.renewal_or_return_month || '')));
            tr.appendChild(cell(statusBadge(r.status)));
            tr.appendChild(cell(formatAmount(r.total_paid)));

            tbody.appendChild(tr);
        }

        // Append footer with total interest collected (sum of numeric total_paid)
        const table = tbody.closest('table');
        if (table) {
            const existingFoot = table.querySelector('tfoot');
            if (existingFoot) existingFoot.remove();

            const tfoot = document.createElement('tfoot');
            const tr = document.createElement('tr');
            tr.className = 'total-row';

            const labelTd = document.createElement('td');
            labelTd.colSpan = 7;
            labelTd.innerHTML = '<strong>Total Interest Collected</strong>';

            const totalTd = document.createElement('td');
            const totalPaid = (items || []).reduce((sum, r) => {
                const raw = (r.total_paid || '').toString().replace(/[,\s]/g, '');
                const num = raw === '' ? NaN : Number(raw);
                return sum + (Number.isFinite(num) ? num : 0);
            }, 0);
            totalTd.innerHTML = `<strong>${formatAmount(totalPaid)}</strong>`;

            tr.appendChild(labelTd);
            tr.appendChild(totalTd);
            tfoot.appendChild(tr);
            table.appendChild(tfoot);
        }
    }

    function cell(html) {
        const td = document.createElement('td');
        td.innerHTML = html;
        return td;
    }

    function statusBadge(status) {
        const s = (status || '').toLowerCase();
        if (s === 'clear' || s === 'completed') return '<span class="status-clear">Clear</span>';
        if (s === 'active') return '<span class="status-active">Active</span>';
        return escapeHtml(status || '-');
    }

    function formatAmount(value) {
        if (value === undefined || value === null || value === '') return '-';
        return SheetsUtils.currency(value).replace(/\u00A0/g, ' ');
    }

    function escapeHtml(s) {
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    window.LoansRender = { loadLoans };
})();


