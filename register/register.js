// Menetapkan CSS untuk Toastify secara dinamis
const style = document.createElement('style');
style.textContent = `
  .toastify {
    z-index: 9999 !important;
  }
`;
document.head.appendChild(style);

document.querySelector("#registerForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Mencegah form submit secara default

  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  // Validasi input
  if (!email || !password) {
    Toastify({
      text: "Email dan password harus diisi!",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      background: "linear-gradient(to right, #ff5f6d, #ffc371)",
    }).showToast();
    return;
  }

  // Mengirim data register ke server menggunakan Fetch API
  fetch('https://mardiyanaweb.vercel.app/register/register.html', { // Ubah ke endpoint yang sesuai
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: email,
      password: password
    })
  })
  .then(response => {
    // Cek apakah respons tidak ok
    if (!response.ok) {
      return response.text().then(text => {
        throw new Error(text || 'Gagal mendaftar');
      });
    }
    return response.json(); // Parsing JSON dari response
  })
  .then(data => {
    if (data.message === 'Registrasi berhasil!') {
      Toastify({
        text: "Registrasi berhasil!",
        duration: 3000, 
        close: true,
        gravity: "top", 
        position: "right", 
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      }).showToast();

      setTimeout(() => {
        window.location.href = "/login/login.html"; // Ganti ke halaman login
      }, 3000);
    } else {
      Toastify({
        text: data.message || "Terjadi kesalahan, coba lagi!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        background: "linear-gradient(to right, #ff5f6d, #ffc371)", 
      }).showToast();
    }
  })
  .catch(error => {
    Toastify({
      text: error.message || "Terjadi kesalahan saat menghubungi server.",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      background: "linear-gradient(to right, #ff5f6d, #ffc371)",
    }).showToast();
    console.error("Error:", error);
  });
});
