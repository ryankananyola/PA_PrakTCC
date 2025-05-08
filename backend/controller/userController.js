import bcrypt from "bcrypt";
import User from "../models/userModels.js";

// GET
async function getUsers(req, res) {
    try {
        const response = await User.findAll();
        res.status(200).json(response);
    } catch (error) {
        
        console.log(error.message);
    }
}

// GET By ID
async function getUserById(req, res) {
    try {
        const response = await User.findOne({
            where:{
                id: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
}

// CREATE
async function createUser(req, res) {
    try {
        const { name, email, password, noHP, role } = req.body;

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.create({
            name,
            email,
            password: hashedPassword,
            noHP,
            role,
        });

        res.status(201).json({ msg: "User Created" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Error creating user" });
    }
}


export { getUsers, createUser, getUserById };

// UPDATE
export const updateUser = async (req, res) => {
    try {
        const updateData = { ...req.body };

        if (updateData.password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(updateData.password, salt);
        }

        await User.update(updateData, {
            where: {
                id: req.params.id,
            },
        });

        res.status(200).json({ msg: "User Updated" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Error updating user" });
    }
};


export const deleteUser = async (req, res) => {
    try {
        const result = await User.destroy({
            where: {
                id: req.params.id
            }
        });
        if (result === 0){
            res.status(404).json({ msg: "User Not Found" });
        } else {
            res.status(200).json({ msg: "User Deleted" });
        }
    } catch (error) {
        console.log(error.message);
    }                                   
}
// userController.js
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
        return res.status(400).json({
            status: "error",
            message: "Email dan password harus diisi"
        });
    }

    try {
        // Cari user termasuk password (untuk verifikasi)
        const user = await User.findOne({
            where: { email },
            raw: true // Mengembalikan plain object
        });

        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User tidak ditemukan"
            });
        }

        // Verifikasi password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                status: "error",
                message: "Password salah"
            });
        }

        // Hapus password sebelum mengirim response
        delete user.password;

        // Format response yang benar
        res.status(200).json({
            status: "success",
            message: "Login berhasil",
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                noHP: user.noHP,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            status: "error",
            message: "Terjadi kesalahan server"
        });
    }
};

// Register Controller
// userController.js
export const registerUser = async (req, res) => {
    const { name, email, password, confirmPassword, noHP } = req.body;

    // Validasi
    if (!name || !email || !password || !confirmPassword || !noHP) {
        return res.status(400).json({
            status: "error",
            message: "Semua field harus diisi"
        });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({
            status: "error",
            message: "Password tidak cocok"
        });
    }

    try {
        // Cek email sudah terdaftar
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({
                status: "error",
                message: "Email sudah terdaftar"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Buat user baru
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            noHP,
            role: 'customer'
        });

        // Response tanpa password
        const userData = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            noHP: newUser.noHP,
            role: newUser.role
        };

        return res.status(201).json({
            status: "success",
            message: "Registrasi berhasil",
            data: userData
        });

    } catch (error) {
        console.error("Error registrasi:", error);
        return res.status(500).json({
            status: "error",
            message: "Terjadi kesalahan server"
        });
    }
};
// Add this token verification endpoint
export const verifyToken = async (req, res) => {
    try {
        // In a real app, verify JWT token here
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
        
        // Verify token logic here
        // If valid:
        res.status(200).json({ message: "Token is valid" });
        
        // If invalid:
        // res.status(401).json({ message: "Invalid token" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error" });
    }
};