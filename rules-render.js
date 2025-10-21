(function() {
    async function loadRules(selectors) {
        try {
            if (!SHEETS_CONFIG || !SHEETS_CONFIG.rulesCsvUrl) {
                console.warn('Missing rulesCsvUrl in SHEETS_CONFIG');
                return;
            }
            const csv = await SheetsUtils.fetchCsv(SHEETS_CONFIG.rulesCsvUrl);
            const rows = SheetsUtils.parseCsv(csv);
            const items = SheetsUtils.rowsToObjects(rows);

            // Group by section
            const groups = items.reduce((acc, r) => {
                const section = (r.section || '').trim().toLowerCase();
                if (!acc[section]) acc[section] = [];
                if (r.item && r.item.trim() !== '') acc[section].push(r.item.trim());
                return acc;
            }, {});

            renderSections(groups, selectors);
        } catch (err) {
            console.error('Error loading rules:', err);
        }
    }

    function renderSections(groups, selectors) {
        renderList(groups['membership'] || [], selectors.membershipListSelector);
        renderList(groups['loan'] || [], selectors.loanListSelector);
        renderList(groups['newmember'] || [], selectors.newMemberListSelector);
        renderList(groups['administrative'] || groups['admin'] || [], selectors.adminListSelector);
    }

    function renderList(items, selector) {
        const ul = document.querySelector(selector);
        if (!ul) return;
        SheetsUtils.clearElement(ul);
        for (const text of items) {
            const li = document.createElement('li');
            li.innerHTML = '<i class="fas fa-check"></i> ' + escapeHtml(text);
            ul.appendChild(li);
        }
    }

    function escapeHtml(s) {
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    window.RulesRender = { loadRules };
})();


