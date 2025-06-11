import { Sequelize } from "sequelize";
import db from "../config/database.js";
import bcrypt from "bcrypt";

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
      isEmail: true,
      len: [5, 100]
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 100]
    }
  },
  noHP: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [10, 13]
    }
  },
  role: {
    type: DataTypes.ENUM('customer', 'admin'),
    allowNull: false,
    defaultValue: 'customer'
  },
  refresh_token: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  freezeTableName: true,
  timestamps: true
});

// Hash password otomatis saat create dan update
User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt();
  user.password = await bcrypt.hash(user.password, salt);
});

User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// Sinkronisasi model ke database
(async () => {
  try {
    await db.sync({ force: true }); // gunakan alter agar update kolom jika perlu
    console.log('Tabel users siap digunakan');
  } catch (error) {
    console.error('Gagal sinkronisasi tabel users:', error);
  }
})();

export default User;
