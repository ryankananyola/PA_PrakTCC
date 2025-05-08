// dashboard-admin.js
const API_BASE_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', function() {
    // Cek apakah user sudah login
    const authUser = JSON.parse(localStorage.getItem('authUser'));

    if (!authUser) {
        // Jika belum login, redirect ke halaman login
        window.location.href = 'login.html';
        return;
    }

    // Render dashboard
    renderDashboard(authUser);

    // Logout functionality
    document.addEventListener('click', function(e) {
        if (e.target.id === 'logoutBtn') {
            localStorage.removeItem('authUser');
            window.location.href = 'login.html';
        }
    });
});
document.addEventListener('DOMContentLoaded', function() {
    // Cek session user
    checkAuth();
    
    // Load data orders
    loadOrders();
    
    // Event listeners
    document.getElementById('logout-btn')?.addEventListener('click', logout);
    document.getElementById('search-input')?.addEventListener('input', handleSearch);
    document.getElementById('add-order-btn')?.addEventListener('click', showAddOrderModal);
    
    // Form edit order
    document.getElementById('edit-order-form')?.addEventListener('submit', handleEditOrder);
});

// Fungsi untuk cek autentikasi
function checkAuth() {
    const authUser = JSON.parse(localStorage.getItem('authUser'));
    if (!authUser || authUser.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }
    
    // Tampilkan nama admin di sidebar
    document.getElementById('admin-name').textContent = authUser.name;
    document.getElementById('admin-email').textContent = authUser.email;
}

// Fungsi untuk memuat data pesanan
async function loadOrders() {
    try {
        showLoading(true);
        
        const response = await fetch(`${API_BASE_URL}/orders`);
        if (!response.ok) {
            throw new Error('Gagal memuat data pesanan');
        }
        
        const data = await response.json();
        
        if (data.status !== "success") {
            throw new Error(data.message || 'Gagal memuat data pesanan');
        }
        
        displayOrders(data.data);
        updateStatistics(data.data);
        
    } catch (error) {
        showError(error.message);
    } finally {
        showLoading(false);
    }
}

// Fungsi untuk menampilkan data pesanan di tabel
function displayOrders(orders) {
    const tbody = document.getElementById('orders-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-4">Tidak ada data pesanan</td>
            </tr>
        `;
        return;
    }
    
    orders.forEach(order => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-gray-50';
        tr.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">${order.id}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                ${order.user ? order.user.name : 'Tidak ada data'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">${order.weight} kg</td>
            <td class="px-6 py-4 whitespace-nowrap">Rp${order.total_price.toLocaleString('id-ID')}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 rounded-full text-xs ${
                    order.status === 'Done' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                }">
                    ${order.status === 'Done' ? 'Selesai' : 'Proses'}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                ${new Date(order.created_at).toLocaleDateString('id-ID')}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <button class="edit-btn text-blue-600 hover:text-blue-900 mr-3" 
                    data-id="${order.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn text-red-600 hover:text-red-900" 
                    data-id="${order.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    // Tambahkan event listener untuk tombol aksi
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const orderId = e.currentTarget.getAttribute('data-id');
            editOrder(orderId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const orderId = e.currentTarget.getAttribute('data-id');
            confirmDelete(orderId);
        });
    });
}

// Fungsi untuk memperbarui statistik
function updateStatistics(orders) {
    const totalOrders = orders.length;
    const processingOrders = orders.filter(o => o.status === 'Processing').length;
    const completedOrders = orders.filter(o => o.status === 'Done').length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total_price, 0);
    
    document.getElementById('total-orders').textContent = totalOrders;
    document.getElementById('processing-orders').textContent = processingOrders;
    document.getElementById('completed-orders').textContent = completedOrders;
    document.getElementById('total-revenue').textContent = `Rp${totalRevenue.toLocaleString('id-ID')}`;
}

// Fungsi untuk edit order
async function editOrder(orderId) {
    try {
        showLoading(true);
        
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
        if (!response.ok) {
            throw new Error('Gagal mengambil data pesanan');
        }
        
        const data = await response.json();
        
        if (data.status !== "success") {
            throw new Error(data.message || 'Gagal mengambil data pesanan');
        }
        
        showEditModal(data.data);
        
    } catch (error) {
        showError(error.message);
    } finally {
        showLoading(false);
    }
}

// Fungsi untuk menampilkan modal edit
function showEditModal(order) {
    const modal = document.getElementById('edit-modal');
    document.getElementById('edit-order-id').value = order.id;
    document.getElementById('edit-weight').value = order.weight;
    document.getElementById('edit-price').value = order.total_price;
    document.getElementById('edit-status').value = order.status;
    
    // Tampilkan modal
    modal.classList.remove('hidden');
}

// Fungsi untuk handle edit order
async function handleEditOrder(e) {
    e.preventDefault();
    
    const orderId = document.getElementById('edit-order-id').value;
    const weight = document.getElementById('edit-weight').value;
    const price = document.getElementById('edit-price').value;
    const status = document.getElementById('edit-status').value;
    
    try {
        showLoading(true);
        
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                weight: parseFloat(weight),
                total_price: parseFloat(price),
                status
            })
        });
        
        if (!response.ok) {
            throw new Error('Gagal memperbarui pesanan');
        }
        
        const data = await response.json();
        
        if (data.status !== "success") {
            throw new Error(data.message || 'Gagal memperbarui pesanan');
        }
        
        // Tutup modal dan refresh data
        document.getElementById('edit-modal').classList.add('hidden');
        loadOrders();
        showSuccess('Pesanan berhasil diperbarui');
        
    } catch (error) {
        showError(error.message);
    } finally {
        showLoading(false);
    }
}

// Fungsi untuk konfirmasi hapus
function confirmDelete(orderId) {
    if (confirm('Apakah Anda yakin ingin menghapus pesanan ini?')) {
        deleteOrder(orderId);
    }
}

// Fungsi untuk menghapus order
async function deleteOrder(orderId) {
    try {
        showLoading(true);
        
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Gagal menghapus pesanan');
        }
        
        const data = await response.json();
        
        if (data.status !== "success") {
            throw new Error(data.message || 'Gagal menghapus pesanan');
        }
        
        // Refresh data
        loadOrders();
        showSuccess('Pesanan berhasil dihapus');
        
    } catch (error) {
        showError(error.message);
    } finally {
        showLoading(false);
    }
}

// Fungsi untuk menangani pencarian
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#orders-table-body tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// Fungsi untuk logout
function logout() {
    localStorage.removeItem('authUser');
    window.location.href = 'login.html';
}

// Fungsi untuk menampilkan loading
function showLoading(show) {
    const loader = document.getElementById('loader');
    const content = document.getElementById('content');
    
    if (!loader || !content) return;
    
    if (show) {
        loader.classList.remove('hidden');
        content.classList.add('hidden');
    } else {
        loader.classList.add('hidden');
        content.classList.remove('hidden');
    }
}

// Fungsi untuk menampilkan error
function showError(message) {
    const errorAlert = document.getElementById('error-alert');
    if (!errorAlert) return;
    
    errorAlert.textContent = message;
    errorAlert.classList.remove('hidden');
    
    setTimeout(() => {
        errorAlert.classList.add('hidden');
    }, 5000);
}

// Fungsi untuk menampilkan sukses
function showSuccess(message) {
    const successAlert = document.getElementById('success-alert');
    if (!successAlert) return;
    
    successAlert.textContent = message;
    successAlert.classList.remove('hidden');
    
    setTimeout(() => {
        successAlert.classList.add('hidden');
    }, 3000);
}