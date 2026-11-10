const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema(
  {
    id_hebergement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hebergement",
      required: true,
    },

    titre_photo: {
      type: String,
      required: true,
    },

    url_image: {
      type: String,
      required: true,
    },

    categorie: {
      type: String,
      enum: ["Chambre", "Repas", "Exterieur"],
      required: true,
    },

    is_principale: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("PhotoHebergement", photoSchema);
