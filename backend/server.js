require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./config/db");

const app = express();

// En-têtes de sécurité HTTP.
// "cross-origin" est nécessaire pour que le frontend puisse afficher /uploads
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// Origines autorisées : CORS_ORIGINS="https://monsite.com,http://localhost:5173"
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(cors({ origin: allowedOrigins }));

app.use(express.json({ limit: "1mb" }));
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
  res.status(404).json({ message: "Route introuvable" });
});

// Gestion des erreurs Express, notamment Multer
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);

  const status = err.status || 400;
  console.error(err);

  res.status(status).json({
    message:
      status >= 500 ? "Erreur serveur" : err.message || "Requête invalide",
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
  });
});
