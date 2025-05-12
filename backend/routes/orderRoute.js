import express from "express";
import db from "../config/database.js";
import { 
    getOrders, 
    getOrderById, 
    createOrder, 
    updateOrder, 
    deleteOrder 
} from "../controller/orderController.js";

const router = express.Router();

router.get("/orders/", async (req, res) => {
  const [rows] = await db.query(`
    SELECT 
        users.name AS customerName,
        orders.total_price AS totalPrice,
        orders.status,
        orders.created_at AS createdAt
    FROM orders
    JOIN users ON orders.user_id = users.id
    `);

  res.json(rows);
});
router.get("/orders/:id", getOrderById);
router.post("/add-order", createOrder);
router.put("/orders/:id", updateOrder);
router.delete("/orders/:id", deleteOrder);

export default router;