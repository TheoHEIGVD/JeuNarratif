<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // 1. Validation des données
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

            // 2. Vérification de l'utilisateur
        $user = User::where('email', $request->email)->first();

            // 3. Vérification du mot de passe
        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Identifiants invalides'], 401);
        }

            // 4. Gestion des tokens
        // Supprimer les tokens précédents si tu veux limiter à 1 session
        $user->tokens()->delete();

        $token = $user->createToken('main')->plainTextToken;

            // 5. Retourne la réponse
        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete(); // déconnecte l’utilisateur de toutes les sessions

        return response()->json(['message' => 'Déconnexion réussie']);
    }
}
