require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const nom = process.env.ADMIN_NAME || "Administrateur";

    if (!email || !password || password.length < 8) {
      throw new Error(
        "Configure ADMIN_EMAIL et un ADMIN_PASSWORD d'au moins 8 caractères",
      );
    }

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      console.log("Cet administrateur existe déjà.");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    await Admin.create({
      nom,
      email,
      password: hashedPassword,
    });

    console.log("Administrateur créé avec succès !");
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();
