document.querySelector("#registerForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Mencegah form submit secara default
  
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
  
    // Mengirim data register ke server menggunakan Fetch API
    fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: email,
        password: password
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Registrasi berhasil!') {
        // Tampilkan toast sukses jika registrasi berhasil
        Toastify({
          text: "Registrasi berhasil!",
          duration: 3000, // Durasi toast dalam milidetik
          close: true,
          gravity: "top", // Posisi atas
          position: "right", // Posisi kanan
          backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)", // Warna toast
        }).showToast();
  
        // Redirect ke halaman login setelah beberapa detik
        setTimeout(() => {
          window.location.href = "/login/login.html";
        }, 3000);
  
      } else {
        // Tampilkan toast error jika registrasi gagal
        Toastify({
          text: data.message || "Terjadi kesalahan, coba lagi!",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "right",
          backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)", // Warna error
        }).showToast();
      }
    })
    .catch(error => {
      // Tampilkan toast error jika ada masalah koneksi atau server
      Toastify({
        text: "Gagal terhubung ke server!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
      }).showToast();
      console.error("Error:", error);
    });
  });
  