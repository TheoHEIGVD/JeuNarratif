<template>
  <nav class="navbar">
    <!-- Logo et lien vers l'accueil -->
    <div class="navbar-brand">
      <router-link to="/" class="logo">Jeu Narratif</router-link>
    </div>
    
    <!-- Menu de navigation -->
    <div class="navbar-menu">
      <!-- Si utilisateur connecté -->
      <template v-if="isAuthenticated">
        <!-- Affichage du nom et bouton déconnexion -->
        <div class="navbar-item">
          <span class="user-info">Bonjour, {{ user?.name }}</span>
        </div>
        <div class="navbar-item">
          <button @click="handleLogout" class="logout-button" :disabled="loading">
            {{ loading ? 'Déconnexion...' : 'Se déconnecter' }}
          </button>
        </div>
      </template>
      
      <!-- Si utilisateur non connecté -->
      <template v-else>
        <!-- Liens connexion/inscription -->
        <div class="navbar-item">
          <router-link to="/login" class="nav-link">Se connecter</router-link>
        </div>
        <div class="navbar-item">
          <router-link to="/register" class="nav-link">S'inscrire</router-link>
        </div>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

// Initialisation des stores et router
const authStore = useAuthStore();
const router = useRouter();

// Propriétés calculées
const user = computed(() => authStore.user);
const isAuthenticated = computed(() => authStore.isAuthenticated);
const loading = computed(() => authStore.loading);

// Gestion de la déconnexion
const handleLogout = async () => {
  try {
    await authStore.logout();
    router.push('/login');
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
  }
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #2c3e50;
  color: white;
}

.navbar-brand {
  font-size: 1.5rem;
  font-weight: bold;
}

.logo {
  color: white;
  text-decoration: none;
}

.navbar-menu {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.navbar-item {
  display: flex;
  align-items: center;
}

.user-info {
  margin-right: 1rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.logout-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-button:hover:not(:disabled) {
  background-color: #c0392b;
}

.logout-button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}
</style>