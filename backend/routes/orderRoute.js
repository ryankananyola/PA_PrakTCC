// routes/orderRoute.js
import express from "express";
import { 
    getOrders, 
    getOrderById, 
    createOrder, 
    updateOrder, 
    deleteOrder 
} from "../controller/orderController.js";

const router = express.Router();

// Ganti endpoint ini untuk konsistensi
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.post("/", createOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);


export default router;