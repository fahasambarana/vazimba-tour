const Circuit = require("../models/Circuit");
const EtapeCircuit = require("../models/EtapeCircuit");
const pick = require("../utils/pick");

const CIRCUIT_FIELDS = [
  "titre",
  "theme",
  "axe_region",
  "duree_jours",
  "prix_a_partir",
  "description",
  "is_featured",
  "image_principale",
];

// Ajouter un circuit
exports.createCircuit = async (req, res) => {
  try {
    const circuit = await Circuit.create(pick(req.body, CIRCUIT_FIELDS));

    res.status(201).json({
      message: "Circuit créé avec succès",
      data: circuit,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// Afficher tous les circuits
exports.getCircuits = async (req, res) => {
  try {
    const { theme, axe_region, is_featured } = req.query;

    const filters = {};

    if (theme) filters.theme = theme;
    if (axe_region) filters.axe_region = axe_region;

    if (is_featured !== undefined) {
      filters.is_featured = is_featured === "true";
    }

    const circuits = await Circuit.find(filters).sort({ createdAt: -1 });

    res.json({
      total: circuits.length,
      data: circuits,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Afficher un circuit avec ses étapes
exports.getCircuitById = async (req, res) => {
  try {
    const circuit = await Circuit.findById(req.params.id);

    if (!circuit) {
      return res.status(404).json({
        message: "Circuit introuvable",
      });
    }

    const etapes = await EtapeCircuit.find({
      id_circuit: circuit._id,
    }).sort({ numero_jour: 1 });

    res.json({
      data: {
        ...circuit.toObject(),
        etapes,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Modifier un circuit
exports.updateCircuit = async (req, res) => {
  try {
    const circuit = await Circuit.findByIdAndUpdate(
      req.params.id,
      pick(req.body, CIRCUIT_FIELDS),
      {
        new: true,
        runValidators: true,
      },
    );

    if (!circuit) {
      return res.status(404).json({
        message: "Circuit introuvable",
      });
    }

    res.json({
      message: "Circuit modifié avec succès",
      data: circuit,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer un circuit et ses étapes
exports.deleteCircuit = async (req, res) => {
  try {
    const circuit = await Circuit.findById(req.params.id);

    if (!circuit) {
      return res.status(404).json({
        message: "Circuit introuvable",
      });
    }

    await EtapeCircuit.deleteMany({
      id_circuit: circuit._id,
    });

    await circuit.deleteOne();

    res.json({
      message: "Circuit et ses étapes supprimés",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
