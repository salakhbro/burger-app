module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define("Order", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Users",
                key: "id",
            },
        },
        total_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0.01,
            },
        },
        status: {
            type: DataTypes.ENUM(
                "pending",
                "confirmed",
                "preparing",
                "delivering",
                "completed",
                "cancelled"
            ),
            allowNull: false,
            defaultValue: "pending",
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    Order.associate = (models) => {
        Order.belongsTo(models.User, {
            foreignKey: "user_id",
            as: "user",
        });
        Order.hasMany(models.OrderItem, {
            foreignKey: "order_id",
            as: "items",
        });
    };

    return Order;
};
