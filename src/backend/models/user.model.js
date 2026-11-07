const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM("user", "admin"),
            allowNull: false,
            defaultValue: "user",
        },
        customer_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        reset_password_token: {
            type: DataTypes.STRING(64),
            allowNull: true,
        },
        reset_password_expires: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    });

    User.beforeSave(async (user) => {
        if (user.changed("password")) {
            user.password = await bcrypt.hash(user.password, 10);
        }
    });

    User.associate = (models) => {
        User.belongsTo(models.Customer, {
            foreignKey: "customer_id",
            as: "customer",
        });
        User.hasMany(models.Order, {
            foreignKey: "user_id",
            as: "orders",
        });
    };

    return User;
};
