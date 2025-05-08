import Order from "../models/orderModels.js";

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
            message: "Order created successfully",
            data: order
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// GET ALL ORDERS
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: ['user']
        });
        res.status(200).json(orders);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal server error" });
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
            return res.status(404).json({ message: "Order not found" });
        }
        
        res.status(200).json(order);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// UPDATE ORDER
export const updateOrder = async (req, res) => {
    try {
        const { status } = req.body;
        
        const [updated] = await Order.update(
            { status },
            { where: { id: req.params.id } }
        );
        
        if (updated) {
            const updatedOrder = await Order.findByPk(req.params.id);
            return res.status(200).json({
                message: "Order updated successfully",
                data: updatedOrder
            });
        }
        
        return res.status(404).json({ message: "Order not found" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// DELETE ORDER
export const deleteOrder = async (req, res) => {
    try {
        const deleted = await Order.destroy({
            where: { id: req.params.id }
        });
        
        if (deleted) {
            return res.status(200).json({ message: "Order deleted successfully" });
        }
        
        return res.status(404).json({ message: "Order not found" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};