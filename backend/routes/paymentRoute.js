import express from "express";
import {
    getPayments,
    getPaymentById,
    createPayment,
    updatePayment,
    deletePayment,
} from "../controller/paymentController.js";

const router = express.Router();

router.get("/payments", getPayments);
router.get("/payments/:id", getPaymentById);
router.post("/add-payment", createPayment);
router.put("/payment/:id", updatePayment);
router.delete("/payment/:id", deletePayment);

export default router;
