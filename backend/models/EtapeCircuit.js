const mongoose = require("mongoose");

const etapeSchema = new mongoose.Schema(
  {
    id_circuit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Circuit",
      required: true,
    },

    numero_jour: {
      type: Number,
      required: true,
      min: 1,
    },

    titre_etape: {
      type: String,
      required: true,
    },

    lieu: {
      type: String,
      required: true,
    },

    activites: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("EtapeCircuit", etapeSchema);
