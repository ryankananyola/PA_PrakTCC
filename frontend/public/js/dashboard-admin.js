const API_BASE_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', function() {
    // Cek autentikasi admin
    checkAuth();

    // Load data orders dan payments
    loadOrders();
    loadPayments();

    // Event listeners
    document.getElementById('logout-btn')?.addEventListener('click', logout);
    document.getElementById('search-input-order')?.addEventListener('input', handleSearchOrders);
    document.getElementById('search-input-payment')?.addEventListener('input', handleSearchPayments);

    // Form edit order
    document.getElementById('edit-order-form')?.addEventListener('submit', handleEditOrder);

    // Event delegation untuk tombol edit dan delete order
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('edit-btn')) {
            const orderId = e.target.closest('button').getAttribute('data-id');
            editOrder(orderId);
        }
        if (e.target.classList.contains('delete-btn')) {
            const orderId = e.target.closest('button').getAttribute('data-id');
            confirmDelete(orderId);
        }
    });
});

// Fungsi untuk cek autentikasi admin
function checkAuth() {
    const authUser = JSON.parse(localStorage.getItem('authUser'));
    if (!authUser || authUser.role !== 'admin') {
        window.location.href = '../login.html'; // Sesuaikan path jika perlu
        return;
    }

    // Tampilkan nama admin di sidebar
    document.getElementById('admin-name').textContent = authUser.name;
    document.getElementById('admin-email').textContent = authUser.email;
}

// Fungsi untuk memuat data pesanan
async function loadOrders() {
    try {
        showLoading('order-loading', true);

        const response = await fetch(`${API_BASE_URL}/orders`);
        if (!response.ok) {
            throw new Error('Gagal memuat data pesanan');
        }

        const data = await response.json();

        if (data.status !== "success") {
            throw new Error(data.message || 'Gagal memuat data pesanan');
        }

        displayOrders(data.data);
        updateOrderStatistics(data.data);

    } catch (error) {
        showError('order-error', error.message);
    } finally {
        showLoading('order-loading', false);
    }
}

