document.addEventListener('DOMContentLoaded', function() {
    const toastContainer = document.getElementById('toastContainer');
    const buyBtn = document.getElementById('buyBtn');

    // Function to show toast notification
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `bg-${type === 'success' ? 'green' : 'red'}-500 text-white p-3 rounded-lg shadow-lg mb-2`;
        toast.innerHTML = `<p>${message}</p>`;
        toastContainer.appendChild(toast);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // Function to handle buy action
    function handleBuy() {
        // Display a success toast notification
        showToast('Redirecting to purchase page...');

        // Redirect to purchase page after a short delay (e.g., 1 second)
        setTimeout(() => {
            window.location.href = 'purchase.html'; // Replace 'purchase.html' with the actual purchase page URL
        }, 1000);
    }

    // Add event listener to "Buy" button
    buyBtn.addEventListener('click', handleBuy);
});
