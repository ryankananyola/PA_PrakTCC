import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/userModels.js";

// ENV Secret fallback untuk keamanan
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "aksesrahasia";
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "refreshrahasia";

// 🔐 Generate Access Token (15 menit)
export const generateAccessToken = (user) => {
  return jwt.sign({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  }, accessTokenSecret, { expiresIn: "15m" });
};

// 🔐 Generate Refresh Token (durasi tergantung role)
export const generateRefreshToken = (user) => {
  const expiresIn = user.role === "admin" ? "30d" : "1d";

  return jwt.sign({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  }, refreshTokenSecret, { expiresIn });
};

// 🔓 Login (mengeluarkan access & refresh token)
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Password salah" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Simpan refresh token di DB
    await User.update({ refresh_token: refreshToken }, { where: { id: user.id } });

    // Atur cookie refresh token
    const maxAge = user.role === "admin"
      ? 30 * 24 * 60 * 60 * 1000 // 30 hari
      : 24 * 60 * 60 * 1000;     // 1 hari

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None", // sesuaikan jika frontend beda domain
      maxAge: maxAge
    });

    res.status(200).json({ accessToken });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔒 Logout (hapus refresh token dari DB dan cookie)
export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204); // Tidak ada token, tidak perlu logout

  const user = await User.findOne({ where: { refresh_token: refreshToken } });
  if (!user) return res.sendStatus(204); // Tidak ditemukan di DB

  await User.update({ refresh_token: null }, { where: { id: user.id } });
  res.clearCookie("refreshToken");
  res.sendStatus(200);
};

// 🔄 Refresh Token (dapatkan access token baru)
export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(401); // Tidak ada token

  const user = await User.findOne({ where: { refresh_token: refreshToken } });
  if (!user) return res.sendStatus(403); // Token tidak cocok di DB

  try {
    jwt.verify(refreshToken, refreshTokenSecret);
    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
  } catch (error) {
    res.sendStatus(403); // Token invalid / expired
  }
};
