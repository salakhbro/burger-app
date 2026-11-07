
module.exports = (sequelize, DataTypes) => {
    const Favorite = sequelize.define("Favorite", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        tableName: "favorites",
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ["user_id", "product_id"],
            },
        ],
    });

    Favorite.associate = (models) => {
        Favorite.belongsTo(models.User, {
            foreignKey: "user_id",
            as: "user",
        });

        Favorite.belongsTo(models.Product, {
            foreignKey: "product_id",
            as: "product",
        });
    };

    return Favorite;
};