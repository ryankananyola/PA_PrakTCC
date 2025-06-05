import jwt from "jsonwebtoken";
import User from "../models/userModels.js";

// ENV SECRET
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "aksesrahasia";
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "refreshrahasia";

// Generate Access Token
const generateAccessToken = (user) => {
    return jwt.sign({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }, accessTokenSecret, { expiresIn: "15m" }); // 15 menit
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
    return jwt.sign({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }, refreshTokenSecret, { expiresIn: "1d" }); // 1 hari
};

// Login (Mengeluarkan access dan refresh token)
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ message: "Password salah" });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Simpan refresh token ke database
        await User.update({ refresh_token: refreshToken }, { where: { id: user.id } });

        // Kirim refresh token ke cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({ accessToken });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Logout (menghapus refresh token dari DB dan cookie)
export const logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204); // No content

    const user = await User.findOne({ where: { refresh_token: refreshToken } });
    if (!user) return res.sendStatus(204);

    await User.update({ refresh_token: null }, { where: { id: user.id } });

    res.clearCookie("refreshToken");
    res.sendStatus(200);
};

// Refresh Token (mengembalikan access token baru jika refresh token valid)
export const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    const user = await User.findOne({ where: { refresh_token: refreshToken } });
    if (!user) return res.sendStatus(403);

    try {
        jwt.verify(refreshToken, refreshTokenSecret);
        const accessToken = generateAccessToken(user);
        res.json({ accessToken });
    } catch (error) {
        res.sendStatus(403);
    }
};
