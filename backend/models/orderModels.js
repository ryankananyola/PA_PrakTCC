import { Sequelize } from "sequelize";
import db from "../config/database.js";
import User from "./userModels.js";

const Order = db.define("order", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { // Explicit foreign key reference
            model: User,
            key: 'id'
        }
    },
    weight: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
            min: 0.1 // Minimum berat 0.1 kg
        }
    },
    total_price: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
            min: 0 // Harga tidak boleh negatif
        }
    },
    status: {
        type: Sequelize.ENUM("Pending", "Processing", "Done"), // Tambahkan Pending
        defaultValue: 'Pending', // Default status Pending
        allowNull: false
    },
    created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
    }
}, {
    timestamps: false, // Nonaktifkan createdAt dan updatedAt otomatis
    tableName: 'orders' // Pastikan nama tabel sesuai dengan database
});

// Hubungan antar model
User.hasMany(Order, { 
    foreignKey: "user_id",
    as: "orders" 
});

Order.belongsTo(User, { 
    foreignKey: "user_id",
    as: "user",
    onDelete: 'CASCADE' // Optional: hapus order jika user dihapus
});

export default Order;