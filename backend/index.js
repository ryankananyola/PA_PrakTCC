import express from "express";
import cors from "cors";
import userRoute from "./routes/userRoute.js";

const app = express();

// Konfigurasi CORS yang lebih lengkap
const corsOptions = {
  origin: 'http://127.0.0.1:5500', // Sesuaikan dengan URL frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

// Middleware untuk parsing JSON
app.use(express.json());

// Test endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Backend LaundryRR berjalan!' });
});

// Gunakan routes
app.use(userRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Terjadi kesalahan server!' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});