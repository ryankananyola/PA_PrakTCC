-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Waktu pembuatan: 04 Jun 2025 pada 17.26
-- Versi server: 10.4.28-MariaDB
-- Versi PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `laundryrr`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `weight` float NOT NULL,
  `service_type` enum('Regular','Express','Premium') NOT NULL DEFAULT 'Regular',
  `total_price` float NOT NULL,
  `status` enum('Pending','Processing','Done') NOT NULL DEFAULT 'Pending',
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `weight`, `service_type`, `total_price`, `status`, `created_at`) VALUES
(1, 1, 5, 'Premium', 100000, 'Done', '2025-06-03 02:37:26'),
(2, 3, 5, 'Express', 75000, 'Done', '2025-06-03 04:02:10'),
(3, 3, 4, 'Premium', 80000, 'Done', '2025-06-04 02:47:31');

-- --------------------------------------------------------

--
-- Struktur dari tabel `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `method` varchar(255) NOT NULL,
  `amount` float NOT NULL,
  `status` tinyint(1) DEFAULT 0,
  `payment_date` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `payments`
--

INSERT INTO `payments` (`id`, `order_id`, `method`, `amount`, `status`, `payment_date`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'Tunai', 100000, 1, '2025-06-04 02:47:00', '2025-06-04 02:47:00', '2025-06-04 02:47:00'),
(2, 2, 'Transfer Bank', 80000, 1, '2025-06-04 07:18:29', '2025-06-04 07:18:29', '2025-06-04 07:18:29');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `noHP` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'customer',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `noHP`, `role`, `createdAt`, `updatedAt`) VALUES
(1, 'Rio', 'aryamuktisatria@gmail.com', '$2b$10$kSXr.RcmiD2LIQ5RPZnYHutl8qnIHOnij07cdcYe9r.CoslEsaOlK', '00123220198', 'user', '2025-06-03 02:35:24', '2025-06-03 02:35:24'),
(2, 'Admin', 'admin1@gmail.com', '$2b$10$27TyOagsu6RGtgVvFDU0nOgQVoliE8CgWw3RUqvRGziN8V828Dh..', '08123456789', 'admin', '2025-06-03 02:35:32', '2025-06-03 02:35:32'),
(3, 'RIOOOO', 'rio123@gmail.com', '$2b$10$HyVu2vNgjeegRjgvi78j..8o/sBN1g17fynjfazanu9cxFfz/IvYa', '00123220198', 'user', '2025-06-03 03:51:14', '2025-06-03 03:51:14');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
