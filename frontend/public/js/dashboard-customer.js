import { API_BASE_URL } from './utils.js';

        const ORDERS_PER_PAGE = 5;
        let currentPage = 1;
        let allOrders = [];
        let currentUserId; // Menyimpan ID user yang sedang login

        document.addEventListener('DOMContentLoaded', function() {
            // Cek session user
            checkAuth();

            // Event listeners
            document.addEventListener('click', function(e) {
                if (e.target.id === 'logout-btn') { // Menggunakan ID yang benar dari HTML
                    logout();
                }
                if (e.target.classList.contains('edit-btn') || e.target.closest('.edit-btn')) {
                    const orderId = e.target.closest('.edit-btn').getAttribute('data-id');
                    editOrder(orderId);
                }
                if (e.target.classList.contains('delete-btn') || e.target.closest('.delete-btn')) {
                    const orderId = e.target.closest('.delete-btn').getAttribute('data-id');
                    confirmDelete(orderId);
                }
                if (e.target.classList.contains('pay-btn') || e.target.closest('.pay-btn')) {
                    const orderId = e.target.closest('.pay-btn').getAttribute('data-id');
                    window.location.href = `payment-customer.html?order_id=${orderId}`;
                }
                if (e.target.classList.contains('pagination-button')) {
                    currentPage = parseInt(e.target.getAttribute('data-page'));
                    renderOrderTable(allOrders, currentPage);
                }
            });

            document.getElementById('search-input-order')?.addEventListener('input', handleSearchOrders); // Menggunakan ID yang benar
            // document.getElementById('edit-order-form')?.addEventListener('submit', handleEditOrder);
        });

       function checkAuth() {
            const authUser = JSON.parse(localStorage.getItem('authUser'));
            if (!authUser || authUser.role !== 'customer') {
                window.location.href = '../login.html'; // Sesuaikan path jika perlu
                return;
            }
            currentUserId = authUser.id; // Simpan ID user
            renderDashboard(authUser);
            loadOrders(); // Panggil loadOrders setelah dashboard dirender
        }

        

        function renderDashboard(user) {
            const app = document.getElementById('app');

            app.innerHTML = `
                <nav class="bg-blue-600 text-white p-4 shadow-md">
                    <div class="container mx-auto flex justify-between items-center">
                        <h1 class="text-xl font-bold animate-pulse">Dashboard LaundryRR</h1>
                        <div class="flex items-center space-x-4">
                            <span>Halo, ${user.name} (${user.role})</span>
                            <button id="logout-btn" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Logout
                            </button>
                        </div>
                    </div>
                </nav>

                <main class="container mx-auto p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div class="bg-white rounded-lg shadow-sm p-6 animate-fade-in">
                              <div class="bg-white rounded-lg shadow-sm p-6 animate-fade-in flex items-center justify-between">
                                <div>
                                    <p class="text-gray-500 text-sm font-semibold">Total Pesanan</p>
                                    <h3 class="text-3xl font-bold text-blue-600" id="total-orders">0</h3>
                                </div>
                                <div class="p-3 rounded-full bg-blue-100 text-blue-600">
                                <i class="fas fa-box-open fa-lg"></i>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white rounded-lg shadow-sm p-6 animate-fade-in delay-100">
                             <div class="bg-white rounded-lg shadow-sm p-6 animate-fade-in delay-100 flex items-center justify-between">
                                <div>
                                    <p class="text-gray-500 text-sm font-semibold">Dalam Proses</p>
                                    <h3 class="text-3xl font-bold text-yellow-600" id="processing-orders">0</h3>
                                </div>
                                <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
                                    <i class="fas fa-spinner fa-lg animate-spin"></i>
                                </div>
                            </div>

                        </div>
                        <div class="bg-white rounded-lg shadow-sm p-6 animate-fade-in delay-200">
                            <div class="bg-white rounded-lg shadow-sm p-6 animate-fade-in delay-200 flex items-center justify-between">
                            <div>
                                <p class="text-gray-500 text-sm font-semibold">Selesai</p>
                                <h3 class="text-3xl font-bold text-green-600" id="completed-orders">0</h3>
                            </div>
                            <div class="p-3 rounded-full bg-green-100 text-green-600">
                                <i class="fas fa-check-circle fa-lg"></i>
                            </div>
                            </div>
                        </div>
                        
                    </div>

                    <!-- Ini yang baru -->
                    <div class="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                        <!-- Header -->
                        <div class="flex flex-col md:flex-row justify-between items-start md:items-center px-6 py-4 border-b">
                            <h2 class="text-xl font-semibold text-gray-800">Daftar Pesanan</h2>
                            <div class="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 mt-4 md:mt-0 w-full md:w-auto">
                            <div class="relative w-full md:w-auto">
                                <input type="text" id="search-input-order" placeholder="Cari pesanan..."
                                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200 transition duration-200">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i class="fas fa-search text-gray-400"></i>
                                </div>
                            </div>
                            <a href="create-order.html"
                                class="inline-flex items-center bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-lg transition duration-200 shadow">
                                <i class="fas fa-plus mr-2"></i> Tambah Pesanan
                            </a>
                            </div>
                        </div>

                        <!-- Loading / Error -->
                        <div id="order-loading" class="hidden flex justify-center py-4">
                            <div class="loading-spinner"></div>
                        </div>
                        <div id="order-error" class="hidden text-red-500 px-6 py-2"></div>

                        <!-- Table -->
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200 text-sm">
                            <thead class="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
                                <tr>
                                <th class="px-6 py-3 text-left">ID</th>
                                <th class="px-6 py-3 text-left">Pelanggan</th>
                                <th class="px-6 py-3 text-left">Berat</th>
                                <th class="px-6 py-3 text-left">Harga</th>
                                <th class="px-6 py-3 text-left">Status</th>
                                <th class="px-6 py-3 text-left">Tanggal</th>
                                <th class="px-6 py-3 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody id="orders-table-body">
                                <tr><td colspan="7" class="px-6 py-4 text-center text-gray-500">Memuat data pesanan...</td></tr>
                            </tbody>
                            </table>
                        </div>

                        <!-- Pagination -->
                        <div id="pagination-container" class="px-6 py-3 bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
                            <p class="text-sm text-gray-600" id="pagination-info">Menampilkan 1–3 dari 3</p>
                            <div class="space-x-2" id="pagination-buttons">
                                <!-- Tombol pagination akan di-render di sini -->
                            </div>
                        </div>
                    </div>
                </main>
            `;
        }

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

                allOrders = data.data; // Simpan semua order untuk pencarian dan paginasi
                renderOrderTable(allOrders, currentPage);
                updateOrderStatistics(allOrders);

            } catch (error) {
                showError('order-error', error.message);
            } finally {
                showLoading('order-loading', false);
                document.getElementById('loader-initial').classList.add('hidden'); // Sembunyikan loader awal
            }
        }

        function renderOrderTable(ordersToDisplay, page) {
            const tbody = document.getElementById('orders-table-body');
            const paginationContainer = document.getElementById('pagination-container');
            if (!tbody || !paginationContainer) return;

            tbody.innerHTML = '';
            const startIndex = (page - 1) * ORDERS_PER_PAGE;
            const endIndex = startIndex + ORDERS_PER_PAGE;
            const currentOrders = ordersToDisplay.slice(startIndex, endIndex);

            if (currentOrders.length === 0 && ordersToDisplay.length > 0) {
                // Jika tidak ada data di halaman saat ini tapi ada data total, kembali ke halaman terakhir
                currentPage = Math.ceil(ordersToDisplay.length / ORDERS_PER_PAGE);
                renderOrderTable(ordersToDisplay, currentPage);
                return;
            } else if (currentOrders.length === 0 && ordersToDisplay.length === 0) {
                tbody.innerHTML = `<tr><td colspan="7" class="px-6 py-4 whitespace-nowrap text-center text-gray-500">Tidak ada data pesanan</td></tr>`;
                paginationContainer.classList.add('hidden');
                return;
            } else {
                paginationContainer.classList.remove('hidden');
            }

            currentOrders.forEach(order => {
                const tr = document.createElement('tr');
                tr.className = 'hover:bg-gray-50 transition-all duration-200';

                // Tentukan status tampilan
                let statusLabel = '';
                let statusClass = '';
                if (order.status === 'Pending') {
                    statusLabel = 'Pending';
                    statusClass = 'bg-yellow-100 text-yellow-800';
                } else if (order.status === 'Processing') {
                    statusLabel = 'Dalam Proses';
                    statusClass = 'bg-blue-100 text-blue-800';
                } else if (order.status === 'Done') {
                    statusLabel = 'Selesai';
                    statusClass = 'bg-green-100 text-green-800';
                }

                // Tentukan aksi tombol bayar
                let payButtonHtml = '';
                if (currentUserId === order.user.id) {
                    if (order.isPaid) {
                        // Sudah dibayar, tombol bayar disable/abu-abu
                        payButtonHtml = `<span class="text-gray-400 cursor-not-allowed" title="Sudah Lunas"><i class="fas fa-credit-card"></i> Lunas</span>`;
                    } else {
                        // Belum dibayar, tombol bayar aktif
                        payButtonHtml = `<button class="pay-btn text-purple-500 hover:text-purple-700 transition-colors duration-200 focus:outline-none" data-id="${order.id}" title="Bayar">
                                <i class="fas fa-credit-card"></i> Bayar
                            </button>`;
                    }
                } else {
                    payButtonHtml = `<span class="text-gray-400" title="Bukan pemilik"><i class="fas fa-credit-card"></i></span>`;
                }

                tr.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap">${order.id}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${order.user ? order.user.name : 'Tidak ada data'}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${order.weight ?? '0'} kg</td>
                    <td class="px-6 py-4 whitespace-nowrap">Rp${order.total_price?.toLocaleString('id-ID') ?? '0'}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="inline-block px-2 py-1 text-xs font-semibold ${statusClass} rounded-full">
                            ${statusLabel}
                        </span>
                        ${order.isPaid ? '<span class="ml-2 text-green-600 font-semibold">Lunas</span>' : ''}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">${order.created_at ? new Date(order.created_at).toLocaleDateString('id-ID') : '-'}</td>
                    <td class="px-6 py-4 whitespace-nowrap flex space-x-2">
                        ${payButtonHtml}
                    </td>
                `;
                tbody.appendChild(tr);
            });

            renderPagination(ordersToDisplay.length, currentPage, 'pagination-buttons', 'pagination-info');
        }

        function renderPagination(totalItems, currentPage, buttonsContainerId, infoId) {
            const totalPages = Math.ceil(totalItems / ORDERS_PER_PAGE);
            const paginationButtonsContainer = document.getElementById(buttonsContainerId);
            const paginationInfo = document.getElementById(infoId);

            if (!paginationButtonsContainer || !paginationInfo) return;

            paginationButtonsContainer.innerHTML = '';
            paginationInfo.textContent = `Menampilkan ${((currentPage - 1) * ORDERS_PER_PAGE) + 1}-${Math.min(currentPage * ORDERS_PER_PAGE, totalItems)} dari ${totalItems}`;

            if (totalPages <= 1) {
                return;
            }

            const maxButtonsToShow = 5;
            let startPage = Math.max(1, currentPage - Math.floor(maxButtonsToShow / 2));
            let endPage = Math.min(totalPages, startPage + maxButtonsToShow - 1);

            if (endPage - startPage + 1 < maxButtonsToShow && endPage === totalPages) {
                startPage = Math.max(1, endPage - maxButtonsToShow + 1);
            }

            if (currentPage > 1) {
                const prevButton = document.createElement('button');
                prevButton.textContent = 'Sebelumnya';
                prevButton.className = 'pagination-button bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline';
                prevButton.setAttribute('data-page', currentPage - 1);
                paginationButtonsContainer.appendChild(prevButton);
            }

            for (let i = startPage; i <= endPage; i++) {
                const pageButton = document.createElement('button');
                pageButton.textContent = i;
                pageButton.className = `pagination-button py-2 px-4 rounded focus:outline-none focus:shadow-outline ${currentPage === i ? 'bg-blue-500 text-white font-bold hover:bg-blue-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold'}`;
                pageButton.setAttribute('data-page', i);
                paginationButtonsContainer.appendChild(pageButton);
            }

            if (currentPage < totalPages) {
                const nextButton = document.createElement('button');
                nextButton.textContent = 'Selanjutnya';
                nextButton.className = 'pagination-button bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline';
                nextButton.setAttribute('data-page', currentPage + 1);
                paginationButtonsContainer.appendChild(nextButton);
            }
        }

        function updateOrderStatistics(orders) {
            const totalOrders = orders.length;
            const pendingOrders = orders.filter(o => o.status === 'Pending').length;
            const processingOrders = orders.filter(o => o.status === 'Processing').length;
            const completedOrders = orders.filter(o => o.status === 'Done').length;
            const totalRevenue = orders.reduce((sum, order) => sum + (order.total_price || 0), 0);

            document.getElementById('total-orders').textContent = totalOrders;
            document.getElementById('processing-orders').textContent = processingOrders;
            document.getElementById('completed-orders').textContent = completedOrders;
            document.getElementById('total-revenue').textContent = `Rp${totalRevenue.toLocaleString('id-ID')}`;
        }

        function handleSearchOrders(e) {
            const searchTerm = e.target.value.toLowerCase();
            const filteredOrders = allOrders.filter(order => {
                const customerName = order.user ? order.user.name.toLowerCase() : '';
                return (
                    String(order.id).toLowerCase().includes(searchTerm) ||
                    customerName.includes(searchTerm) ||
                    String(order.weight).includes(searchTerm) ||
                    String(order.total_price).includes(searchTerm) || 
                    order.status.toLowerCase().includes(searchTerm) ||
                    (order.createdAt ? new Date(order.createdAt).toLocaleDateString('id-ID').includes(searchTerm) : false) // Perbaikan: Gunakan createdAt
                );
            });
            currentPage = 1; // Reset halaman ke 1 saat pencarian
            renderOrderTable(filteredOrders, currentPage);
        }

        function handleSearchPayments(e) {
            const searchTerm = e.target.value.toLowerCase();
            // Implementasi pencarian pembayaran jika Anda memiliki allPayments array
            // Untuk saat ini, ini hanya placeholder
            console.log('Pencarian pembayaran:', searchTerm);
        }

        function logout() {
            localStorage.removeItem('authUser');
            window.location.href = '../login.html'; // Sesuaikan path jika perlu
        }

        // Fungsi untuk menampilkan loading (global atau spesifik)
        function showLoading(elementId, show) {
            const loaderElement = document.getElementById(elementId);
            if (!loaderElement) return;

            if (show) {
                loaderElement.classList.remove('hidden');
            } else {
                loaderElement.classList.add('hidden');
            }
        }

        // Fungsi untuk menampilkan error (global atau spesifik)
        function showError(elementId, message) {
            const alertElement = document.getElementById(elementId);
            const messageSpan = alertElement.querySelector('span');
            if (!alertElement || !messageSpan) return;

            messageSpan.textContent = message;
            alertElement.classList.remove('hidden');

            setTimeout(() => {
                alertElement.classList.add('hidden');
            }, 5000);
        }

        // Fungsi untuk menampilkan sukses (global)
        function showSuccess(message) {
            const successAlert = document.getElementById('success-alert');
            const messageSpan = successAlert.querySelector('span');
            if (!successAlert || !messageSpan) return;

            messageSpan.textContent = message;
            successAlert.classList.remove('hidden');

            setTimeout(() => {
                successAlert.classList.add('hidden');
            }, 3000);
        }