const API_BASE_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', function() {
    // Toggle password visibility
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');

    if (togglePassword) {
        togglePassword.addEventListener('click', function () {
            const passwordInput = document.getElementById('password');
            const icon = this.querySelector('i');
            toggleVisibility(passwordInput, icon);
        });
    }

    if (toggleConfirmPassword) {
        toggleConfirmPassword.addEventListener('click', function () {
            const confirmInput = document.getElementById('confirmPassword');
            const icon = this.querySelector('i');
            toggleVisibility(confirmInput, icon);
        });
    }

    // Handle form registration
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const registerBtn = document.getElementById('registerBtn');

            // Validasi dasar
            if (!name || !email || !phone || !password || !confirmPassword) {
                return showError("Semua kolom harus diisi");
            }

            if (!validateEmail(email)) {
                return showError("Format email tidak valid");
            }

            if (phone.length < 9 || phone.length > 15) {
                return showError("Nomor HP harus antara 9–15 digit");
            }

            if (password.length < 8) {
                return showError("Password minimal 8 karakter");
            }

            if (password !== confirmPassword) {
                return showError("Password dan konfirmasi tidak cocok");
            }

            try {
                registerBtn.disabled = true;
                registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';

                const response = await fetch(`${API_BASE_URL}/users/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                        confirmPassword,
                        noHP: phone
                    })
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || 'Registrasi gagal');
                }

                // Redirect jika berhasil
                window.location.href = 'login.html?registered=true';
            } catch (error) {
                console.error('Error:', error);
                showError(error.message || 'Terjadi kesalahan saat registrasi');
            } finally {
                if (registerBtn) {
                    registerBtn.disabled = false;
                    registerBtn.innerHTML = 'Daftar';
                }
            }
        });
    }
});

// Fungsi untuk toggle visibility
function toggleVisibility(input, icon) {
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

// Fungsi tampilkan pesan error
function showError(message) {
    const errorMsgBox = document.getElementById('errorMsg');
    const errorText = document.getElementById('errorText');
    
    if (errorMsgBox && errorText) {
        errorText.textContent = message;
        errorMsgBox.classList.remove('hidden');

        setTimeout(() => {
            errorMsgBox.classList.add('hidden');
        }, 5000);
    }
}


// Validasi email sederhana
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
