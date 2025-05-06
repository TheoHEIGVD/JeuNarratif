<template>

  <!-- Container principal -->
  <div class="story-container">
    <!-- 1. Gestion des états -->
    <!-- Affichage des erreurs -->
    <div v-if="gameStore.hasError" class="error-message">
      {{ gameStore.error }}
      <button @click="gameStore.startGame()" class="retry-button">Réessayer</button>
    </div>
    <!-- État de chargement -->
    <div v-else-if="gameStore.isLoading" class="loading">
      <div class="loading-spinner"></div>
      <p>Chargement...</p>
    </div>

    <!-- 2. Contenu principal -->
    <div v-else-if="gameStore.currentChapter">
      <h2 class="chapter-title">{{ gameStore.currentChapter.title }}</h2>

      <div class="chapter-content">
        <p>{{ gameStore.currentChapter.content }}</p>
      </div>

            <!-- Choix disponibles -->
      <div class="choices-container" v-if="gameStore.currentChapter.choices?.length">
        <button v-for="choice in gameStore.currentChapter.choices" :key="choice.id" class="choice-button"
          :disabled="gameStore.isLoading" @click="handleChoice(choice.next_chapter_id)">
          {{ choice.text }}
        </button>
      </div>

            <!-- Navigation (retour/reset) -->
      <div class="navigation-controls">
        <button v-if="gameStore.canGoBack" @click="gameStore.goBack()" class="nav-button"
          :disabled="gameStore.isLoading">
          Retour au chapitre précédent
        </button>
        <button @click="gameStore.resetGame()" class="nav-button reset-button" :disabled="gameStore.isLoading">
          Recommencer l'histoire
        </button>
      </div>
    </div>

    <!-- 3. Écran de démarrage -->
    <div v-else class="start-screen">
      <h1>L'Étudiant Face à son Destin</h1>
      <button @click="gameStore.startGame()" class="start-button" :disabled="gameStore.isLoading">
        Commencer l'aventure
      </button>
    </div>
  </div>
</template>

<script setup>
// Import du store de jeu
import { useGameStore } from '@/stores/gameStore'

// Initialisation du store
const gameStore = useGameStore()

// Gestion des choix
const handleChoice = async (nextChapterId) => {
  await gameStore.setChapter(nextChapterId)
}
</script>

<style scoped>
.story-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.chapter-title {
  font-size: 2em;
  margin-bottom: 1em;
  text-align: center;
}

.chapter-content {
  font-size: 1.2em;
  line-height: 1.6;
  margin-bottom: 2em;
  background-color: #f8f9fa;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.choices-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.choice-button {
  padding: 1rem;
  font-size: 1.1em;
  background-color: #4a5568;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.choice-button:not(:disabled):hover {
  background-color: #2d3748;
  transform: translateY(-2px);
}

.choice-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.navigation-controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.nav-button {
  padding: 0.8rem 1.5rem;
  font-size: 1em;
  background-color: #718096;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.nav-button:not(:disabled):hover {
  background-color: #4a5568;
}

.nav-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.reset-button {
  background-color: #e53e3e;
}

.reset-button:not(:disabled):hover {
  background-color: #c53030;
}

.start-screen {
  text-align: center;
  padding: 4rem 2rem;
}

.start-screen h1 {
  font-size: 2.5em;
  margin-bottom: 2rem;
  color: #2d3748;
}

.start-button {
  padding: 1rem 2rem;
  font-size: 1.2em;
  background-color: #48bb78;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.start-button:not(:disabled):hover {
  background-color: #38a169;
  transform: translateY(-2px);
}

.loading {
  text-align: center;
  padding: 2rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 1rem;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error-message {
  background-color: #fed7d7;
  color: #c53030;
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
  margin-bottom: 1rem;
}

.retry-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #e53e3e;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.retry-button:hover {
  background-color: #c53030;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .story-container {
    padding: 15px;
  }

  .chapter-title {
    font-size: 1.5em;
  }

  .chapter-content {
    font-size: 1em;
    padding: 1rem;
  }

  .choice-button {
    padding: 0.8rem;
    font-size: 1em;
  }

  .start-screen h1 {
    font-size: 2em;
  }
}
</style>