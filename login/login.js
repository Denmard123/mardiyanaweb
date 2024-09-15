// Menetapkan CSS untuk Toastify secara dinamis
const style = document.createElement('style');
style.textContent = `
  .toastify {
    z-index: 9999 !important;
  }
`;
document.head.appendChild(style);

document.querySelector("#loginForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Mencegah form submit secara default

  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  // Mengirim data login ke server menggunakan Fetch API
  fetch("/login", {
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
    if (!response.ok) {
      return response.json().then(data => { throw new Error(data.message); });
    }
    return response.json(); // Parsing JSON dari response
  })
  .then(data => {
    if (data.message === 'Login berhasil!') {
      // Redirect ke halaman buyer setelah login berhasil
      window.location.href = "/buyer/buy.html"; // Ganti dengan path yang sesuai
    } else {
      Toastify({
        text: data.message || "Terjadi kesalahan, coba lagi!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)", 
      }).showToast();
    }
  })
  .catch(error => {
    if (error.message === 'Email tidak terdaftar atau password salah!') {
      Toastify({
        text: "Email tidak terdaftar atau password salah!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)", 
      }).showToast();
    } else {
      Toastify({
        text: "Gagal terhubung ke server: " + error.message,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
      }).showToast();
    }
    console.error("Error:", error);
  });
});
