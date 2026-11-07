module.exports = (sequelize, DataTypes) => {
    const Customer = sequelize.define("Customer", {
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
            validate: { isEmail: true },
        },
        phone: {
            type: DataTypes.STRING,
            unique: true,
        },
        address: {
            type: DataTypes.STRING,
        },
    });

    Customer.associate = (models) => {
        Customer.hasMany(models.User, {
            foreignKey: "customer_id",
            as: "users",
        });
    };

    return Customer;
};