const EtapeCircuit = require("../models/EtapeCircuit");
const Circuit = require("../models/Circuit");

// Ajouter une étape
exports.createEtape = async (req, res) => {
  try {
    const { id_circuit } = req.body;

    const circuit = await Circuit.findById(id_circuit);

    if (!circuit) {
      return res.status(404).json({
        message: "Circuit introuvable",
      });
    }

    const etape = await EtapeCircuit.create(req.body);

    res.status(201).json({
      message: "Étape ajoutée",
      data: etape,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Afficher les étapes d'un circuit
exports.getEtapes = async (req, res) => {
  try {
    const etapes = await EtapeCircuit.find({
      id_circuit: req.params.circuitId,
    }).sort({ numero_jour: 1 });

    res.json({ data: etapes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Modifier une étape
exports.updateEtape = async (req, res) => {
  try {
    const etape = await EtapeCircuit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!etape) {
      return res.status(404).json({
        message: "Étape introuvable",
      });
    }

    res.json({
      message: "Étape modifiée",
      data: etape,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer une étape
exports.deleteEtape = async (req, res) => {
  try {
    const etape = await EtapeCircuit.findByIdAndDelete(req.params.id);

    if (!etape) {
      return res.status(404).json({
        message: "Étape introuvable",
      });
    }

    res.json({ message: "Étape supprimée" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
