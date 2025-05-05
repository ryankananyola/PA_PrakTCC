import { Sequelize } from "sequelize";
import db from "../config/database.js";
import User from "./userModels.js";

const Order = db.define("order", {
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    weight: {
        type: Sequelize.FLOAT,
        allowNull: false,
    },
    total_price: {
        type: Sequelize.FLOAT,
        allowNull: false,
    },
    status: {
        type: Sequelize.ENUM("Processing", "Done"),
        defaultValue: 'Processing',
    },
    created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
});

User.hasMany(Order, { foreignKey: "user_id" });
Order.belongsTo(User, { foreignKey: "user_id" });

export default Order;
