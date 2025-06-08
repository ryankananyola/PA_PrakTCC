import bcrypt from "bcrypt";
import User from "../models/userModels.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// REGISTER USER
export const registerUser = async (req, res) => {
  const { name, email, password, confirmPassword, noHP, role } = req.body;

  if (!name || !email || !password || !confirmPassword || !noHP) {
    return res.status(400).json({ msg: "Semua field harus diisi" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ msg: "Password tidak cocok" });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ msg: "Email sudah terdaftar" });
    }

    // Password tidak perlu di-hash di sini, biarkan model yang handle
    const newUser = await User.create({
      name,
      email,
      password,  // langsung plain password
      noHP,
      role: role || "customer",
    });

    // Kalau admin, buat refresh token dan simpan ke DB + cookie
    if (newUser.role === "admin") {
      const refreshToken = jwt.sign(
        { userId: newUser.id, email: newUser.email, role: newUser.role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      newUser.refresh_token = refreshToken;
      await newUser.save();

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
    }

    res.status(201).json({
      msg: "Registrasi berhasil",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        noHP: newUser.noHP,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Error registrasi:", error);
    res.status(500).json({ msg: "Terjadi kesalahan server" });
  }
};


// LOGIN USER
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ msg: "Email dan password harus diisi" });

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

    console.log("Password input:", password);
    console.log("Password hash DB:", user.password);

    // Buat hash baru dari password input (ini cuma buat debug, tidak digunakan untuk verifikasi)
    const salt = await bcrypt.genSalt(10);
    const inputPasswordHash = await bcrypt.hash(password, salt);
    console.log("Hash dari password input (baru dibuat):", inputPasswordHash);

    const match = await bcrypt.compare(password, user.password);
    console.log("Password match result:", match);

    if (!match) return res.status(401).json({ msg: "Password salah" });

    const { id: userId, name, role } = user;

    const accessToken = jwt.sign(
      { userId, name, email, role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "20s" }
    );
    const refreshToken = jwt.sign(
      { userId, name, email, role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    user.refresh_token = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ msg: "Login gagal" });
  }
};

// GET ALL USERS
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password", "refresh_token"] },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ msg: "Gagal mengambil data pengguna" });
  }
};

// GET USER BY ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.id },
      attributes: { exclude: ["password", "refresh_token"] },
    });
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
    res.status(200).json(user);
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({ msg: "Gagal mengambil data pengguna" });
  }
};

// UPDATE USER
export const updateUser = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    const [updated] = await User.update(updateData, {
      where: { id: req.params.id },
    });

    if (!updated) return res.status(404).json({ msg: "User tidak ditemukan" });

    res.status(200).json({ msg: "User berhasil diperbarui" });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ msg: "Gagal memperbarui user" });
  }
};

// DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({ where: { id: req.params.id } });

    if (!deleted) return res.status(404).json({ msg: "User tidak ditemukan" });

    res.status(200).json({ msg: "User berhasil dihapus" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ msg: "Gagal menghapus user" });
  }
};
