<template>


    <div class="story-viewer">

        <!-- 1. Loading state -->
        <div v-if="loading" class="loading">
            Chargement en cours...
        </div>

        <!-- 2. Error state -->
        <div v-else-if="error" class="error">
            {{ error }}
        </div>

        <!-- 3. Content state -->
        <div v-else-if="currentChapter" class="chapter">
            <h1>{{ currentChapter.title }}</h1>
            <div class="content">
                {{ currentChapter.content }}
            </div>

            <!-- Liste des choix OU fin de l'histoire -->
            <div v-if="currentChapter.choices && currentChapter.choices.length > 0" class="choices">
                <button v-for="choice in currentChapter.choices" :key="choice.id" @click="makeChoice(choice)"
                    class="choice-button">
                    {{ choice.text }}
                </button>
            </div>

            <!-- Message de fin + bouton recommencer -->
            <div v-else class="end">
                <p>Fin de l'histoire</p>
                <button @click="resetGame" class="reset-button">
                    Recommencer
                </button>
            </div>

            <button v-if="canGoBack" @click="goBack" class="back-button">
                Retour
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useGameStore } from '@/stores/gameStore';

// État du jeu via le store
const gameStore = useGameStore();

// Computed properties
const loading = computed(() => gameStore.isLoading);
const error = computed(() => gameStore.error);
const currentChapter = computed(() => gameStore.currentChapter);
const canGoBack = computed(() => gameStore.canGoBack);

// Gestion des choix du joueur
const makeChoice = async (choice) => {
    if (choice && choice.next_chapter_id) {
        await gameStore.setChapter(choice.next_chapter_id);
    }
};

// Navigation dans l'histoire
const goBack = () => {
    gameStore.goBack();
};

const resetGame = () => {
    gameStore.resetGame();
};
</script>

<style scoped>
/* Layout principal */
.story-viewer {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
}

/* États */
.loading,
.error {
    text-align: center;
    padding: 2rem;
    font-size: 1.2rem;
}

.error {
    color: #dc3545;
}

/* Contenu */
.chapter {
    background: #fff;
    border-radius: 8px;
    padding: 2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
    margin-bottom: 1.5rem;
    color: #2c3e50;
}

.content {
    margin-bottom: 2rem;
    line-height: 1.6;
    font-size: 1.1rem;
}

.choices {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
}

/* Boutons */
.choice-button {
    padding: 1rem;
    border: none;
    border-radius: 4px;
    background: #3498db;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s;
}

.choice-button:hover {
    background: #2980b9;
}

.back-button {
    padding: 0.5rem 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: white;
    cursor: pointer;
    transition: background-color 0.2s;
}

.back-button:hover {
    background: #f5f5f5;
}

.end {
    text-align: center;
    margin: 2rem 0;
}

.reset-button {
    padding: 1rem 2rem;
    border: none;
    border-radius: 4px;
    background: #2ecc71;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s;
}

.reset-button:hover {
    background: #27ae60;
}
</style>