# Financial Data Google Sheet Setup

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new sheet
3. Name it "Financial Data" or "Association Finances"

## Step 2: Set up the columns

Create a sheet with these columns:

| Bank Balance | Available Loan Amount | Last Updated |
|--------------|----------------------|--------------|
| 183790       | 175000               | 2025-01-15   |

## Step 3: Get the CSV URL

1. Click "File" → "Share" → "Publish to web"
2. Choose "CSV" format
3. Copy the URL
4. Replace `YOUR_SHEET_ID` in `financial-data.js` with your actual sheet URL

## Step 4: Monthly Updates

Instead of editing code, just update the Google Sheet:
- Change the Bank Balance value
- Change the Available Loan Amount value  
- Update the Last Updated date
- The website will automatically reflect the changes!

## Benefits:
- ✅ No code editing required
- ✅ Multiple people can update
- ✅ Automatic updates
- ✅ Version history
- ✅ Easy to maintain

