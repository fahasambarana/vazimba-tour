const mongoose = require("mongoose");

const circuitSchema = new mongoose.Schema(
  {
    titre: {
      type: String,
      required: true,
      trim: true,
    },

    theme: {
      type: String,
      required: true,
      enum: ["Villageois", "Aventure", "Classique"],
    },

    axe_region: {
      type: String,
      required: true,
      enum: ["Vakinankaratra", "Nord", "Sud", "Est", "Ouest"],
    },

    duree_jours: {
      type: Number,
      required: true,
      min: 1,
    },

    prix_a_partir: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      required: true,
    },

    is_featured: {
      type: Boolean,
      default: false,
    },

    image_principale: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Circuit", circuitSchema);
