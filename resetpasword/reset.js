document.querySelector("#resetPasswordForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Mencegah form submit secara default
  
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const confirmPassword = document.querySelector("#confirm-password").value;
  
    // Validasi password
    if (password !== confirmPassword) {
      Toastify({
        text: "Passwords do not match!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
      }).showToast();
      return;
    }
  
    // Mengirim data reset password ke server menggunakan Fetch API
    fetch("/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        newPassword: password
      })
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(data => { throw new Error(data.message); });
      }
      return response.json(); // Parsing JSON dari response
    })
    .then(data => {
      Toastify({
        text: data.message || "Password reset successful!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
      }).showToast();
      // Redirect ke halaman login setelah reset password berhasil
      setTimeout(() => {
        window.location.href = "/login/login.html";
      }, 3000);
    })
    .catch(error => {
      Toastify({
        text: error.message,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
      }).showToast();
      console.error("Error:", error);
    });
  });
  