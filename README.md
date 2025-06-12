# LAUNDRY RR
## 📝 Deskripsi Tema Proyek
Aplikasi Laundry berbasis Node.js + Express untuk Backend Service, dengan fitur manajemen pengguna, autentikasi JWT, pesanan, dan pembayaran.

## 🚀 Fitur Utama
- 🔑 Autentikasi dengan JWT Token (Login, Register, Refresh Token, Logout)
- 👤 Manajemen Pengguna (CRUD) [Protected]
- 🧺 Manajemen Pesanan Laundry (CRUD) [Protected]
- 💳 Manajemen Pembayaran Laundry (CRUD) [Protected]

## 🛠️ Teknologi Yang Digunakan
1. Backend
   - Runtime: Node.js
   - Framework: MySQL
   - Database: Sequelize
   - Authentication: JWT (JSON Web Token)
   - Password Hashing: bcrypt
   - Development Tools: nodemon
3. Frontend
   - HTML
   - CSS
   - Java Script

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

### Contoh Request dan Response
1. Register
   ![image](https://github.com/user-attachments/assets/ab1b99fd-bcea-4b0b-890d-9ef3d3dbaa59)
   ![image](https://github.com/user-attachments/assets/0e71ae72-bc1e-4357-97d9-bf8cc73618e4)

3. Login
