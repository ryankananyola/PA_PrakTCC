// paymentRoute.js
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

router.get("/", getPayments);
router.get("/:id", getPaymentById);
router.get("/order/:orderId", getPaymentsByOrderId);
router.post("/", createPayment);
router.put("/:id", updatePayment);
router.delete("/:id", deletePayment);


export default router;
