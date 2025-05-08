import { Sequelize } from "sequelize";

const db = new Sequelize("laundryrr", "root", "",{
    host:"localhost",
    dialect:"mysql",
});

export default db;