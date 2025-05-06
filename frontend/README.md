# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).


## Frontend- Jeu Narratif Interactif
Ce projet est une Interface utilisateur Vue.js développée dans le cadre du cours WebMobUI. Elle constitue la partie frontend de mon jeu narratif interactif ou Les joueurs peuvent suivre des histoires, faire des choix et sauvegarder leur progression.

# Structure
Le frontend s'organise autour de plusieurs composants clés :

Composants Principaux
Game : Gestion du jeu et navigation
Story : Affichage des histoires
Chapter : Contenu des chapitres
Auth : Authentification utilisateur

Stores (Pinia)
gameStore : État du jeu et progression
authStore : Gestion de l'authentification
storyStore : Gestion des histoires

# Points Clés
Affichage des histoires disponibles
Interface responsive (mobile/desktop)
Navigation entre chapitres
Sauvegarde automatique de la progression
Gestion des erreurs utilisateur
Authentification sécurisée


# Technologies Utilisées
Vue.js 3
Pinia pour la gestion d'état
Vue Router
Axios pour les requêtes API
SCSS pour le styling

# Structure des Fichiers
frontend/
├── src/
│   ├── components/    # Composants Vue
│   ├── stores/       # Stores Pinia
│   ├── views/        # Pages
│   ├── services/     # Services API
│   └── router/       # Configuration des routes

Theo Imfeld [theo.imfeld@hes-so.ch] 


