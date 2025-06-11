import Payment from "../models/paymentModels.js";
import Order from "../models/orderModels.js";

// CREATE payment
export const createPayment = async (req, res) => {
    try {
        const { order_id, method, total_price } = req.body;

        // 1. Simpan data pembayaran
        const payment = await Payment.create({
            order_id,
            method,
            total_price,
            status: true,
            payment_date: new Date(),
        });

        // 2. Update status order jadi 'Processing' dan isPaid = true
        await Order.update(
            { status: "Processing", isPaid: true },
            { where: { id: order_id } }
        );

        res.status(201).json({
            status: "success",
            message: "Pembayaran berhasil",
            data: payment,
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// GET all payments
export const getPayments = async (req, res) => {
    try {
        const payments = await Payment.findAll();
        res.status(200).json(payments);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Error retrieving payments" });
    }
};

// GET payment by ID
export const getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findOne({
            where: { id: req.params.id },
        });

        if (!payment) {
            return res.status(404).json({ msg: "Payment not found" });
        }

        res.status(200).json(payment);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Error retrieving payment" });
    }
};

// UPDATE payment
export const updatePayment = async (req, res) => {
    try {
        const updateData = { ...req.body };

        const result = await Payment.update(updateData, {
            where: { id: req.params.id },
        });

        if (result[0] === 0) {
            return res.status(404).json({ msg: "Payment not found or no changes made" });
        }

        res.status(200).json({ msg: "Payment Updated" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Error updating payment" });
    }
};

// DELETE payment
export const deletePayment = async (req, res) => {
    try {
        const result = await Payment.destroy({
            where: { id: req.params.id },
        });

        if (result === 0) {
            return res.status(404).json({ msg: "Payment not found" });
        }

        res.status(200).json({ msg: "Payment Deleted" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Error deleting payment" });
    }
};

export const getPaymentsByOrderId = async (req, res) => {
    try {
        const payments = await Payment.findAll({
            where: { order_id: req.params.orderId }, // Asumsi parameter route adalah orderId
        });
        res.status(200).json(payments);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Error retrieving payments by order ID" });
    }
};