class NetworkStatus {
    constructor() {
        this.isOnline = navigator.onLine;
        this.setupListeners();
        this.updateStatus();
    }

    setupListeners() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.updateStatus();
            this.processQueuedEmails();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.updateStatus();
        });
    }

    updateStatus() {
        const indicator = document.querySelector('.status-indicator');
        if (this.isOnline) {
            indicator.classList.add('online');
            indicator.classList.remove('offline');
        } else {
            indicator.classList.add('offline');
            indicator.classList.remove('online');
        }
    }

    async processQueuedEmails() {
        try {
            console.log('Connection restored - processing queued emails...');
            const response = await fetch('/api/processQueue', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to process queue');
            }

            const result = await response.json();
            console.log('Queue processing result:', result);
        } catch (error) {
            console.error('Error processing queue:', error);
        }
    }
}

// Inicializar y exportar
const networkStatus = new NetworkStatus();
export default networkStatus;