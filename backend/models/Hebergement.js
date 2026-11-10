const mongoose = require("mongoose");

const hebergementSchema = new mongoose.Schema(
  {
    nom_etablissement: {
      type: String,
      required: true,
      default: "Chez Namana",
    },

    localisation: {
      type: String,
      required: true,
      default: "Betafo",
    },

    description_lieu: {
      type: String,
      required: true,
    },

    services_repas: {
      type: String,
      default: "",
    },

    contact_reservation: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Hebergement", hebergementSchema);
