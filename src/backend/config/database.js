const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB_NAME || "burger_db",
    process.env.DB_USER || "postgres",
    process.env.DB_PASSWORD || "2010",
    {
        host: process.env.DB_HOST || "127.0.0.1",
        port: process.env.DB_PORT || 5432,
        dialect: "postgres",
        logging: false,
        dialectOptions: {
            connectTimeout: 1500,
        },
        retry: {
            max: 0,
        },
    }
);

module.exports = sequelize;
