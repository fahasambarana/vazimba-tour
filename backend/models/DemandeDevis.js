const mongoose = require("mongoose");

const devisSchema = new mongoose.Schema(
  {
    nom_client: {
      type: String,
      required: true,
    },

    email_client: {
      type: String,
      required: true,
    },

    telephone_client: {
      type: String,
      required: true,
    },

    id_circuit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Circuit",
      default: null,
    },

    option_chez_namana: {
      type: Boolean,
      default: false,
    },

    nb_personnes: {
      type: Number,
      required: true,
      min: 1,
    },

    date_debut: {
      type: Date,
      required: true,
    },

    date_fin: {
      type: Date,
      required: true,
    },

    remarques_besoins: {
      type: String,
      default: "",
    },

    statut_traitement: {
      type: String,
      enum: ["En attente", "En cours", "Acceptée", "Refusée"],
      default: "En attente",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("DemandeDevis", devisSchema);
