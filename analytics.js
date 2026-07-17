// Simple client-side analytics tracker
// Stores data in localStorage - no external services needed

const Analytics = {
    storageKey: 'vote08_analytics',

    init() {
        this.trackPageView();
        this.attachEventListeners();
    },

    getStoredData() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : {
            pageViews: [],
            events: [],
            sessions: []
        };
    },

    saveData(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    },

    trackPageView() {
        const data = this.getStoredData();

        data.pageViews.push({
            timestamp: new Date().toISOString(),
            url: window.location.href,
            referrer: document.referrer || 'direct',
            userAgent: navigator.userAgent,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height
        });

        this.saveData(data);
    },

    trackEvent(eventName, properties = {}) {
        const data = this.getStoredData();

        data.events.push({
            timestamp: new Date().toISOString(),
            event: eventName,
            properties
        });

        this.saveData(data);
    },

    attachEventListeners() {
        // Track clicks on action buttons
        document.querySelectorAll('[data-umami-event]').forEach(el => {
            el.addEventListener('click', (e) => {
                const eventName = el.getAttribute('data-umami-event');
                this.trackEvent(eventName, {
                    href: el.href || '',
                    text: el.textContent.trim().substring(0, 100)
                });
            });
        });

        // Track location clicks
        document.addEventListener('click', (e) => {
            const locationItem = e.target.closest('.location-item');
            if (locationItem) {
                const locationName = locationItem.querySelector('h4')?.textContent || 'unknown';
                this.trackEvent('location-click', { location: locationName });
            }
        });

        // Track share button clicks
        const copyLinkBtn = document.getElementById('copyLinkBtn');
        if (copyLinkBtn) {
            copyLinkBtn.addEventListener('click', () => {
                this.trackEvent('copy-link');
            });
        }

        const copyToolkitBtn = document.getElementById('copyToolkitBtn');
        if (copyToolkitBtn) {
            copyToolkitBtn.addEventListener('click', () => {
                this.trackEvent('copy-toolkit-message');
            });
        }
    },

    exportData() {
        return this.getStoredData();
    },

    clearData() {
        localStorage.removeItem(this.storageKey);
    }
};

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Analytics.init());
} else {
    Analytics.init();
}

// Make Analytics available globally for dashboard
window.Vote08Analytics = Analytics;
