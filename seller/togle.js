document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('pageToggle');
  
    // Fungsi untuk menangani perpindahan halaman
    function handleToggleChange() {
      if (toggle.checked) {
        // Jika toggle ON, arahkan ke halaman buy.html
        window.location.href = '/seller/seller.html'; // Ganti dengan path yang sesuai
      } else {
        // Jika toggle OFF, arahkan ke halaman seller.html
        window.location.href = '/buyer/buy.html'; // Ganti dengan path yang sesuai
      }
    }
  
    // Tambahkan event listener untuk menangani perubahan toggle
    toggle.addEventListener('change', handleToggleChange);
  
    // Set status toggle sesuai dengan halaman saat ini
//     if (window.location.pathname.endsWith('buy.html')) {
//       toggle.checked = false; // Toggle OFF untuk halaman buy.html
//     } else if (window.location.pathname.endsWith('seller.html')) {
//       toggle.checked = true; // Toggle ON untuk halaman seller.html
//     }
  });
  