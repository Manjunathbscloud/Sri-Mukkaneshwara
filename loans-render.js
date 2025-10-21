(function() {
    async function loadLoans(year, selectors) {
        try {
            if (!window.SHEETS_CONFIG || !window.SHEETS_CONFIG.loansCsvUrl) {
                console.warn('Missing loansCsvUrl in SHEETS_CONFIG');
                return;
            }
            const csv = await window.SheetsUtils.fetchCsv(window.SHEETS_CONFIG.loansCsvUrl);
            const rows = window.SheetsUtils.parseCsv(csv);
            const items = window.SheetsUtils.rowsToObjects(rows);
            const filtered = year ? items.filter(r => String(r.year).trim() === String(year)) : items;

            renderTable(filtered, selectors);
        } catch (err) {
            console.error('Error loading loans:', err);
        }
    }

    function renderTable(items, selectors) {
        const tbody = document.querySelector(selectors.tbodySelector);
        if (!tbody) return;
        window.SheetsUtils.clearElement(tbody);

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

        // Append footer with total interest collected and total amount
        const table = tbody.closest('table');
        if (table) {
            const existingFoot = table.querySelector('tfoot');
            if (existingFoot) existingFoot.remove();

            const tfoot = document.createElement('tfoot');
            
            // Calculate totals
            const totalPaid = (items || []).reduce((sum, r) => {
                const raw = (r.total_paid || '').toString().replace(/[,\s]/g, '');
                const num = raw === '' ? NaN : Number(raw);
                return sum + (Number.isFinite(num) ? num : 0);
            }, 0);
            
            const totalAmount = (items || []).reduce((sum, r) => {
                const raw = (r.amount || '').toString().replace(/[,\s]/g, '');
                const num = raw === '' ? NaN : Number(raw);
                return sum + (Number.isFinite(num) ? num : 0);
            }, 0);

            const totalInterest = (items || []).reduce((sum, r) => {
                const raw = (r.interest || '').toString().replace(/[,\s]/g, '');
                const num = raw === '' ? NaN : Number(raw);
                return sum + (Number.isFinite(num) ? num : 0);
            }, 0);

            // First row - Total Amount (hidden by default, shown only when filters are applied)
            const tr1 = document.createElement('tr');
            tr1.className = 'total-row total-amount-row';
            tr1.style.display = 'none'; // Hidden by default
            const labelTd1 = document.createElement('td');
            labelTd1.colSpan = 3;
            labelTd1.innerHTML = '<strong>Total Amount (Filtered)</strong>';
            const amountTd = document.createElement('td');
            amountTd.innerHTML = `<strong>${formatAmount(totalAmount)}</strong>`;
            const emptyTd1 = document.createElement('td');
            emptyTd1.colSpan = 4;
            tr1.appendChild(labelTd1);
            tr1.appendChild(amountTd);
            tr1.appendChild(emptyTd1);
            tfoot.appendChild(tr1);

            // Second row - Total Interest
            const tr2 = document.createElement('tr');
            tr2.className = 'total-row';
            const labelTd2 = document.createElement('td');
            labelTd2.colSpan = 4;
            labelTd2.innerHTML = '<strong></strong>';
            const interestTd = document.createElement('td');
            interestTd.innerHTML = `<strong>${formatAmount(totalInterest)}</strong>`;
            const emptyTd2 = document.createElement('td');
            emptyTd2.colSpan = 3;
            tr2.appendChild(labelTd2);
            tr2.appendChild(interestTd);
            tr2.appendChild(emptyTd2);
            tfoot.appendChild(tr2);

            // Third row - Total Amount Paid
            const tr3 = document.createElement('tr');
            tr3.className = 'total-row';
            const labelTd3 = document.createElement('td');
            labelTd3.colSpan = 7;
            labelTd3.innerHTML = '<strong>Total Amount Paid</strong>';
            const totalTd = document.createElement('td');
            totalTd.innerHTML = `<strong>${formatAmount(totalPaid)}</strong>`;
            tr3.appendChild(labelTd3);
            tr3.appendChild(totalTd);
            tfoot.appendChild(tr3);
            
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
        return window.SheetsUtils.currency(value).replace(/\u00A0/g, ' ');
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


