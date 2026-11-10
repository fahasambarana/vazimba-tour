const DemandeDevis = require("../models/DemandeDevis");
const Circuit = require("../models/Circuit");

// Envoyer une demande
exports.createDevis = async (req, res) => {
  try {
    const {
      nom_client,
      email_client,
      telephone_client,
      id_circuit,
      nb_personnes,
      date_debut,
      date_fin,
    } = req.body;

    if (
      !nom_client ||
      !email_client ||
      !telephone_client ||
      !nb_personnes ||
      !date_debut ||
      !date_fin
    ) {
      return res.status(400).json({
        message: "Veuillez remplir tous les champs obligatoires",
      });
    }

    if (!Number.isInteger(Number(nb_personnes)) || Number(nb_personnes) < 1) {
      return res.status(400).json({
        message: "Nombre de participants invalide",
      });
    }

    const debut = new Date(date_debut);
    const fin = new Date(date_fin);

    if (
      Number.isNaN(debut.getTime()) ||
      Number.isNaN(fin.getTime()) ||
      fin <= debut
    ) {
      return res.status(400).json({
        message: "Les dates de voyage sont invalides",
      });
    }

    if (id_circuit) {
      const circuit = await Circuit.findById(id_circuit);

      if (!circuit) {
        return res.status(404).json({
          message: "Circuit introuvable",
        });
      }
    }

    const devis = await DemandeDevis.create(req.body);

    res.status(201).json({
      message: "Votre demande de devis a été envoyée",
      data: devis,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Afficher toutes les demandes (admin)
exports.getDevis = async (req, res) => {
  try {
    const devis = await DemandeDevis.find()
      .populate("id_circuit", "titre prix_a_partir")
      .sort({ createdAt: -1 });

    res.json({
      total: devis.length,
      data: devis,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Modifier le statut
exports.updateDevis = async (req, res) => {
  try {
    const devis = await DemandeDevis.findByIdAndUpdate(
      req.params.id,
      { statut_traitement: req.body.statut_traitement },
      { new: true, runValidators: true },
    );

    if (!devis) {
      return res.status(404).json({
        message: "Demande introuvable",
      });
    }

    res.json({
      message: "Statut mis à jour",
      data: devis,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = exports;
