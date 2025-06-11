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
| Method | Endpoint         | Deskripsi                                              |
|--------|------------------|-------------------------------------------------------|
| GET    | `/api/users/`    | Mendapatkan daftar seluruh pengguna (Protected)       |
| GET    | `/api/users/:id` | Mendapatkan detail pengguna berdasarkan ID (Protected)|
| POST   | `/api/users/`    | Menambahkan pengguna baru (Protected)                 |
| PUT    | `/api/users/:id` | Mengupdate data pengguna berdasarkan ID (Protected)   |
| DELETE | `/api/users/:id` | Menghapus pengguna berdasarkan ID (Protected)         |

