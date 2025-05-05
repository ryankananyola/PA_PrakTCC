import express from "express";
import { 
    createOrder, 
    getOrders, 
    getOrderById, 
    updateOrder, 
    deleteOrder 
} from "../controller/orderController.js";

const router = express.Router();

router.get("/orders", getOrders);
router.get("/orders/:id", getOrderById);
router.post("/add-order", createOrder);
router.put("/orders/:id", updateOrder);
router.delete("/orders/:id", deleteOrder);

export default router;