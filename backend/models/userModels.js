import { Sequelize } from "sequelize";
import db from "../config/database.js";

const User = db.define(
    "user",
    {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.STRING,
        noHP: Sequelize.STRING,
        role: Sequelize.STRING,
    }
);

db.sync().then(() => console.log("Database synced"));

export default User;