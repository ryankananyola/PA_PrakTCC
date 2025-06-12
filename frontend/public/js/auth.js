import { API_BASE_URL } from './utils.js';

const SESSION_TIMEOUT = 1000 * 60 * 30; // 30 menit

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe')?.checked || false;
            const loginBtn = document.getElementById('loginBtn');
            const errorMsg = document.getElementById('errorMsg');

            if (!email || !password) {
                showError("Email dan password harus diisi", errorMsg);
                return;
            }
            if (!validateEmail(email)) {
                showError("Format email tidak valid", errorMsg);
                return;
            }

            setLoadingState(true, loginBtn);

            try {
                const response = await fetch(`${API_BASE_URL}/users/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const result = await response.json();
                console.log('Login result:', result); // Debugging

                if (!response.ok) {
                    throw new Error(result.message || 'Login gagal');
                }

                if (!result.data || !result.data.role) {
                    throw new Error('Data pengguna tidak valid');
                }

                // Simpan session
                const sessionPayload = JSON.stringify({
                    user: result.data,
                    timestamp: Date.now(),
                    rememberMe
                });

                if (rememberMe) {
                    localStorage.setItem('sessionData', sessionPayload);
                } else {
                    sessionStorage.setItem('sessionData', sessionPayload);
                }

                handleSuccessfulLogin(result.data, result.accessToken);

            } catch (err) {
                showError(err.message || 'Terjadi kesalahan saat login', errorMsg);
            } finally {
                setLoadingState(false, loginBtn);
            }
        });
    }

    checkSession();

    const togglePasswordBtn = document.getElementById('togglePassword');
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', () => {
            const passwordInput = document.getElementById('password');
            const icon = togglePasswordBtn.querySelector('i');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    }
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(message, errorElement) {
    if (!errorElement) return;
    errorElement.classList.remove('hidden', 'bg-green-50', 'border-green-500', 'text-green-700');
    errorElement.classList.add('bg-red-50', 'border-red-500', 'text-red-700');
    errorElement.querySelector('#errorText').textContent = message;
    setTimeout(() => errorElement.classList.add('hidden'), 5000);
}

function setLoadingState(isLoading, button) {
    if (!button) return;
    const loginText = button.querySelector('#loginText');
    const loginSpinner = button.querySelector('#loginSpinner');

    button.disabled = isLoading;
    if (loginText && loginSpinner) {
        loginText.classList.toggle('hidden', isLoading);
        loginSpinner.classList.toggle('hidden', !isLoading);
    }
}

function checkSession() {
    const sessionData = localStorage.getItem('sessionData') || sessionStorage.getItem('sessionData');

    if (sessionData) {
        try {
            const { user, timestamp, rememberMe } = JSON.parse(sessionData);

            if (!rememberMe && (Date.now() - timestamp > SESSION_TIMEOUT)) {
                if (rememberMe) {
                    localStorage.removeItem('sessionData');
                } else {
                    sessionStorage.removeItem('sessionData');
                }
                return;
            }

            // Hanya redirect otomatis jika bukan di login page
            if (!window.location.pathname.includes('login.html')) {
                redirectBasedOnRole(user.role);
            }

        } catch (err) {
            console.error("Session parsing error:", err);
            localStorage.removeItem('sessionData');
            sessionStorage.removeItem('sessionData');
        }
    }
}

function redirectBasedOnRole(role) {
    role = role.toLowerCase();

    console.log('Redirecting for role:', role); 

    if (role === 'admin') {
        window.location.href = 'admin/dashboard-admin.html';
    } else if (role === 'customer') {
        window.location.href = 'customer/dashboard-customer.html';
    } else {
        console.warn('Role tidak dikenal:', role);
        window.location.href = 'login.html';
    }
}



function handleSuccessfulLogin(userData, accessToken) {
    console.log('Login sukses, user data:', userData); 

    localStorage.setItem('authUser', JSON.stringify({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        phone: userData.noHP || userData.phone,
        role: userData.role,
        token: accessToken // <-- simpan token di sini
    }));

    redirectBasedOnRole(userData.role);
}

// Hapus session jika browser ditutup (kecuali rememberMe aktif)
window.addEventListener('beforeunload', () => {
    const sessionData = localStorage.getItem('sessionData');
    if (sessionData) {
        try {
            const { rememberMe } = JSON.parse(sessionData);
            if (!rememberMe) localStorage.removeItem('sessionData');
        } catch {
            localStorage.removeItem('sessionData');
        }
    }
});
