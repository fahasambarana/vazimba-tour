# Vazimba Tour — frontend

Interface React/Vite pour le site public et l'espace d'administration de Vazimba Tour.

## Démarrage

```sh
npm install
npm run dev
```

Le backend est configuré par défaut sur `http://localhost:5000/api`. Pour utiliser une autre adresse, définir `VITE_API_URL` dans le fichier `.env` du frontend.

## Pages

- `/` : accueil, engagements, expérience phare, circuits filtrables par thématique et région et présentation de Chez Namana.
- `/a-propos` : présentation de l'esprit Vazimba Tour et de sa démarche.
- `/chez-l-habitant` : présentation de Chez Namana et galerie de photos.
- `/circuits/:id` : détails et étapes d'un circuit, avec accès au formulaire de devis.
- `/devis` : demande de devis avec choix de la thématique, de la région, des dates et du nombre de voyageurs.
- `/admin/login` : connexion administrateur.
- `/admin/circuits` : création, modification et suppression des circuits et de leurs étapes.
- `/admin/devis` : consultation des demandes et mise à jour de leur statut.
- `/admin/photos` : consultation, ajout et suppression des photos d'un hébergement.

Les appels d'administration utilisent le jeton JWT renvoyé par `/api/auth/login`. La gestion des photos demande l'identifiant MongoDB de l'hébergement, car le backend ne fournit pas de route de liste des hébergements.

## Configuration du contenu public

Créer `frontend/.env` pour renseigner les coordonnées et activer la galerie :

```env
VITE_API_URL=http://localhost:5000/api
VITE_HEBERGEMENT_ID=
VITE_CONTACT_EMAIL=
VITE_WHATSAPP_NUMBER=
VITE_FACEBOOK_URL=
VITE_INSTAGRAM_URL=
```

Le numéro WhatsApp doit être au format international, chiffres uniquement. L'identifiant `VITE_HEBERGEMENT_ID` est l'identifiant MongoDB de Chez Namana ; sans lui, la page d'hébergement reste disponible mais ne peut pas charger les photos de l'API. Les coordonnées restent vides tant que les contacts officiels ne sont pas fournis.

Le backend actuel ne possède pas de modèle ni de route pour la disponibilité des chambres. La gestion de cette disponibilité nécessite une évolution de l'API avant de pouvoir être proposée dans le tableau de bord.

## Vérification

```sh
npm run lint
npm run build
```
