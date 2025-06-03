import express from "express";
import {
    getPayments,
    getPaymentById,
    createPayment,
    updatePayment,
    deletePayment,
    getPaymentsByOrderId
} from "../controller/paymentController.js";

const router = express.Router();

// Consistent with your existing route pattern
router.get("/payments/", getPayments);
router.get("/payments/:id", getPaymentById);
router.get("/payments/order/:order_id", getPaymentsByOrderId);
router.post("/payments/add", createPayment);
router.put("/payments/:id", updatePayment);
router.delete("/payments/:id", deletePayment);

export default router;