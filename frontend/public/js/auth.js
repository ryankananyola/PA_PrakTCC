const API_BASE_URL = 'http://localhost:3000';

// Fungsi utama setelah DOM siap
document.addEventListener('DOMContentLoaded', function() {
    checkExistingSession();
    
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegisterSubmit);
    }
});

// Fungsi untuk mengecek session yang sudah ada
function checkExistingSession() {
    const authUser = localStorage.getItem('authUser');
    if (authUser) {
        const userData = JSON.parse(authUser);
        redirectBasedOnRole(userData.role);
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

// Fungsi untuk menangani registrasi
async function handleRegisterSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const registerBtn = document.getElementById('registerBtn');
    const errorMsg = document.getElementById('errorMsg');

    // Validasi input
    if (!name || !email || !phone || !password || !confirmPassword) {
        showError("Semua field harus diisi", errorMsg);
        return;
    }

    if (password !== confirmPassword) {
        showError("Password dan konfirmasi password tidak sama", errorMsg);
        return;
    }

    // Tampilkan loading
    registerBtn.disabled = true;
    document.getElementById('registerText').classList.add('hidden');
    document.getElementById('registerSpinner').classList.remove('hidden');

    try {
        const response = await fetch(`${API_BASE_URL}/users/register`, {
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
        showError(error.message, errorMsg);
    } finally {
        registerBtn.disabled = false;
        document.getElementById('registerText').classList.remove('hidden');
        document.getElementById('registerSpinner').classList.add('hidden');
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
    
    // Redirect berdasarkan role
    redirectBasedOnRole(userData.role);
}

// Fungsi untuk redirect berdasarkan role
function redirectBasedOnRole(role) {
    if (role === 'customer') {
        window.location.href = 'customer/dashboard-customer.html';
    } else if (role === 'admin') {
        window.location.href = 'admin/dashboard-admin.html';
    } else {
        console.warn('Role tidak dikenal:', role);
        window.location.href = 'index.html';
    }
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