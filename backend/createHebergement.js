require("dotenv").config();

const mongoose = require("mongoose");
const Hebergement = require("./models/Hebergement");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    let hebergement = await Hebergement.findOne();

    if (!hebergement) {
      hebergement = await Hebergement.create({
        nom_etablissement: "Chez Namana",
        localisation: "Betafo",
        description_lieu:
          "Maison d'hôtes chez l'habitant à Betafo, au cœur des Hautes Terres.",
        services_repas: "Cuisine traditionnelle malgache",
        contact_reservation: "",
      });
    }

    console.log("ID de l'hébergement :", hebergement._id.toString());
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
