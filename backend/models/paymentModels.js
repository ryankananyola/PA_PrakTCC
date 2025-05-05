import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Order from "./orderModels.js";

const Payment = db.define("payment", {
    order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    method: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
    },
    status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    payment_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
});

// RELASI
Order.hasMany(Payment, { foreignKey: "order_id" });
Payment.belongsTo(Order, { foreignKey: "order_id" });

export default Payment;
