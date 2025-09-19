// Configuration for Google Sheets CSV endpoints
// Replace the placeholder URLs with your Published CSV links from Google Sheets
// File -> Share -> Publish to the web -> Select sheet/tab -> CSV -> Copy URL

const SHEETS_CONFIG = {
    // Loans CSV should contain a header row with columns like:
    // year, loan_id, member, from, amount, interest, renewal_or_return_month, status, total_paid
    loansCsvUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQoBzlw6fdOJJYrh4uw4ej8r6Vwx0J_GiC0Ucd19ENrPYw20cDhDtpZe-oE-7-eRkEsSkp5mc1ziDIx/pub?gid=1900702647&single=true&output=csv',

    // Rules CSV should contain a header row with columns:
    // section, item
    rulesCsvUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRfIK3sa1N4kZgTWvYct5zWIGiURl8SZF4Xgf4d76FqPZS3cyMNNnURqm8UutszummyJ05V-_KUzhgQ/pub?gid=1919711588&single=true&output=csv'
};

// Optional: basic validation helper
function assertSheetsConfig() {
    if (!SHEETS_CONFIG || !SHEETS_CONFIG.loansCsvUrl || !SHEETS_CONFIG.rulesCsvUrl) {
        console.warn('SHEETS_CONFIG is missing CSV URLs. Please set them in sheets-config.js');
    }
}

assertSheetsConfig();


