(function() {
    async function loadDeposits(year, selectors) {
        try {
            if (!SHEETS_CONFIG || !SHEETS_CONFIG.depositsCsvUrl) {
                console.warn('Missing depositsCsvUrl in SHEETS_CONFIG');
                return;
            }
            const csv = await SheetsUtils.fetchCsv(SHEETS_CONFIG.depositsCsvUrl);
            const rows = SheetsUtils.parseCsv(csv);
            const items = SheetsUtils.rowsToObjects(rows);
            const filtered = year ? items.filter(r => String(r.year).trim() === String(year)) : items;

            renderTable(filtered, selectors);
        } catch (err) {
            console.error('Error loading deposits:', err);
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
            tr.className = 'deposit-row';

            tr.appendChild(cell(escapeHtml(r.member_name || '')));
            tr.appendChild(cell(formatDate(r.deposit_date)));
            tr.appendChild(cell(formatAmount(r.amount)));
            tr.appendChild(cell(depositTypeBadge(r.deposit_type)));
            tr.appendChild(cell(formatAmount(r.interest_earned)));
            tr.appendChild(cell(formatAmount(r.total_balance)));
            tr.appendChild(cell(escapeHtml(r.notes || '')));

            tbody.appendChild(tr);
        }

        // Append footer with totals
        const table = tbody.closest('table');
        if (table) {
            const existingFoot = table.querySelector('tfoot');
            if (existingFoot) existingFoot.remove();

            const tfoot = document.createElement('tfoot');
            
            // Calculate totals
            const totalDeposits = (items || []).reduce((sum, r) => {
                const raw = (r.amount || '').toString().replace(/[,\s]/g, '');
                const num = raw === '' ? NaN : Number(raw);
                return sum + (Number.isFinite(num) ? num : 0);
            }, 0);
            
            const totalInterest = (items || []).reduce((sum, r) => {
                const raw = (r.interest_earned || '').toString().replace(/[,\s]/g, '');
                const num = raw === '' ? NaN : Number(raw);
                return sum + (Number.isFinite(num) ? num : 0);
            }, 0);

            const totalBalance = (items || []).reduce((sum, r) => {
                const raw = (r.total_balance || '').toString().replace(/[,\s]/g, '');
                const num = raw === '' ? NaN : Number(raw);
                return sum + (Number.isFinite(num) ? num : 0);
            }, 0);

            // First row - Total Deposits
            const tr1 = document.createElement('tr');
            tr1.className = 'total-row';
            const labelTd1 = document.createElement('td');
            labelTd1.colSpan = 3;
            labelTd1.innerHTML = '<strong>Total Deposits</strong>';
            const amountTd = document.createElement('td');
            amountTd.innerHTML = `<strong>${formatAmount(totalDeposits)}</strong>`;
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
            labelTd2.colSpan = 3;
            labelTd2.innerHTML = '<strong>Total Interest Earned</strong>';
            const interestTd = document.createElement('td');
            interestTd.innerHTML = `<strong>${formatAmount(totalInterest)}</strong>`;
            const emptyTd2 = document.createElement('td');
            emptyTd2.colSpan = 4;
            tr2.appendChild(labelTd2);
            tr2.appendChild(interestTd);
            tr2.appendChild(emptyTd2);
            tfoot.appendChild(tr2);

            // Third row - Total Balance
            const tr3 = document.createElement('tr');
            tr3.className = 'total-row';
            const labelTd3 = document.createElement('td');
            labelTd3.colSpan = 3;
            labelTd3.innerHTML = '<strong>Total Balance</strong>';
            const balanceTd = document.createElement('td');
            balanceTd.innerHTML = `<strong>${formatAmount(totalBalance)}</strong>`;
            const emptyTd3 = document.createElement('td');
            emptyTd3.colSpan = 4;
            tr3.appendChild(labelTd3);
            tr3.appendChild(balanceTd);
            tr3.appendChild(emptyTd3);
            tfoot.appendChild(tr3);
            
            table.appendChild(tfoot);
        }
    }

    function cell(html) {
        const td = document.createElement('td');
        td.innerHTML = html;
        return td;
    }

    function depositTypeBadge(type) {
        const t = (type || '').toLowerCase();
        if (t === 'monthly') return '<span class="status-monthly">Monthly</span>';
        if (t === 'renewal') return '<span class="status-renewal">Renewal</span>';
        if (t === 'additional') return '<span class="status-additional">Additional</span>';
        return escapeHtml(type || '-');
    }

    function formatDate(dateStr) {
        if (!dateStr) return '-';
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr;
            return date.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch (e) {
            return dateStr;
        }
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

    window.DepositsRender = { loadDeposits };
})();

