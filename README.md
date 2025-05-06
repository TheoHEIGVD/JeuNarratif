<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## Backend - Jeu Narratif Interactif
Ce projet est une API REST développée dans le cadre du cours devProdMed. Elle constitue la partie backend de mon jeu narratif interactif ou Les joueurs peuvent suivre des histoires, faire des choix et sauvegarder leur progression.

# Structure
Le projet s'organise autour de plusieurs modèles liés :

Stories (histoires)
Chapters (chapitres)
Choices (choix possibles)
Progress (progression des joueurs)

# Points clés
API RESTful avec authentification Sanctum
Validation des données via FormRequest
Protection des routes sensibles
Gestion standardisée des erreurs
Réponses JSON structurées

# Routes principales
POST   /api/auth/register    Inscription
POST   /api/auth/login      Connexion
GET    /api/stories         Liste des histoires
GET    /api/chapters/{id}   Détails d'un chapitre
POST   /api/progress        Sauvegarde progression

# Développement
Le projet utilise :
PHP 8.2
Laravel 10
MySQL
PHPUnit pour les tests

Theo Imfeld [theo.imfeld@hes-so.ch]