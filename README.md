# Sri Mukkanneshwara Associate - Banking System

A comprehensive banking and financial management system for Sri Mukkanneshwara Associate with both web and mobile app support.

## 🏦 Features

### Web Application
- **Member Management** - Complete member directory and profiles
- **Financial Tracking** - Account balances, deposits, and transactions
- **Loan Management** - Loan applications, tracking, and payments
- **Meeting Records** - Annual meeting documentation and decisions
- **Admin Dashboard** - Financial reports and user management
- **Rules & Regulations** - Association rules and guidelines

### Mobile App
- **Mobile-First Design** - Professional banking app interface
- **Progressive Web App (PWA)** - Installable mobile app
- **Offline Support** - Works without internet connection
- **Touch-Optimized** - Designed for mobile devices
- **Secure Authentication** - Same login system as web application

## 🚀 Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Google Apps Script, Google Sheets
- **Authentication**: Custom authentication system with Google Sheets integration
- **Mobile**: PWA with service worker and offline support
- **Styling**: Custom CSS with responsive design

## 📱 Mobile App Features

### Login System
- Secure authentication with username/password
- Session management with remember me option
- Automatic mobile redirect from desktop website

### Dashboard
- Account overview with balance information
- Quick actions for common tasks
- Recent activity and notifications
- Member directory with contact information

### Navigation
- Bottom tab navigation (Home, Accounts, Members, Loans, More)
- Touch-optimized interface
- Professional banking app design

## 🔧 Setup Instructions

### Prerequisites
- Google Apps Script account
- Google Sheets for data storage
- Web hosting (GitHub Pages, Netlify, etc.)

### Installation
1. Clone the repository
2. Configure Google Sheets integration
3. Set up Google Apps Script endpoints
4. Deploy to web hosting
5. Configure mobile app settings

### Mobile App Conversion
The website is ready for mobile app conversion using:
- Capacitor
- Cordova
- PWA Builder
- Online app builders

## 📁 Project Structure

```
Sri-Mukkaneshwara/
├── index.html              # Main website entry point
├── mobile-login.html       # Mobile app entry point
├── mobile/                 # Mobile app components
│   ├── mobile-styles.css   # Mobile-specific styling
│   ├── mobile-auth.js      # Mobile authentication
│   ├── mobile-navigation.js # Mobile navigation
│   ├── mobile-utils.js     # Mobile utilities
│   └── mobile-pwa.js       # PWA functionality
├── js/                     # JavaScript modules
│   ├── auth-utils.js       # Authentication utilities
│   ├── sheets-auth.js      # Google Sheets integration
│   └── user-header.js      # User interface
├── manifest.json           # PWA manifest
├── service-worker.js       # Offline support
└── styles.css             # Main website styling
```

## 🔐 Authentication

The system uses a custom authentication system with:
- Google Sheets as user database
- Secure password hashing
- Session management
- Role-based access control
- Mobile and web session sharing

## 📊 Data Management

- **Google Sheets** for data storage
- **Google Apps Script** for backend logic
- **CSV export** for data access
- **Real-time updates** with custom events

## 🌐 Deployment

### Web Hosting
- Upload files to web hosting service
- Configure domain and SSL
- Set up Google Apps Script endpoints

### Mobile App
- Use website-to-app conversion tools
- Set start URL to `mobile-login.html`
- Configure app settings and permissions
- Deploy to app stores

## 📱 Mobile App Conversion

The website is optimized for mobile app conversion with:
- Mobile-first design
- PWA features
- Offline support
- App store compatibility
- Professional banking interface

## 🔒 Security

- HTTPS required for all connections
- Secure authentication system
- Session timeout management
- Data encryption in transit
- Role-based access control

## 📞 Support

For technical support or questions:
- Check the documentation
- Review the code comments
- Test on different devices
- Verify Google Sheets integration

## 📄 License

This project is proprietary software for Sri Mukkanneshwara Associate.

## 🎯 Future Enhancements

- Push notifications
- Advanced reporting
- Payment integration
- Multi-language support
- Advanced mobile features

---

**Sri Mukkanneshwara Associate Banking System** - Professional financial management for association members.
