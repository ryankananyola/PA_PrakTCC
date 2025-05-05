import { Sequelize } from "sequelize";

const db = new Sequelize("laundryRR", "root", "",{
    host:"localhost",
    dialect:"mysql",
});

export default db;