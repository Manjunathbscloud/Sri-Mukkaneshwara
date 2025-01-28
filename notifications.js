class NotificationSystem {
    static async sendNotification(userId, notification) {
        // Add notification to database
        if (!loanDatabase.notifications[userId]) {
            loanDatabase.notifications[userId] = [];
        }
        loanDatabase.notifications[userId].push(notification);

        // Show notification on UI if user is logged in
        this.showNotification(notification);

        // You can also implement email notifications here
        await this.sendEmailNotification(userId, notification);
    }

    static showNotification(notification) {
        // Create notification element
        const notifElement = document.createElement('div');
        notifElement.className = 'notification-toast';
        notifElement.innerHTML = `
            <i class="fas ${this.getNotificationIcon(notification.type)}"></i>
            <p>${notification.message}</p>
        `;

        // Add to notification container
        document.querySelector('.notification-container').appendChild(notifElement);

        // Remove after 5 seconds
        setTimeout(() => notifElement.remove(), 5000);
    }

    static getNotificationIcon(type) {
        const icons = {
            new_application: 'fa-file-invoice',
            application_status: 'fa-info-circle',
            payment_due: 'fa-clock',
            payment_received: 'fa-check-circle'
        };
        return icons[type] || 'fa-bell';
    }

    static async sendEmailNotification(userId, notification) {
        const member = memberDatabase[userId];
        if (member && member.email) {
            // Implement email sending logic here
            console.log(`Email sent to ${member.email}: ${notification.message}`);
        }
    }
} 