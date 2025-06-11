# LAUNDRY RR
## 📝 Deskripsi Tema Proyek
blabla
## 🚀 Fitur Utama
## 🛠️ Teknologi Yang Digunakan
## 🔑 Endpoint API
### Autentikasi
| Method | Endpoint            | Deskripsi                                                              |
|--------|---------------------|------------------------------------------------------------------------|
| POST   | `/api/auth/login`   | Login pengguna. Mengembalikan token akses dan refresh token.            |
| POST   | `/api/auth/register`| Registrasi pengguna baru.                                              |
| GET    | `/api/auth/token`   | Refresh token untuk mendapatkan access token baru.                     |
| DELETE | `/api/auth/logout`  | Logout pengguna dan menghapus refresh token dari server.               |

### Users Management
Semua endpoint di bagian ini **memerlukan autentikasi (Protected Route)**.
| Method | Endpoint         | Deskripsi                                              |
|--------|------------------|-------------------------------------------------------|
| GET    | `/api/users/`    | Mendapatkan daftar seluruh pengguna (Protected)       |
| GET    | `/api/users/:id` | Mendapatkan detail pengguna berdasarkan ID (Protected)|
| POST   | `/api/users/`    | Menambahkan pengguna baru (Protected)                 |
| PUT    | `/api/users/:id` | Mengupdate data pengguna berdasarkan ID (Protected)   |
| DELETE | `/api/users/:id` | Menghapus pengguna berdasarkan ID (Protected)         |

### Order Management
Semua endpoint di bagian ini **memerlukan autentikasi (Protected Route)**.
| Method | Endpoint           | Deskripsi                                |
|--------|--------------------|------------------------------------------|
| GET    | `/api/orders/`     | Mendapatkan daftar semua pesanan.       |
| GET    | `/api/orders/:id`  | Mendapatkan detail pesanan berdasarkan ID. |
| POST   | `/api/orders/`     | Membuat pesanan baru.                   |
| PUT    | `/api/orders/:id`  | Mengupdate data pesanan berdasarkan ID. |
| DELETE | `/api/orders/:id`  | Menghapus pesanan berdasarkan ID.       |

### Payments Management
Semua endpoint di bagian ini **memerlukan autentikasi token (Protected Route)**.
| Method | Endpoint                       | Deskripsi                                                     |
|--------|--------------------------------|--------------------------------------------------------------|
| GET    | `/api/payments/`               | Mendapatkan daftar semua pembayaran.                         |
| GET    | `/api/payments/:id`            | Mendapatkan detail pembayaran berdasarkan ID pembayaran.     |
| GET    | `/api/payments/order/:orderId` | Mendapatkan pembayaran berdasarkan ID pesanan terkait.       |
| POST   | `/api/payments/`               | Membuat data pembayaran baru.                                |
| PUT    | `/api/payments/:id`            | Mengupdate data pembayaran berdasarkan ID pembayaran.        |
| DELETE | `/api/payments/:id`            | Menghapus pembayaran berdasarkan ID pembayaran.              |
