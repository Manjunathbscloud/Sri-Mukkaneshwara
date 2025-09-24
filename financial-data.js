// Financial Data Management
// This file handles automatic updates of bank balance and loan amounts

(function() {
    // Configuration for financial data
    const FINANCIAL_DATA_CONFIG = {
        // JSON file path (simplest option)
        jsonDataUrl: 'financial-data.json',
        
        // Google Sheets CSV URL (your actual sheet)
        financialDataUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT0BPMTkSH8oDU7AYQLEcTxN-LHh86WLBMyfZH1eT4ABRCB8vwF2z7BBnzN0-SvaZZ0Apcwkkn08jyw/pub?output=csv',
        
        // Update frequency (in milliseconds)
        updateInterval: 24 * 60 * 60 * 1000, // 24 hours
        
        // Default values (fallback if data is not available)
        defaultValues: {
            bankBalance: 183790,
            availableLoanAmount: 175000,
            lastUpdated: new Date().toISOString()
        }
    };

    // Cache for financial data
    let financialData = null;
    let lastUpdateTime = null;

    // Fetch financial data from Google Sheets (preferred method)
    async function fetchFinancialData() {
        try {
            // Try Google Sheets first (preferred)
            if (!FINANCIAL_DATA_CONFIG.financialDataUrl.includes('YOUR_SHEET_ID')) {
                const response = await fetch(FINANCIAL_DATA_CONFIG.financialDataUrl);
                const csv = await response.text();
                const rows = csv.split('\n');
                
                if (rows.length >= 2) {
                    const headers = rows[0].split(',');
                    const data = rows[1].split(',');
                    
                    return {
                        bankBalance: parseFloat(data[0]) || FINANCIAL_DATA_CONFIG.defaultValues.bankBalance,
                        availableLoanAmount: parseFloat(data[1]) || FINANCIAL_DATA_CONFIG.defaultValues.availableLoanAmount,
                        lastUpdated: data[2] || new Date().toISOString()
                    };
                }
            }
        } catch (error) {
            console.warn('Could not fetch financial data from Google Sheets, trying JSON file...', error);
        }

        try {
            // Fallback to JSON file
            const response = await fetch(FINANCIAL_DATA_CONFIG.jsonDataUrl);
            if (response.ok) {
                const data = await response.json();
                return {
                    bankBalance: data.bankBalance || FINANCIAL_DATA_CONFIG.defaultValues.bankBalance,
                    availableLoanAmount: data.availableLoanAmount || FINANCIAL_DATA_CONFIG.defaultValues.availableLoanAmount,
                    lastUpdated: data.lastUpdated || new Date().toISOString()
                };
            }
        } catch (error) {
            console.warn('Could not fetch financial data from JSON file, using defaults...', error);
        }

        // Fallback to Google Sheets if JSON fails
        try {
            if (!FINANCIAL_DATA_CONFIG.financialDataUrl.includes('YOUR_SHEET_ID')) {
                const response = await fetch(FINANCIAL_DATA_CONFIG.financialDataUrl);
                const csv = await response.text();
                const rows = csv.split('\n');
                
                if (rows.length >= 2) {
                    const headers = rows[0].split(',');
                    const data = rows[1].split(',');
                    
                    return {
                        bankBalance: parseFloat(data[0]) || FINANCIAL_DATA_CONFIG.defaultValues.bankBalance,
                        availableLoanAmount: parseFloat(data[1]) || FINANCIAL_DATA_CONFIG.defaultValues.availableLoanAmount,
                        lastUpdated: data[2] || new Date().toISOString()
                    };
                }
            }
        } catch (error) {
            console.warn('Could not fetch financial data from sheet, using defaults:', error);
        }
        
        return FINANCIAL_DATA_CONFIG.defaultValues;
    }

    // Update the financial data on the page
    function updateFinancialDisplay(data) {
        // Update bank balance
        const bankBalanceElement = document.querySelector('.stat-card:nth-child(1) .stat-value');
        if (bankBalanceElement) {
            bankBalanceElement.textContent = `₹${data.bankBalance.toLocaleString('en-IN')}`;
        }

        // Update available loan amount
        const loanAmountElement = document.querySelector('.stat-card:nth-child(2) .stat-value');
        if (loanAmountElement) {
            loanAmountElement.textContent = `₹${data.availableLoanAmount.toLocaleString('en-IN')}`;
        }

        // Update last updated date
        const dateElements = document.querySelectorAll('.stat-date');
        dateElements.forEach(element => {
            if (element.textContent.includes('As of') || element.textContent.includes('For')) {
                const date = new Date(data.lastUpdated);
                const formattedDate = date.toLocaleDateString('en-IN', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
                element.textContent = element.textContent.includes('As of') 
                    ? `As of ${formattedDate}` 
                    : `For ${formattedDate}`;
            }
        });
    }

    // Load and update financial data
    async function loadFinancialData() {
        try {
            financialData = await fetchFinancialData();
            updateFinancialDisplay(financialData);
            lastUpdateTime = Date.now();
            console.log('Financial data updated successfully');
        } catch (error) {
            console.error('Error loading financial data:', error);
            // Use default values if loading fails
            updateFinancialDisplay(FINANCIAL_DATA_CONFIG.defaultValues);
        }
    }

    // Auto-update financial data
    function startAutoUpdate() {
        setInterval(async () => {
            const now = Date.now();
            if (!lastUpdateTime || (now - lastUpdateTime) > FINANCIAL_DATA_CONFIG.updateInterval) {
                await loadFinancialData();
            }
        }, 60 * 60 * 1000); // Check every hour
    }

    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        loadFinancialData();
        startAutoUpdate();
    });

    // Expose functions for manual updates
    window.FinancialData = {
        load: loadFinancialData,
        update: updateFinancialDisplay,
        getData: () => financialData
    };
})();
