import Payment from "../models/paymentModels.js";
import Order from "../models/orderModels.js";

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

// CREATE payment
export const createPayment = async (req, res) => {
    try {
        const { order_id, method, amount, status, payment_date } = req.body;

        // Buat pembayaran
        const payment = await Payment.create({
            order_id,
            method,
            amount,
            status,
            payment_date,
        });

        // Jika dibayar (status === true), ubah status order ke "Done"
        if (status === true || status === 1) {
            await Order.update(
                { status: "Done" },
                { where: { id: order_id } }
            );
        }

        res.status(201).json({ msg: "Payment Created and Order Updated" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Error creating payment" });
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
