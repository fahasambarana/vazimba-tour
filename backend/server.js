require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Middlewares globaux
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Accès aux photos téléchargées
app.use("/uploads", express.static("uploads"));

// Routes API
app.use("/api/circuits", require("./routes/circuitRoutes"));

app.use("/api/etapes", require("./routes/etapeRoutes"));

app.use("/api/photos", require("./routes/photoRoutes"));

app.use("/api/devis", require("./routes/devisRoutes"));

app.use("/api/auth", require("./routes/authRoutes"));

// Route principale
app.get("/", (req, res) => {
  res.json({
    message: "API Vazimba Tour opérationnelle",
    version: "1.0.0",
  });
});

// Route inexistante
app.use((req, res) => {
  res.status(404).json({
    message: "Route introuvable",
  });
});

// Gestion des erreurs Express, notamment Multer
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);

  res.status(err.status || 400).json({
    message: err.message || "Erreur serveur",
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
  });
});
