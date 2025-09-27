// PDF Generation System for Loan Data
class PDFGenerator {
    constructor() {
        this.pdf = null;
        this.currentPage = 1;
        this.maxRowsPerPage = 25;
        this.pageHeight = 280; // A4 page height in mm
        this.margin = 20;
        this.lineHeight = 8;
        this.init();
    }

    init() {
        // Load jsPDF library if not already loaded
        if (typeof window.jsPDF === 'undefined') {
            this.loadJsPDF();
        }
    }

    async loadJsPDF() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = () => {
                console.log('jsPDF library loaded successfully');
                // Make sure jsPDF is available globally
                if (typeof window.jsPDF === 'undefined' && typeof window.jspdf !== 'undefined') {
                    window.jsPDF = window.jspdf.jsPDF;
                }
                resolve();
            };
            script.onerror = () => {
                console.error('Failed to load jsPDF library');
                reject();
            };
            document.head.appendChild(script);
        });
    }

    async generateLoanPDF(year, loanData, title = 'Loan Records') {
        try {
            // Wait for jsPDF to be available
            if (typeof window.jsPDF === 'undefined') {
                await this.loadJsPDF();
                // Wait a bit more for the library to be fully available
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            // Check if jsPDF is available
            if (typeof window.jsPDF === 'undefined') {
                throw new Error('jsPDF library not loaded properly');
            }

            // Initialize PDF
            this.pdf = new window.jsPDF();
            this.currentPage = 1;

            // Add header
            this.addHeader(title, year);
            
            // Add loan data table
            this.addLoanTable(loanData);
            
            // Add footer
            this.addFooter();

            // Generate and download PDF
            const fileName = `Loan_Records_${year}_${new Date().toISOString().split('T')[0]}.pdf`;
            this.pdf.save(fileName);

            return true;
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
            return false;
        }
    }

    addHeader(title, year) {
        // Simple header with clean design
        this.pdf.setFontSize(18);
        this.pdf.setFont(undefined, 'bold');
        this.pdf.setTextColor(0, 0, 0);
        this.pdf.text(title, this.margin, 20);
        
        // Year and date
        this.pdf.setFontSize(12);
        this.pdf.setFont(undefined, 'normal');
        this.pdf.text(`Year: ${year}`, this.margin, 30);
        this.pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, this.margin, 35);
        
        // Organization
        this.pdf.setFontSize(10);
        this.pdf.text('Sri Mukkanneshwara Associate', this.margin, 42);
        
        // Simple line separator
        this.pdf.setLineWidth(0.5);
        this.pdf.setDrawColor(0, 0, 0);
        this.pdf.line(this.margin, 45, 190, 45);
    }

    addLoanTable(loanData) {
        if (!loanData || loanData.length === 0) {
            this.pdf.setFontSize(12);
            this.pdf.text('No loan records found for this period.', this.margin, 60);
            return;
        }

        // Simple table headers
        const headers = ['Loan ID', 'Member', 'From', 'Amount', 'Interest', 'Renewal/Return', 'Status', 'Total Paid'];
        const columnWidths = [25, 30, 20, 25, 20, 25, 15, 25];
        const startY = 60;
        let currentY = startY;

        // Add table headers with simple styling
        this.pdf.setFontSize(10);
        this.pdf.setFont(undefined, 'bold');
        this.pdf.setFillColor(240, 240, 240); // Light gray background
        this.pdf.setTextColor(0, 0, 0); // Black text
        
        let xPosition = this.margin;
        for (let i = 0; i < headers.length; i++) {
            this.pdf.rect(xPosition, currentY - 5, columnWidths[i], 8, 'F');
            this.pdf.text(headers[i], xPosition + 2, currentY);
            xPosition += columnWidths[i];
        }

        currentY += 10;

        // Add table data with simple formatting
        this.pdf.setFont(undefined, 'normal');
        this.pdf.setTextColor(0, 0, 0);
        let rowCount = 0;

        for (let i = 0; i < loanData.length; i++) {
            const loan = loanData[i];
            
            // Check if we need a new page
            if (rowCount >= this.maxRowsPerPage) {
                this.pdf.addPage();
                this.addHeader('Loan Records (Continued)', loan.year || '');
                currentY = 60;
                rowCount = 0;
                
                // Re-add headers
                this.pdf.setFont(undefined, 'bold');
                this.pdf.setFillColor(240, 240, 240);
                this.pdf.setTextColor(0, 0, 0);
                xPosition = this.margin;
                for (let j = 0; j < headers.length; j++) {
                    this.pdf.rect(xPosition, currentY - 5, columnWidths[j], 8, 'F');
                    this.pdf.text(headers[j], xPosition + 2, currentY);
                    xPosition += columnWidths[j];
                }
                currentY += 10;
                this.pdf.setFont(undefined, 'normal');
            }

            // Simple alternating row colors
            if (i % 2 === 0) {
                this.pdf.setFillColor(248, 249, 250); // Light gray
            } else {
                this.pdf.setFillColor(255, 255, 255); // White
            }
            
            // Draw row background
            xPosition = this.margin;
            for (let j = 0; j < columnWidths.length; j++) {
                this.pdf.rect(xPosition, currentY - 5, columnWidths[j], 8, 'F');
                xPosition += columnWidths[j];
            }

            // Add row data
            const rowData = [
                loan.loan_id || '',
                this.truncateText(loan.member || '', 25),
                loan.from || '',
                this.formatCurrency(loan.amount || 0),
                this.formatCurrency(loan.interest || 0),
                loan.renewal_or_return_month || '',
                loan.status || '',
                this.formatCurrency(loan.total_paid || 0)
            ];

            // Add text to cells
            xPosition = this.margin;
            for (let j = 0; j < rowData.length; j++) {
                this.pdf.text(rowData[j], xPosition + 2, currentY);
                xPosition += columnWidths[j];
            }

            currentY += this.lineHeight;
            rowCount++;
        }

        // Add summary
        this.addSummary(loanData, currentY + 10);
    }

    addSummary(loanData, startY) {
        if (!loanData || loanData.length === 0) return;

        let currentY = startY;
        
        // Debug: Log sample data
        console.log('Sample loan data:', loanData.slice(0, 2));
        
        // Calculate totals with proper currency parsing
        const totalAmount = loanData.reduce((sum, loan) => {
            const amount = this.parseCurrency(loan.amount);
            console.log('Amount:', loan.amount, 'Parsed:', amount);
            return sum + amount;
        }, 0);
        
        const totalInterest = loanData.reduce((sum, loan) => {
            const interest = this.parseCurrency(loan.interest);
            console.log('Interest:', loan.interest, 'Parsed:', interest);
            return sum + interest;
        }, 0);
        
        const totalPaid = loanData.reduce((sum, loan) => {
            const paid = this.parseCurrency(loan.total_paid);
            console.log('Total Paid:', loan.total_paid, 'Parsed:', paid);
            return sum + paid;
        }, 0);
        
        console.log('Calculated totals:', { totalAmount, totalInterest, totalPaid });
        
        const activeLoans = loanData.filter(loan => loan.status === 'Active').length;
        const clearLoans = loanData.filter(loan => loan.status === 'Clear').length;

        // Simple summary section
        this.pdf.setFontSize(12);
        this.pdf.setFont(undefined, 'bold');
        this.pdf.setTextColor(0, 0, 0);
        this.pdf.text('Summary', this.margin, currentY);
        currentY += 10;

        this.pdf.setFontSize(10);
        this.pdf.setFont(undefined, 'normal');
        
        this.pdf.text(`Total Records: ${loanData.length}`, this.margin, currentY);
        currentY += 8;
        
        this.pdf.text(`Active Loans: ${activeLoans}`, this.margin, currentY);
        currentY += 8;
        
        this.pdf.text(`Clear Loans: ${clearLoans}`, this.margin, currentY);
        currentY += 8;
        
        this.pdf.text(`Total Amount: ${totalAmount > 0 ? `₹${this.formatNumber(totalAmount)}` : 'N/A'}`, this.margin, currentY);
        currentY += 8;
        
        this.pdf.text(`Total Interest: ${totalInterest > 0 ? `₹${this.formatNumber(totalInterest)}` : 'N/A'}`, this.margin, currentY);
        currentY += 8;
        
        this.pdf.text(`Total Paid: ${totalPaid > 0 ? `₹${this.formatNumber(totalPaid)}` : 'N/A'}`, this.margin, currentY);
    }

    addFooter() {
        const pageCount = this.pdf.internal.getNumberOfPages();
        
        for (let i = 1; i <= pageCount; i++) {
            this.pdf.setPage(i);
            
            // Simple footer
            this.pdf.setFontSize(8);
            this.pdf.setTextColor(0, 0, 0);
            this.pdf.text(`Page ${i} of ${pageCount}`, this.margin, this.pageHeight - 10);
            this.pdf.text(`Generated by Sri Mukkanneshwara Associate`, 190 - 60, this.pageHeight - 10);
            
            // Add official seal
            this.addOfficialSeal();
        }
    }

    addOfficialSeal() {
        // Position seal in bottom right corner
        const sealX = 170; // Right side
        const sealY = this.pageHeight - 35; // Bottom area
        
        // Create the official seal exactly like your image
        // Outer thick dark blue border circle
        this.pdf.setDrawColor(0, 0, 139); // Dark blue color
        this.pdf.setLineWidth(3);
        this.pdf.circle(sealX, sealY, 20, 'S'); // Outer circle
        
        // Inner dark blue border circle
        this.pdf.setLineWidth(2);
        this.pdf.circle(sealX, sealY, 18, 'S');
        
        // Add "MUKKANESHWARA" text in upper arc (dark blue)
        this.pdf.setFontSize(6);
        this.pdf.setFont(undefined, 'bold');
        this.pdf.setTextColor(0, 0, 139); // Dark blue text
        
        // Position text in circular format like your image
        this.pdf.text('MUKKANESHWARA', sealX - 9, sealY - 14);
        
        // Add decorative dots on sides (dark blue)
        this.pdf.setFillColor(0, 0, 139);
        this.pdf.circle(sealX - 12, sealY - 14, 0.4, 'F');
        this.pdf.circle(sealX + 12, sealY - 14, 0.4, 'F');
        
        // ASSOCIATES text in lower arc (dark blue)
        this.pdf.text('ASSOCIATES', sealX - 6, sealY + 14);
        
        // Add decorative dots on sides for ASSOCIATES
        this.pdf.circle(sealX - 9, sealY + 14, 0.4, 'F');
        this.pdf.circle(sealX + 9, sealY + 14, 0.4, 'F');
        
        // Inner circle (dark blue)
        this.pdf.setLineWidth(1);
        this.pdf.circle(sealX, sealY, 14, 'S');
        
        // Add "MA" monogram in center (large, bold, dark blue)
        this.pdf.setFontSize(16);
        this.pdf.setFont(undefined, 'bold');
        this.pdf.setTextColor(0, 0, 139); // Dark blue
        this.pdf.text('MA', sealX - 4, sealY + 2);
        
        // Add "OFFICIAL SEAL" text below the seal
        this.pdf.setFontSize(5);
        this.pdf.setFont(undefined, 'bold');
        this.pdf.setTextColor(0, 0, 0);
        this.pdf.text('OFFICIAL SEAL', sealX - 5, sealY + 25);
        
        // Add date and signature line
        this.pdf.setFontSize(4);
        this.pdf.setFont(undefined, 'normal');
        this.pdf.text('Date:', sealX - 6, sealY + 28);
        this.pdf.text(new Date().toLocaleDateString('en-IN'), sealX - 6, sealY + 30);
        
        // Signature line
        this.pdf.setLineWidth(0.4);
        this.pdf.line(sealX - 12, sealY + 33, sealX + 12, sealY + 33);
        this.pdf.setFontSize(3.5);
        this.pdf.text('Authorized Signature', sealX - 5, sealY + 36);
    }

    formatCurrency(amount) {
        const parsedAmount = this.parseCurrency(amount);
        return this.formatNumber(parsedAmount);
    }

    parseCurrency(amount) {
        if (!amount) return 0;
        
        // Handle different currency formats
        let cleanAmount = String(amount);
        
        // Debug logging
        console.log('Original amount:', amount, 'Type:', typeof amount);
        
        // Remove currency symbols and commas
        cleanAmount = cleanAmount.replace(/[₹,]/g, '');
        
        // Handle quoted strings like "30,000"
        cleanAmount = cleanAmount.replace(/"/g, '');
        
        // Handle spaces and other characters
        cleanAmount = cleanAmount.replace(/\s/g, '');
        
        console.log('Cleaned amount:', cleanAmount);
        
        // Parse the number
        const parsed = parseFloat(cleanAmount);
        
        console.log('Parsed amount:', parsed);
        
        // Return 0 if parsing failed
        return isNaN(parsed) ? 0 : parsed;
    }

    formatNumber(num) {
        return new Intl.NumberFormat('en-IN').format(num);
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
    }

    // Static method to generate PDF for any loan page
    static async generateLoanPDF(year, loanData, title) {
        const generator = new PDFGenerator();
        return await generator.generateLoanPDF(year, loanData, title);
    }

    // Generate PDF for deposit data
    async generateDepositPDF(year, depositData, title = 'Deposit Records') {
        try {
            // Wait for jsPDF to be available
            if (typeof window.jsPDF === 'undefined') {
                await this.loadJsPDF();
                // Wait a bit more for the library to be fully available
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            // Check if jsPDF is available
            if (typeof window.jsPDF === 'undefined') {
                throw new Error('jsPDF library not loaded properly');
            }

            // Initialize PDF
            this.pdf = new window.jsPDF();
            this.currentPage = 1;

            // Add header
            this.addDepositHeader(title, year);
            
            // Add deposit data table
            this.addDepositTable(depositData);
            
            // Add footer
            this.addFooter();

            // Generate and download PDF
            const fileName = `Deposit_Records_${year}_${new Date().toISOString().split('T')[0]}.pdf`;
            this.pdf.save(fileName);

            return true;
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
            return false;
        }
    }

    addDepositHeader(title, year) {
        // Simple header for deposits
        this.pdf.setFontSize(18);
        this.pdf.setFont(undefined, 'bold');
        this.pdf.setTextColor(0, 0, 0);
        this.pdf.text(title, this.margin, 20);
        
        // Year and date
        this.pdf.setFontSize(12);
        this.pdf.setFont(undefined, 'normal');
        this.pdf.text(`Year: ${year}`, this.margin, 30);
        this.pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, this.margin, 35);
        
        // Organization
        this.pdf.setFontSize(10);
        this.pdf.text('Sri Mukkanneshwara Associate', this.margin, 42);
        
        // Simple line separator
        this.pdf.setLineWidth(0.5);
        this.pdf.setDrawColor(0, 0, 0);
        this.pdf.line(this.margin, 45, 190, 45);
    }

    addDepositTable(depositData) {
        if (!depositData || depositData.length === 0) {
            this.pdf.setFontSize(12);
            this.pdf.text('No deposit records found for this period.', this.margin, 60);
            return;
        }

        // Simple table headers
        const headers = ['Description', 'Details', 'Amount'];
        const columnWidths = [60, 80, 40];
        const startY = 60;
        let currentY = startY;

        // Add table headers with simple styling
        this.pdf.setFontSize(10);
        this.pdf.setFont(undefined, 'bold');
        this.pdf.setFillColor(240, 240, 240); // Light gray background
        this.pdf.setTextColor(0, 0, 0); // Black text
        
        let xPosition = this.margin;
        for (let i = 0; i < headers.length; i++) {
            this.pdf.rect(xPosition, currentY - 5, columnWidths[i], 8, 'F');
            this.pdf.text(headers[i], xPosition + 2, currentY);
            xPosition += columnWidths[i];
        }

        currentY += 10;

        // Add table data with simple formatting
        this.pdf.setFont(undefined, 'normal');
        this.pdf.setTextColor(0, 0, 0);
        
        for (let i = 0; i < depositData.length; i++) {
            const deposit = depositData[i];
            
            // Simple alternating row colors
            if (i % 2 === 0) {
                this.pdf.setFillColor(248, 249, 250); // Light gray
            } else {
                this.pdf.setFillColor(255, 255, 255); // White
            }
            
            // Draw row background
            xPosition = this.margin;
            for (let j = 0; j < columnWidths.length; j++) {
                this.pdf.rect(xPosition, currentY - 5, columnWidths[j], 8, 'F');
                xPosition += columnWidths[j];
            }
            
            // Add row data
            const rowData = [
                this.truncateText(deposit.description || '', 55),
                this.truncateText(deposit.details || '', 75),
                deposit.amount || ''
            ];

            xPosition = this.margin;
            for (let j = 0; j < rowData.length; j++) {
                this.pdf.text(rowData[j], xPosition + 2, currentY);
                xPosition += columnWidths[j];
            }

            currentY += this.lineHeight;
        }

        // Add summary
        this.addDepositSummary(depositData, currentY + 10);
    }

    addDepositSummary(depositData, startY) {
        if (!depositData || depositData.length === 0) return;

        let currentY = startY;
        
        // Calculate totals with proper currency parsing
        const totalAmount = depositData.reduce((sum, deposit) => {
            const amount = this.parseCurrency(deposit.amount);
            return sum + amount;
        }, 0);

        // Simple summary section
        this.pdf.setFontSize(12);
        this.pdf.setFont(undefined, 'bold');
        this.pdf.setTextColor(0, 0, 0);
        this.pdf.text('Summary', this.margin, currentY);
        currentY += 10;

        this.pdf.setFontSize(10);
        this.pdf.setFont(undefined, 'normal');
        
        this.pdf.text(`Total Records: ${depositData.length}`, this.margin, currentY);
        currentY += 8;
        
        this.pdf.text(`Total Amount: ${totalAmount > 0 ? `₹${this.formatNumber(totalAmount)}` : 'N/A'}`, this.margin, currentY);
    }

    // Static method to generate PDF for any deposit page
    static async generateDepositPDF(year, depositData, title) {
        const generator = new PDFGenerator();
        return await generator.generateDepositPDF(year, depositData, title);
    }
}

// Initialize PDF generator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.PDFGenerator = PDFGenerator;
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PDFGenerator;
}
