const API_BASE_URL = 'http://localhost:3000';

// Fungsi utama setelah DOM siap
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const loginBtn = document.getElementById('loginBtn');
            const errorMsg = document.getElementById('errorMsg');

            // Validasi input
            if (!email || !password) {
                showError("Email dan password harus diisi", errorMsg);
                return;
            }

            // Tampilkan loading
            loginBtn.disabled = true;
            loginBtn.innerHTML = 'Memproses...';

            try {
                const response = await fetch('http://localhost:3000/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || 'Login gagal');
                }

                if (result.status === "success") {
                    // Simpan data user (tanpa password)
                    localStorage.setItem('authUser', JSON.stringify(result.data));
                
                    const userRole = result.data.role;
                
                    // Redirect berdasarkan role
                    if (userRole === 'customer') {
                        window.location.href = 'index.html';
                    } else if (userRole === 'admin') {
                        window.location.href = 'view/admin/dashboard-admin.html';
                    } else {
                        // Handle role yang tidak dikenal, mungkin arahkan ke halaman default
                        console.warn('Role tidak dikenal:', userRole);
                        window.location.href = 'index.html'; // Atau halaman default lainnya
                    }
                } else {
                    throw new Error(result.message || 'Terjadi kesalahan');
                }
            } catch (error) {
                console.error('Login error:', error);
                showError(error.message, errorMsg);
            } finally {
                // Reset button
                if (loginBtn) {
                    loginBtn.disabled = false;
                    loginBtn.innerHTML = 'Login';
                }
            }
        });
    }
});

// Fungsi untuk mengecek session yang sudah ada
function checkExistingSession() {
    const authUser = localStorage.getItem('authUser');
    if (authUser) {
        window.location.href = 'index.html';
    }
}

// Fungsi untuk menangani submit login
async function handleLoginSubmit(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('loginBtn');
    const errorMsg = document.getElementById('errorMsg');

    // Validasi input
    if (!validateInputs(email, password, errorMsg)) return;

    // Tampilkan loading state
    setLoadingState(true, loginBtn);

    try {
        // Proses login
        const loginResult = await processLogin(email, password);
        
        if (loginResult.success) {
            handleSuccessfulLogin(loginResult.data);
        } else {
            throw new Error(loginResult.message || 'Login gagal');
        }
    } catch (error) {
        handleLoginError(error, errorMsg);
    } finally {
        // Reset loading state
        setLoadingState(false, loginBtn);
    }
}

// Fungsi validasi input
function validateInputs(email, password, errorElement) {
    if (!email || !password) {
        showError("Email dan password harus diisi", errorElement);
        return false;
    }
    
    if (!validateEmail(email)) {
        showError("Format email tidak valid", errorElement);
        return false;
    }
    
    return true;
}

// Fungsi validasi format email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Fungsi untuk menampilkan error
function showError(message, errorElement) {
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
        
        setTimeout(() => {
            errorElement.classList.add('hidden');
        }, 5000);
    }
}

// Fungsi untuk mengatur loading state
function setLoadingState(isLoading, buttonElement) {
    if (isLoading) {
        buttonElement.disabled = true;
        buttonElement.innerHTML = `
            <span class="inline-block animate-spin mr-2">↻</span>
            Memproses...
        `;
    } else {
        buttonElement.disabled = false;
        buttonElement.innerHTML = 'Login';
    }
}

// Fungsi untuk memproses login
async function processLogin(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();
        
        if (!response.ok) {
            return {
                success: false,
                message: result.message || 'Terjadi kesalahan saat login'
            };
        }

        return {
            success: true,
            data: result.data || result.user
        };
    } catch (error) {
        console.error('Error in processLogin:', error);
        return {
            success: false,
            message: 'Koneksi ke server gagal'
        };
    }
}

// Fungsi untuk menangani login sukses
function handleSuccessfulLogin(userData) {
    // Simpan data user di localStorage
    localStorage.setItem('authUser', JSON.stringify({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        phone: userData.noHP || userData.phone,
        role: userData.role
    }));
    
    // Redirect ke halaman utama
    window.location.href = 'index.html';
}

// Fungsi untuk menangani error login
function handleLoginError(error, errorElement) {
    console.error('Login error:', error);
    
    let errorMessage = 'Terjadi kesalahan saat login';
    if (error.message) {
        errorMessage = error.message;
    } else if (error instanceof TypeError) {
        errorMessage = 'Koneksi ke server gagal';
    }
    
    showError(errorMessage, errorElement);
}

// Add this to your existing auth.js
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const registerBtn = document.getElementById('registerBtn');
    const errorMsg = document.getElementById('errorMsg');

    // Show loading
    registerBtn.disabled = true;
    document.getElementById('registerText').classList.add('hidden');
    document.getElementById('registerSpinner').classList.remove('hidden');

    try {
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

        // Redirect to login with success message
        window.location.href = 'login.html?registered=true';

    } catch (error) {
        console.error('Registration error:', error);
        errorMsg.querySelector('#errorText').textContent = error.message;
        errorMsg.classList.remove('hidden');
    } finally {
        registerBtn.disabled = false;
        document.getElementById('registerText').classList.remove('hidden');
        document.getElementById('registerSpinner').classList.add('hidden');
    }
});