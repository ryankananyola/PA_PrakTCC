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
    service_type: {
    type: Sequelize.ENUM("Regular", "Express", "Premium"),
    defaultValue: 'Regular',
    allowNull: false
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
    isPaid: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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

(async () => {
  try {
    await db.sync({ alter: true }); // Alter akan menambahkan kolom tanpa hapus data
    console.log('Tabel orders sudah sinkron dengan model (kolom isPaid ditambahkan jika belum ada)');
  } catch (error) {
    console.error('Gagal sinkronisasi tabel orders:', error);
  }
})();

export default Order;