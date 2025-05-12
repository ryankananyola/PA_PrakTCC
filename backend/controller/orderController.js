// orderController.js
import Order from "../models/orderModels.js";
import User from "../models/userModels.js"; // pastikan impor ini ada

// GET ALL ORDERS
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [{
                model: User,
                as: "user",
                attributes: ["id", "name", "email"]
            }],
            order: [["created_at", "DESC"]]
        });

        // Jika tidak ada data, kembalikan array kosong
        if (!orders || orders.length === 0) {
            return res.status(200).json({
                status: "success",
                data: []
            });
        }

        res.status(200).json({
            status: "success",
            data: orders
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ 
            status: "error",
            message: "Gagal mengambil data pesanan",
            error: error.message
        });
    }
};


// GET ORDER BY ID
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({
            where: { id: req.params.id },
            include: ['user']
        });
        
        if (!order) {
            return res.status(404).json({ 
                status: "error",
                message: "Pesanan tidak ditemukan"
            });
        }
        
        res.status(200).json({
            status: "success",
            data: order
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ 
            status: "error",
            message: "Terjadi kesalahan server"
        });
    }
};

// CREATE ORDER
export const createOrder = async (req, res) => {
    try {
        const { user_id, weight, total_price } = req.body;
        
        const order = await Order.create({
            user_id,
            weight,
            total_price
        });
        
        res.status(201).json({ 
            status: "success",
            message: "Pesanan berhasil dibuat",
            data: order
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ 
            status: "error",
            message: "Terjadi kesalahan server"
        });
    }
};

// UPDATE ORDER
export const updateOrder = async (req, res) => {
    try {
        const { weight, total_price, status } = req.body;
        
        const [updated] = await Order.update(
            { weight, total_price, status },
            { where: { id: req.params.id } }
        );
        
        if (updated) {
            const updatedOrder = await Order.findByPk(req.params.id, {
                include: ['user']
            });
            return res.status(200).json({
                status: "success",
                message: "Pesanan berhasil diperbarui",
                data: updatedOrder
            });
        }
        
        return res.status(404).json({ 
            status: "error",
            message: "Pesanan tidak ditemukan"
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ 
            status: "error",
            message: "Terjadi kesalahan server"
        });
    }
};

// DELETE ORDER
export const deleteOrder = async (req, res) => {
    try {
        const deleted = await Order.destroy({
            where: { id: req.params.id }
        });
        
        if (deleted) {
            return res.status(200).json({ 
                status: "success",
                message: "Pesanan berhasil dihapus"
            });
        }
        
        return res.status(404).json({ 
            status: "error",
            message: "Pesanan tidak ditemukan"
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ 
            status: "error",
            message: "Terjadi kesalahan server"
        });
    }
};