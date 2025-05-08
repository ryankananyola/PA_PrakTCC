document.addEventListener('DOMContentLoaded', function() {
    // Toggle password visibility
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const icon = this.querySelector('i');
            toggleVisibility(passwordInput, icon);
        });
    }
    
    if (toggleConfirmPassword) {
        toggleConfirmPassword.addEventListener('click', function() {
            const confirmInput = document.getElementById('confirmPassword');
            const icon = this.querySelector('i');
            toggleVisibility(confirmInput, icon);
        });
    }

    // Handle form registration
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validasi input
            if (!name || !email || !phone || !password || !confirmPassword) {
                showError("Semua kolom harus diisi");
                return;
            }
            
            if (password !== confirmPassword) {
                showError("Password dan konfirmasi password tidak cocok");
                return;
            }
            
            if (password.length < 8) {
                showError("Password minimal 8 karakter");
                return;
            }

            try {
                // Tampilkan loading
                const registerBtn = document.getElementById('registerBtn');
                registerBtn.disabled = true;
                registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
                
                // Kirim data ke server
                const response = await fetch('http://localhost:3000/users/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
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
                
                // Redirect ke halaman login jika sukses
                window.location.href = 'login.html?registered=true';
                
            } catch (error) {
                console.error('Error:', error);
                showError(error.message || 'Terjadi kesalahan saat registrasi');
            } finally {
                const registerBtn = document.getElementById('registerBtn');
                if (registerBtn) {
                    registerBtn.disabled = false;
                    registerBtn.innerHTML = 'Daftar';
                }
            }
        });
    }
});

// Fungsi toggle visibility password
function toggleVisibility(input, icon) {
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

// Fungsi tampilkan error
function showError(message) {
    const errorElement = document.getElementById('errorMsg');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
        
        // Sembunyikan error setelah 5 detik
        setTimeout(() => {
            errorElement.classList.add('hidden');
        }, 5000);
    }
}