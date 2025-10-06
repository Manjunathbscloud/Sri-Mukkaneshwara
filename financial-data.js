// Financial Data Management System
// This file handles loading and refreshing financial data from Google Sheets

class FinancialData {
    constructor() {
        this.googleSheetsUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT0BPMTkSH8oDU7AYQLEcTxN-LHh86WLBMyfZH1eT4ABRCB8vwF2z7BBnzN0-SvaZZ0Apcwkkn08jyw/pub?output=csv';
        this.currentData = null;
        this.init();
    }

    async init() {
        try {
            await this.loadFinancialData();
        } catch (error) {
            console.error('Error initializing financial data:', error);
            this.setDefaultData();
        }
    }

    async loadFinancialData() {
        try {
            console.log('Loading financial data from Google Sheets...');
            const response = await fetch(this.googleSheetsUrl);
            const csv = await response.text();
            
            if (csv && csv.trim()) {
                const rows = csv.split('\n');
                if (rows.length >= 2) {
                    const headers = rows[0].split(',');
                    const data = rows[1].split(',');
                    
                    // Clean the data (remove quotes and extra spaces)
                    const bankBalance = parseFloat(data[0].replace(/"/g, '').trim()) || 183790;
                    const availableLoanAmount = parseFloat(data[1].replace(/"/g, '').trim()) || 175000;
                    const lastUpdated = data[2].replace(/"/g, '').trim() || new Date().toISOString().split('T')[0];
                    
                    this.currentData = {
                        bankBalance: bankBalance,
                        availableLoanAmount: availableLoanAmount,
                        lastUpdated: lastUpdated
                    };
                    
                    this.updateDisplay();
                    console.log('Financial data loaded successfully:', this.currentData);
                    return this.currentData;
                }
            }
            
            // If no data available, use defaults
            this.setDefaultData();
            
        } catch (error) {
            console.error('Error loading financial data from Google Sheets:', error);
            this.setDefaultData();
        }
    }

    setDefaultData() {
        this.currentData = {
            bankBalance: 183790,
            availableLoanAmount: 175000,
            lastUpdated: new Date().toISOString().split('T')[0]
        };
        this.updateDisplay();
    }

    updateDisplay() {
        if (!this.currentData) return;

        // Update bank balance
        const bankBalanceElement = document.getElementById('bankBalance');
        if (bankBalanceElement) {
            bankBalanceElement.textContent = `₹${this.currentData.bankBalance.toLocaleString('en-IN')}`;
        }

        // Update available loan amount
        const loanAmountElement = document.getElementById('availableLoanAmount');
        if (loanAmountElement) {
            loanAmountElement.textContent = `₹${this.currentData.availableLoanAmount.toLocaleString('en-IN')}`;
        }

        // Update last updated date
        const lastUpdatedElement = document.getElementById('lastUpdated');
        if (lastUpdatedElement) {
            const date = new Date(this.currentData.lastUpdated);
            const formattedDate = date.toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            lastUpdatedElement.textContent = `As of ${formattedDate}`;
        }
    }

    async refresh() {
        console.log('Refreshing financial data...');
        try {
            await this.loadFinancialData();
            console.log('Financial data refreshed successfully');
        } catch (error) {
            console.error('Error refreshing financial data:', error);
        }
    }

    getCurrentData() {
        return this.currentData;
    }
}

// Initialize Financial Data when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize on accounts page
    if (window.location.pathname.includes('accounts.html') || window.location.pathname.endsWith('/')) {
        window.FinancialData = new FinancialData();
    }
});

// Global refresh function for backward compatibility
function refreshFinancialData() {
    if (window.FinancialData) {
        window.FinancialData.refresh();
    }
}
