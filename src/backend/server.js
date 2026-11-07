const express = require("express");
const setupSwagger = require("./swagger/swagger");
const cors = require("cors");
const { DataTypes } = require("sequelize");
require("dotenv").config();

const { sequelize, User, Customer, Category, Product } = require("./models");
const jsonDb = require("./data/jsonDb");
const { isEmailDeliveryConfigured } = require("./utils/passwordReset");
const { categories: seedCategories, products: seedProducts } = require("./data/seedData");

const categoryRoutes = require("./routes/categoryRoute");
const productRoutes = require("./routes/productRoute");
const userRoutes = require("./routes/userRoute");
const orderRoutes = require("./routes/orderRoute");
const orderItemRoutes = require("./routes/orderItemRoute");
const reviewRoutes = require("./routes/reviewRoute");
const favoriteRoutes = require("./routes/favoriteRoute");
const customerRoutes = require("./routes/customerRoute");
const contactRoutes = require("./routes/contactRoute");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Burger App Backend ishlayapti! 🍔",
        mode: app.locals.dbMode || "standard",
    });
});

async function ensureUserCustomerColumn() {
    try {
        const queryInterface = sequelize.getQueryInterface();
        const tableName = User.getTableName();
        const columns = await queryInterface.describeTable(tableName);

        if (!columns.customer_id) {
            await queryInterface.addColumn(tableName, "customer_id", {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: Customer.getTableName(),
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            });
            console.log("Users jadvaliga customer_id ustuni qo‘shildi.");
        }
        if (!columns.reset_password_token) {
            await queryInterface.addColumn(tableName, "reset_password_token", {
                type: DataTypes.STRING(64),
                allowNull: true,
            });
        }
        if (!columns.reset_password_expires) {
            await queryInterface.addColumn(tableName, "reset_password_expires", {
                type: DataTypes.DATE,
                allowNull: true,
            });
        }
    } catch (e) {
        console.warn("Column tekshirishda ogohlantirish:", e.message);
    }
}

async function autoSeedPostgres() {
    try {
        const catCount = await Category.count();
        if (catCount === 0) {
            console.log("PostgreSQL: Boshlang'ich kategoriyalar yuklanmoqda...");
            for (const c of seedCategories) {
                await Category.findOrCreate({ where: { id: c.id }, defaults: c });
            }
        }

        const prodCount = await Product.count();
        if (prodCount === 0) {
            console.log("PostgreSQL: Boshlang'ich mahsulotlar yuklanmoqda...");
            for (const p of seedProducts) {
                await Product.findOrCreate({ where: { name: p.name }, defaults: p });
            }
        }

        const admin = await User.findOne({ where: { name: "admin" } });
        if (!admin) {
            console.log("PostgreSQL: Boshlang'ich admin va foydalanuvchilar yaratilmoqda...");
            const newAdmin = await User.create({
                name: "admin",
                email: "admin@burger.uz",
                password: "admin123",
                role: "admin",
            });
            const adminCust = await Customer.create({
                name: "admin",
                email: "admin@burger.uz",
                phone: "+998901234567",
                address: "Toshkent, Amir Temur 10",
            });
            await newAdmin.update({ customer_id: adminCust.id });

            const demoUser = await User.create({
                name: "demo",
                email: "demo@burger.uz",
                password: "user123",
                role: "user",
            });
            const demoCust = await Customer.create({
                name: "demo",
                email: "demo@burger.uz",
                phone: "+998935554433",
                address: "Toshkent, Yunusobod 12",
            });
            await demoUser.update({ customer_id: demoCust.id });
        }
    } catch (seedErr) {
        console.warn("PostgreSQL auto-seed ogohlantirish:", seedErr.message);
    }
}

async function startServer() {
    let pgConnected = false;
    try {
        await sequelize.authenticate();
        console.log("PostgreSQL ma'lumotlar bazasi muvaffaqiyatli ulandi!");
        await sequelize.sync();
        await ensureUserCustomerColumn();
        await autoSeedPostgres();
        pgConnected = true;
    } catch (dbError) {
        console.warn(`PostgreSQL serveriga ulanmadi (${dbError.message}).`);
        console.log("Zero-Crash JSON DB rejimiga o'tildi. Barcha APIlar to'liq ish holatida!");
    }

    if (pgConnected) {
        app.locals.dbMode = "postgresql";
        if (process.env.NODE_ENV === "production" && !isEmailDeliveryConfigured()) {
            console.error("Password reset is unavailable: SMTP settings are missing.");
        }
        app.use("/api/categories", categoryRoutes);
        app.use("/api/products", productRoutes);
        app.use("/api/users", userRoutes);
        app.use("/api/orders", orderRoutes);
        app.use("/api/order-items", orderItemRoutes);
        app.use("/api/reviews", reviewRoutes);
        app.use("/api/favorites", favoriteRoutes);
        app.use("/api/customers", customerRoutes);
        app.use("/api/contacts", contactRoutes);
    } else {
        app.locals.dbMode = "json-db";
        if (process.env.NODE_ENV === "production" && !isEmailDeliveryConfigured()) {
            console.error("Password reset is unavailable: SMTP settings are missing.");
        }
        app.use("/api", jsonDb.createRouter());
    }

    setupSwagger(app);

    app.listen(PORT, () => {
        console.log(`Swagger hujjatlari: http://localhost:${PORT}/api-docs/`);
    });
}

startServer();