// Fungsi untuk menampilkan data pesanan di tabel
function displayOrders(orders) {
    const tbody = document.getElementById('orders-table-body');
    if (!tbody) {
        console.error('Tbody untuk pesanan tidak ditemukan');
        return;
    }

    if (orders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center py-4">Tidak ada data pesanan</td></tr>`;
        return;
    }

    let rows = '';

    orders.forEach(order => {
        // Tentukan label dan warna status order
        let statusLabel = '';
        let statusClass = '';
        switch (order.status) {
            case 'Pending':
                statusLabel = 'Pending';
                statusClass = 'bg-yellow-100 text-yellow-800';
                break;
            case 'Processing':
                statusLabel = 'Dalam Proses';
                statusClass = 'bg-blue-100 text-blue-800';
                break;
            case 'Done':
            case 'Selesai':
                statusLabel = 'Selesai';
                statusClass = 'bg-green-100 text-green-800';
                break;
            default:
                statusLabel = order.status || '-';
                statusClass = 'bg-gray-100 text-gray-800';
        }

        // Status bayar
        const paymentStatus = order.isPaid ? 'Lunas' : 'Belum Dibayar';
        const paymentClass = order.isPaid ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold';

        rows += `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">${order.id}</td>
                <td class="px-6 py-4 whitespace-nowrap">${order.user ? order.user.name : 'User tidak ditemukan'}</td>
                <td class="px-6 py-4 whitespace-nowrap">${order.weight ?? '0'} kg</td>
                <td class="px-6 py-4 whitespace-nowrap">Rp${order.total_price?.toLocaleString('id-ID') ?? '0'}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-block px-2 py-1 text-xs font-semibold ${statusClass} rounded-full">${statusLabel}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="${paymentClass}">${paymentStatus}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">${order.created_at ? new Date(order.created_at).toLocaleDateString('id-ID') : '-'}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <button data-id="${order.id}" class="edit-btn text-blue-500 hover:text-blue-700 mr-2"><i class="fas fa-edit"></i></button>
                    <button data-id="${order.id}" class="delete-btn text-red-500 hover:text-red-700"><i class="fas fa-trash-alt"></i></button>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = rows;
}


// Fungsi untuk memperbarui statistik pesanan
function updateOrderStatistics(orders) {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const processingOrders = orders.filter(o => o.status === 'Processing').length;
    const completedOrders = orders.filter(o => o.status === 'Done' || o.status === 'Selesai').length;

    const totalRevenue = orders
        .filter(order => (order.status === 'Done' || order.status === 'Selesai') && order.total_price)
        .reduce((sum, order) => sum + parseFloat(order.total_price), 0);

    document.getElementById('total-orders').textContent = totalOrders;
    document.getElementById('processing-orders').textContent = processingOrders;
    document.getElementById('completed-orders').textContent = completedOrders;
    document.getElementById('total-revenue').textContent = `Rp${totalRevenue.toLocaleString('id-ID')}`;
}


// Fungsi untuk memuat data pembayaran
async function loadPayments() {
    try {
        const response = await fetch(`${API_BASE_URL}/payments`);
        const data = await response.json();
        console.log("RESPON API:", data);

        // data langsung berupa array
        if (Array.isArray(data)) {
            displayPayments(data);  // langsung kirim array ke displayPayments
        } else {
            console.error("Format data pembayaran tidak sesuai:", data);
        }
    } catch (error) {
        console.error("Error saat memuat pembayaran:", error);
    }
}



// Fungsi untuk menampilkan data pembayaran di tabel
function displayPayments(payments) {
  const paymentsTableBody = document.getElementById("payments-table-body");
  paymentsTableBody.innerHTML = "";

  if (!payments || payments.length === 0) {
    paymentsTableBody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center py-4 text-gray-500">Tidak ada data pembayaran</td>
      </tr>`;
    return;
  }

  payments.forEach(payment => {
    const row = document.createElement("tr");
    row.classList.add("border-b", "border-gray-200", "hover:bg-gray-100");

    row.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap">${payment.id}</td>
      <td class="px-6 py-4 whitespace-nowrap">${payment.order_id}</td>
      <td class="px-6 py-4 whitespace-nowrap">Rp${(payment.amount ?? 0).toLocaleString('id-ID')}</td>
      <td class="px-6 py-4 whitespace-nowrap">${payment.status ? 'Lunas' : 'Pending'}</td>
      <td class="px-6 py-4 whitespace-nowrap">${new Date(payment.payment_date).toLocaleString("id-ID")}</td>
    `;

    paymentsTableBody.appendChild(row);
  });
}



// Fungsi untuk memperbarui statistik pembayaran
function updatePaymentStatistics(payments) {
  const totalPayments = payments.length;
  const pendingPayments = payments.filter(p => p.status === false).length;
  const completedPayments = payments.filter(p => p.status === true).length;
  const totalPaymentAmount = payments
    .filter(p => p.status === true)
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  document.getElementById('total-payments').textContent = totalPayments;
  document.getElementById('pending-payments').textContent = pendingPayments;
  document.getElementById('completed-payments').textContent = completedPayments;
  document.getElementById('total-payment-amount').textContent = `Rp${totalPaymentAmount.toLocaleString('id-ID')}`;
}




// Fungsi untuk edit order
async function editOrder(orderId) {
    try {
        showLoading('edit-modal-loading', true);

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
        showError('edit-modal-error', error.message);
    } finally {
        showLoading('edit-modal-loading', false);
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
        showLoading('edit-modal-loading', true);

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
        showError('edit-modal-error', error.message);
    } finally {
        showLoading('edit-modal-loading', false);
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
        showLoading('order-loading', true);

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
        showError('order-error', error.message);
    } finally {
        showLoading('order-loading', false);
    }
}

// Fungsi untuk menangani pencarian pesanan
function handleSearchOrders(e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#orders-table-body tr');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// Fungsi untuk menangani pencarian pembayaran
function handleSearchPayments(e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#payments-table-body tr');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// Fungsi untuk logout
function logout() {
    localStorage.removeItem('authUser');
    window.location.href = '../login.html'; // Sesuaikan path jika perlu
}

// Fungsi untuk menampilkan loading
function showLoading(elementId, show) {
    const loader = document.getElementById(elementId);
    if (!loader) return;

    if (show) {
        loader.classList.remove('hidden');
    } else {
        loader.classList.add('hidden');
    }
}

// Fungsi untuk menampilkan error
function showError(elementId, message) {
    const errorAlert = document.getElementById(elementId);
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