
require("dotenv").config();

const readline = require("readline");
const { User, sequelize } = require("./models");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function resetPassword() {
    try {
        const user = await User.findByPk(32);

        if (!user) {
            console.log("User topilmadi!");
            return;
        }

        console.log("Username:", user.name);
        console.log("User ID:", user.id);

        rl.question("Yangi parolni kiriting: ", async (password) => {
            if (!password || password.length < 6) {
                console.log("Parol kamida 6 ta belgidan iborat bo‘lsin!");
                return;
            }

            user.password = password;

            await user.save();

            console.log("Parol muvaffaqiyatli yangilandi!");
            console.log("Endi login qilishingiz mumkin.");

            rl.close();
            await sequelize.close();
        });
    } catch (error) {
        console.error("Xatolik:", error.message);
        rl.close();
        await sequelize.close();
    }
}

resetPassword();
