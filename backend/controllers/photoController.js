const PhotoHebergement = require("../models/PhotoHebergement");
const Hebergement = require("../models/Hebergement");
const fs = require("fs");
const path = require("path");

// Ajouter une photo
exports.createPhoto = async (req, res) => {
  try {
    const { id_hebergement, titre_photo, categorie, is_principale } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "Veuillez sélectionner une image",
      });
    }

    const hebergement = await Hebergement.findById(id_hebergement);

    if (!hebergement) {
      return res.status(404).json({
        message: "Hébergement introuvable",
      });
    }

    const photo = await PhotoHebergement.create({
      id_hebergement,
      titre_photo,
      categorie,
      is_principale: is_principale === "true",
      url_image: `/uploads/${req.file.filename}`,
    });

    res.status(201).json({
      message: "Photo ajoutée avec succès",
      data: photo,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Afficher les photos
exports.getPhotos = async (req, res) => {
  try {
    const photos = await PhotoHebergement.find({
      id_hebergement: req.params.hebergementId,
    });

    res.json({ data: photos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Supprimer une photo (base de données + fichier sur le disque)
exports.deletePhoto = async (req, res) => {
  try {
    const photo = await PhotoHebergement.findByIdAndDelete(req.params.id);

    if (!photo) {
      return res.status(404).json({
        message: "Photo introuvable",
      });
    }

    // path.basename évite qu'on supprime un fichier hors du dossier uploads
    const filePath = path.join("uploads", path.basename(photo.url_image));

    fs.unlink(filePath, (err) => {
      if (err) console.error("Fichier non supprimé :", err.message);
    });

    res.json({ message: "Photo supprimée" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
