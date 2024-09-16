document.addEventListener('DOMContentLoaded', function() {
    function initChatFeature(config) {
        const toastContainer = document.getElementById(config.toastContainerId);
        const chatBtn = document.getElementById(config.chatBtnId);

        function showToast(message, type = 'success') {
            const toast = document.createElement('div');
            toast.className = `bg-${type === 'success' ? 'green' : 'red'}-500 text-white p-3 rounded-lg shadow-lg mb-2`;
            toast.innerHTML = `<p>${message}</p>`;
            toastContainer.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        }

        chatBtn.addEventListener('click', function() {
            const phoneNumber = config.phoneNumber; // Update with actual phone number
            const message = encodeURIComponent(config.defaultMessage);

            // Redirect to WhatsApp
            window.location.href = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;

            showToast('Redirecting to WhatsApp...', 'success');
        });
    }

    // Initialize chat feature with config
    initChatFeature({
        toastContainerId: 'toastContainer',
        chatBtnId: 'whatsappChatBtn',
        phoneNumber: '+62895364454843', // Update with actual phone number
        defaultMessage: 'Hello, I would like to inquire about my purchase.'
    });
});
