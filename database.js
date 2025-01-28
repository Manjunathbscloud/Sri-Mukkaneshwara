// Loan Database
const loanDatabase = {
    applications: {
        'LA2024001': {
            applicantId: 'MB004',
            amount: 50000,
            purpose: 'Business Expansion',
            applicationDate: '2024-02-15',
            status: 'pending',
            documents: ['income_proof', 'business_plan'],
            comments: []
        },
        // More applications...
    },
    
    activeLoans: {
        'L2024001': {
            memberId: 'SB003',
            amount: 30000,
            issueDate: '2024-01-10',
            dueDate: '2024-07-10',
            status: 'active',
            payments: [
                { date: '2024-02-10', amount: 5000 }
            ]
        },
        // More active loans...
    },

    notifications: {
        'MB001': [  // President's notifications
            {
                id: 'N2024001',
                type: 'new_application',
                message: 'New loan application from Mukkanna Banakar',
                date: '2024-02-15',
                read: false,
                relatedId: 'LA2024001'
            }
        ],
        'MB004': [  // Member's notifications
            {
                id: 'N2024002',
                type: 'application_status',
                message: 'Your loan application is under review',
                date: '2024-02-15',
                read: false,
                relatedId: 'LA2024001'
            }
        ]
    }
}; 