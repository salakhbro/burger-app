const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Category = require("./category.model")(sequelize, DataTypes);
const Product = require("./product.model")(sequelize, DataTypes);
const Customer = require("./customer.model")(sequelize, DataTypes);
const User = require("./user.model")(sequelize, DataTypes);
const Order = require("./order.model")(sequelize, DataTypes);
const OrderItem = require("./orderItem.model")(sequelize, DataTypes);
const Review = require("./review.model")(sequelize, DataTypes);
const Favorite = require("./favorite.model")(sequelize, DataTypes);
const Contact = require("./contact.model")(sequelize, DataTypes);

const models = {
    sequelize,
    Category,
    Product,
    Customer,
    User,
    Order,
    OrderItem,
    Review,
    Favorite,
    Contact,
};

Object.values(models).forEach((model) => {
    if (model && typeof model.associate === "function") {
        model.associate(models);
    }
});

module.exports = models;