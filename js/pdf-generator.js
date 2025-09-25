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
        // Background color for header
        this.pdf.setFillColor(52, 152, 219); // Blue background
        this.pdf.rect(0, 0, 210, 70, 'F');
        
        // Title with white text
        this.pdf.setTextColor(255, 255, 255); // White text
        this.pdf.setFontSize(22);
        this.pdf.setFont(undefined, 'bold');
        this.pdf.text(title, this.margin, 25);
        
        // Year with white text
        this.pdf.setFontSize(16);
        this.pdf.setFont(undefined, 'normal');
        this.pdf.text(`Year: ${year}`, this.margin, 35);
        
        // Date with white text
        this.pdf.setFontSize(12);
        this.pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, this.margin, 45);
        
        // Organization with white text
        this.pdf.setFontSize(14);
        this.pdf.setFont(undefined, 'bold');
        this.pdf.text('Sri Mukkanneshwara Associate', this.margin, 55);
        
        // Reset text color for content
        this.pdf.setTextColor(0, 0, 0); // Black text
        
        // Decorative line separator
        this.pdf.setLineWidth(2);
        this.pdf.setDrawColor(52, 152, 219);
        this.pdf.line(this.margin, 75, 190, 75);
    }

    addLoanTable(loanData) {
        if (!loanData || loanData.length === 0) {
            this.pdf.setFontSize(12);
            this.pdf.setTextColor(127, 140, 141); // Gray text
            this.pdf.text('No loan records found for this period.', this.margin, 90);
            return;
        }

        // Table headers with enhanced styling
        const headers = ['Loan ID', 'Member', 'From', 'Amount', 'Interest', 'Renewal/Return', 'Status', 'Total Paid'];
        const columnWidths = [25, 30, 20, 25, 20, 25, 15, 25];
        const startY = 90;
        let currentY = startY;

        // Add table headers with gradient background
        this.pdf.setFontSize(10);
        this.pdf.setFont(undefined, 'bold');
        this.pdf.setFillColor(44, 62, 80); // Dark blue background
        this.pdf.setTextColor(255, 255, 255); // White text
        
        let xPosition = this.margin;
        for (let i = 0; i < headers.length; i++) {
            this.pdf.rect(xPosition, currentY - 5, columnWidths[i], 8, 'F');
            this.pdf.text(headers[i], xPosition + 2, currentY);
            xPosition += columnWidths[i];
        }

        currentY += 10;

        // Add table data with alternating row colors
        this.pdf.setFont(undefined, 'normal');
        this.pdf.setTextColor(0, 0, 0); // Black text
        let rowCount = 0;

        for (let i = 0; i < loanData.length; i++) {
            const loan = loanData[i];
            
            // Check if we need a new page
            if (rowCount >= this.maxRowsPerPage) {
                this.pdf.addPage();
                this.addHeader('Loan Records (Continued)', loan.year || '');
                currentY = 90;
                rowCount = 0;
                
                // Re-add headers
                this.pdf.setFont(undefined, 'bold');
                this.pdf.setFillColor(44, 62, 80);
                this.pdf.setTextColor(255, 255, 255);
                xPosition = this.margin;
                for (let j = 0; j < headers.length; j++) {
                    this.pdf.rect(xPosition, currentY - 5, columnWidths[j], 8, 'F');
                    this.pdf.text(headers[j], xPosition + 2, currentY);
                    xPosition += columnWidths[j];
                }
                currentY += 10;
                this.pdf.setFont(undefined, 'normal');
                this.pdf.setTextColor(0, 0, 0);
            }

            // Alternating row background colors
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

            // Add row data with enhanced formatting
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

            // Color-code status
            const statusIndex = 6; // Status column index
            xPosition = this.margin;
            for (let j = 0; j < rowData.length; j++) {
                if (j === statusIndex) {
                    // Color-code status
                    if (loan.status === 'Active') {
                        this.pdf.setTextColor(39, 174, 96); // Green for Active
                    } else if (loan.status === 'Clear') {
                        this.pdf.setTextColor(52, 152, 219); // Blue for Clear
                    } else {
                        this.pdf.setTextColor(0, 0, 0); // Black for others
                    }
                } else {
                    this.pdf.setTextColor(0, 0, 0); // Black for other columns
                }
                
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

        // Summary section with enhanced styling
        this.pdf.setFillColor(52, 152, 219); // Blue background
        this.pdf.rect(this.margin - 5, currentY - 8, 190 - this.margin + 10, 12, 'F');
        
        this.pdf.setFontSize(14);
        this.pdf.setFont(undefined, 'bold');
        this.pdf.setTextColor(255, 255, 255); // White text
        this.pdf.text('📊 Summary Report', this.margin, currentY);
        currentY += 15;

        // Summary cards with background colors
        const summaryItems = [
            { label: 'Total Records', value: loanData.length, color: [39, 174, 96] },
            { label: 'Active Loans', value: activeLoans, color: [231, 76, 60] },
            { label: 'Clear Loans', value: clearLoans, color: [52, 152, 219] },
            { label: 'Total Amount', value: totalAmount > 0 ? `₹${this.formatNumber(totalAmount)}` : 'N/A', color: [155, 89, 182] },
            { label: 'Total Interest', value: totalInterest > 0 ? `₹${this.formatNumber(totalInterest)}` : 'N/A', color: [230, 126, 34] },
            { label: 'Total Paid', value: totalPaid > 0 ? `₹${this.formatNumber(totalPaid)}` : 'N/A', color: [46, 204, 113] }
        ];

        this.pdf.setFontSize(10);
        this.pdf.setFont(undefined, 'normal');
        
        let xPos = this.margin;
        let yPos = currentY;
        const cardWidth = 60;
        const cardHeight = 20;
        const cardsPerRow = 3;
        
        summaryItems.forEach((item, index) => {
            if (index > 0 && index % cardsPerRow === 0) {
                xPos = this.margin;
                yPos += cardHeight + 5;
            }
            
            // Card background
            this.pdf.setFillColor(item.color[0], item.color[1], item.color[2]);
            this.pdf.rect(xPos, yPos - 5, cardWidth, cardHeight, 'F');
            
            // Card text
            this.pdf.setTextColor(255, 255, 255);
            this.pdf.setFont(undefined, 'bold');
            this.pdf.text(item.label, xPos + 3, yPos + 3);
            this.pdf.setFont(undefined, 'normal');
            this.pdf.text(item.value.toString(), xPos + 3, yPos + 10);
            
            xPos += cardWidth + 5;
        });
    }

    addFooter() {
        const pageCount = this.pdf.internal.getNumberOfPages();
        
        for (let i = 1; i <= pageCount; i++) {
            this.pdf.setPage(i);
            
            // Footer background
            this.pdf.setFillColor(44, 62, 80);
            this.pdf.rect(0, this.pageHeight - 15, 210, 15, 'F');
            
            // Footer text
            this.pdf.setFontSize(8);
            this.pdf.setTextColor(255, 255, 255);
            this.pdf.text(`Page ${i} of ${pageCount}`, this.margin, this.pageHeight - 8);
            this.pdf.text(`Generated by Sri Mukkanneshwara Associate`, 190 - 60, this.pageHeight - 8);
            this.pdf.text(`Generated on ${new Date().toLocaleDateString()}`, this.margin, this.pageHeight - 4);
        }
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
        // Background color for header
        this.pdf.setFillColor(46, 204, 113); // Green background for deposits
        this.pdf.rect(0, 0, 210, 70, 'F');
        
        // Title with white text
        this.pdf.setTextColor(255, 255, 255); // White text
        this.pdf.setFontSize(22);
        this.pdf.setFont(undefined, 'bold');
        this.pdf.text(title, this.margin, 25);
        
        // Year with white text
        this.pdf.setFontSize(16);
        this.pdf.setFont(undefined, 'normal');
        this.pdf.text(`Year: ${year}`, this.margin, 35);
        
        // Date with white text
        this.pdf.setFontSize(12);
        this.pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, this.margin, 45);
        
        // Organization with white text
        this.pdf.setFontSize(14);
        this.pdf.setFont(undefined, 'bold');
        this.pdf.text('Sri Mukkanneshwara Associate', this.margin, 55);
        
        // Reset text color for content
        this.pdf.setTextColor(0, 0, 0); // Black text
        
        // Decorative line separator
        this.pdf.setLineWidth(2);
        this.pdf.setDrawColor(46, 204, 113);
        this.pdf.line(this.margin, 75, 190, 75);
    }

    addDepositTable(depositData) {
        if (!depositData || depositData.length === 0) {
            this.pdf.setFontSize(12);
            this.pdf.setTextColor(127, 140, 141); // Gray text
            this.pdf.text('No deposit records found for this period.', this.margin, 90);
            return;
        }

        // Table headers with enhanced styling
        const headers = ['Description', 'Details', 'Amount'];
        const columnWidths = [60, 80, 40];
        const startY = 90;
        let currentY = startY;

        // Add table headers with gradient background
        this.pdf.setFontSize(10);
        this.pdf.setFont(undefined, 'bold');
        this.pdf.setFillColor(46, 204, 113); // Green background for deposits
        this.pdf.setTextColor(255, 255, 255); // White text
        
        let xPosition = this.margin;
        for (let i = 0; i < headers.length; i++) {
            this.pdf.rect(xPosition, currentY - 5, columnWidths[i], 8, 'F');
            this.pdf.text(headers[i], xPosition + 2, currentY);
            xPosition += columnWidths[i];
        }

        currentY += 10;

        // Add table data with alternating row colors
        this.pdf.setFont(undefined, 'normal');
        this.pdf.setTextColor(0, 0, 0); // Black text
        
        for (let i = 0; i < depositData.length; i++) {
            const deposit = depositData[i];
            
            // Alternating row background colors
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

        // Summary section with enhanced styling
        this.pdf.setFillColor(46, 204, 113); // Green background for deposits
        this.pdf.rect(this.margin - 5, currentY - 8, 190 - this.margin + 10, 12, 'F');
        
        this.pdf.setFontSize(14);
        this.pdf.setFont(undefined, 'bold');
        this.pdf.setTextColor(255, 255, 255); // White text
        this.pdf.text('💰 Deposit Summary', this.margin, currentY);
        currentY += 15;

        // Summary cards with background colors
        const summaryItems = [
            { label: 'Total Records', value: depositData.length, color: [39, 174, 96] },
            { label: 'Total Amount', value: `₹${this.formatNumber(totalAmount)}`, color: [46, 204, 113] }
        ];

        this.pdf.setFontSize(10);
        this.pdf.setFont(undefined, 'normal');
        
        let xPos = this.margin;
        let yPos = currentY;
        const cardWidth = 80;
        const cardHeight = 20;
        
        summaryItems.forEach((item, index) => {
            // Card background
            this.pdf.setFillColor(item.color[0], item.color[1], item.color[2]);
            this.pdf.rect(xPos, yPos - 5, cardWidth, cardHeight, 'F');
            
            // Card text
            this.pdf.setTextColor(255, 255, 255);
            this.pdf.setFont(undefined, 'bold');
            this.pdf.text(item.label, xPos + 3, yPos + 3);
            this.pdf.setFont(undefined, 'normal');
            this.pdf.text(item.value.toString(), xPos + 3, yPos + 10);
            
            xPos += cardWidth + 10;
        });
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
