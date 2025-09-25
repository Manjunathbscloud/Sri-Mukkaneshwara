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
        updateInterval: 5 * 60 * 1000, // 5 minutes
        
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
            const response = await fetch(FINANCIAL_DATA_CONFIG.financialDataUrl);
            const csv = await response.text();
            console.log('CSV Data:', csv);
            
            const rows = csv.split('\n');
            console.log('Rows:', rows);
            
            if (rows.length >= 2) {
                const headers = rows[0].split(',');
                const data = rows[1].split(',');
                
                console.log('Headers:', headers);
                console.log('Data:', data);
                
                // Clean the data (remove quotes and extra spaces)
                const bankBalance = parseFloat(data[0].replace(/"/g, '').trim()) || FINANCIAL_DATA_CONFIG.defaultValues.bankBalance;
                const availableLoanAmount = parseFloat(data[1].replace(/"/g, '').trim()) || FINANCIAL_DATA_CONFIG.defaultValues.availableLoanAmount;
                const lastUpdated = data[2].replace(/"/g, '').trim() || new Date().toISOString();
                
                console.log('Parsed data:', { bankBalance, availableLoanAmount, lastUpdated });
                
                return {
                    bankBalance: bankBalance,
                    availableLoanAmount: availableLoanAmount,
                    lastUpdated: lastUpdated
                };
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
            // Clear cache by adding timestamp to URL
            const timestamp = new Date().getTime();
            const urlWithTimestamp = FINANCIAL_DATA_CONFIG.financialDataUrl + '&t=' + timestamp;
            
            const response = await fetch(urlWithTimestamp);
            const csv = await response.text();
            console.log('CSV Data:', csv);
            
            const rows = csv.split('\n');
            console.log('Rows:', rows);
            
            if (rows.length >= 2) {
                const headers = rows[0].split(',');
                const data = rows[1].split(',');
                
                console.log('Headers:', headers);
                console.log('Data:', data);
                
                // Clean the data (remove quotes and extra spaces)
                const bankBalance = parseFloat(data[0].replace(/"/g, '').trim()) || FINANCIAL_DATA_CONFIG.defaultValues.bankBalance;
                const availableLoanAmount = parseFloat(data[1].replace(/"/g, '').trim()) || FINANCIAL_DATA_CONFIG.defaultValues.availableLoanAmount;
                const lastUpdated = data[2].replace(/"/g, '').trim() || new Date().toISOString();
                
                console.log('Parsed data:', { bankBalance, availableLoanAmount, lastUpdated });
                
                financialData = {
                    bankBalance: bankBalance,
                    availableLoanAmount: availableLoanAmount,
                    lastUpdated: lastUpdated
                };
                
                updateFinancialDisplay(financialData);
                lastUpdateTime = Date.now();
                console.log('Financial data updated successfully');
            }
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
        }, 30 * 1000); // Check every 30 seconds
    }

    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        loadFinancialData();
        startAutoUpdate();
    });

    // Manual refresh function
    function forceRefresh() {
        console.log('Force refreshing financial data...');
        lastUpdateTime = 0; // Reset cache
        loadFinancialData();
    }

    // Expose functions for manual updates
    window.FinancialData = {
        load: loadFinancialData,
        refresh: forceRefresh,
        update: updateFinancialDisplay,
        getData: () => financialData
    };
})();
