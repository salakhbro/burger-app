const { User, sequelize } = require("./models");

async function createAdmin() {
    try {
        await sequelize.authenticate();

        let admin = await User.findOne({
            where: { name: "salakh.bro" },
        });

        if (!admin) {
            admin = await User.create({
                name: "salakh.bro",
                email: "salakh.bro@example.com",
                password: "admin123",
                role: "admin",
            });
        } else {
            admin.password = "admin123";
            admin.role = "admin";
            await admin.save();
        }

        console.log("Admin paroli qayta o'rnatildi!");
    } catch (error) {
        console.log("Xatolik:", error.message);
    } finally {
        await sequelize.close();
    }
}

createAdmin();