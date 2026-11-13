const rateLimit = require("express-rate-limit");

// 10 tentatives de connexion max par IP toutes les 15 minutes
exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Trop de tentatives. Réessayez dans 15 minutes." },
});

// 10 demandes de devis max par IP et par heure (anti-spam)
exports.devisLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Trop de demandes envoyées. Réessayez plus tard." },
});
