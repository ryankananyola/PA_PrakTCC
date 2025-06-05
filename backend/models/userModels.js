import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const User = db.define('users', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    noHP: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [10, 13] // Validasi panjang nomor HP
        }
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'customer'
    },
    refresh_token: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    freezeTableName: true,
    timestamps: true // Aktifkan createdAt & updatedAt otomatis
});

// Sinkronisasi model dengan database
(async () => {
    try {
        await db.sync({ force: false });
        console.log('Tabel users siap digunakan');
    } catch (error) {
        console.error('Gagal sinkronisasi tabel users:', error);
    }
})();

export default User;
