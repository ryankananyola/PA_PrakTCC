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
import { verifyToken } from "../middleware/verifyToken.js"; // tambahkan ini

const router = express.Router();

router.get("/", verifyToken, getPayments);
router.get("/:id", verifyToken, getPaymentById);
router.get("/order/:orderId", verifyToken, getPaymentsByOrderId);
router.post("/", verifyToken, createPayment);
router.put("/:id", verifyToken, updatePayment);
router.delete("/:id", verifyToken, deletePayment);


export default router;
