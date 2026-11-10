const PhotoHebergement = require("../models/PhotoHebergement");
const Hebergement = require("../models/Hebergement");

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
    res.status(500).json({ message: error.message });
  }
};

// Supprimer une photo
exports.deletePhoto = async (req, res) => {
  try {
    const photo = await PhotoHebergement.findByIdAndDelete(req.params.id);

    if (!photo) {
      return res.status(404).json({
        message: "Photo introuvable",
      });
    }

    // Le fichier physique devra également être supprimé.
    res.json({ message: "Photo supprimée de la base de données" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
