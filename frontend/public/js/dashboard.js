document.addEventListener('DOMContentLoaded', function() {
    // Cek session yang tersimpan
    const sessionData = localStorage.getItem('sessionData');
    
    if (!sessionData) {
        // Jika belum login, redirect ke dashboard.html
        window.location.href = '../dashboard.html';
        return;
    }
    
    try {
        const { user } = JSON.parse(sessionData);
        renderDashboard(user);
        
        // Logout functionality
        document.addEventListener('click', function(e) {
            if (e.target.id === 'logoutBtn') {
                localStorage.removeItem('sessionData');
                window.location.href = '../dashboard.html';
            }
        });
    } catch (e) {
        console.error('Error parsing session data:', e);
        localStorage.removeItem('sessionData');
        window.location.href = '../dashboard.html';
    }
});

function renderDashboard(user) {
    const app = document.getElementById('app');
    
    if (!app) return;
    
    app.innerHTML = `
        <nav class="bg-blue-600 text-white p-4">
            <div class="container mx-auto flex justify-between">
                <h1 class="text-xl font-bold">Dashboard LaundryRR</h1>
                <div class="flex items-center space-x-4">
                    <span>Halo, ${user.name} (${user.role})</span>
                    <button id="logoutBtn" class="bg-red-500 px-4 py-1 rounded">
                        Logout
                    </button>
                </div>
            </div>
        </nav>
        
        <main class="container mx-auto p-4">
            <div class="bg-white p-6 rounded-lg shadow">
                <h2 class="text-xl font-semibold mb-4">Selamat datang di sistem LaundryRR</h2>
                <p>Anda login sebagai: <strong>${user.role}</strong></p>
                <p>Email: ${user.email}</p>
                <!-- Tambahkan konten dashboard sesuai kebutuhan -->
            </div>
        </main>
    `;
}