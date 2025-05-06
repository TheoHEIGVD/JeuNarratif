<template>
    <div class="story-view">
        <div v-if="loading" class="loading">
            Chargement de l'histoire...
        </div>

        <div v-else-if="error" class="error">
            {{ error }}
            <button @click="goBack" class="back-button">Retourner à l'accueil</button>
        </div>

        <div v-else class="story-content">
            <h1>{{ currentChapter?.title }}</h1>
            
            <div class="chapter-content">
                {{ currentChapter?.content }}
            </div>

            <div v-if="currentChapter?.choices?.length" class="choices">
                <button
                    v-for="choice in currentChapter.choices"
                    :key="choice.id"
                    @click="makeChoice(choice)"
                    class="choice-button"
                >
                    {{ choice.text }}
                </button>
            </div>

            <div v-else class="story-end">
                <p>Fin de l'histoire</p>
                <button @click="restartStory" class="restart-button">Recommencer l'histoire</button>
                <button @click="goBack" class="back-button">Choisir une autre histoire</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGameStore } from '@/stores/game';
import api from '@/services/api';

const route = useRoute();
const router = useRouter();
const gameStore = useGameStore();

const loading = ref(false);
const error = ref(null);
const currentChapter = ref(null);

onMounted(async () => {
    const storyId = route.params.id;
    try {
        await gameStore.startGame(storyId);
        await loadChapter();
    } catch (err) {
        error.value = "Impossible de démarrer l'histoire";
        console.error(err);
    }
});

const loadChapter = async () => {
    try {
    loading.value = true;
        const chapterId = gameStore.currentChapterId;
        
        if (!chapterId) {
            throw new Error('Aucun chapitre sélectionné');
        }

        const response = await api.get(`/chapters/${chapterId}`);
        currentChapter.value = response.data;
        
        // Charger les choix
        const choicesResponse = await api.get(`/chapters/${chapterId}/choices`);
        currentChapter.value.choices = choicesResponse.data;
    } catch (err) {
        error.value = "Impossible de charger le chapitre";
        console.error(err);
    } finally {
        loading.value = false;
    }
};

const makeChoice = async (choice) => {
    try {
        loading.value = true;
        const storyId = route.params.id;
        await gameStore.setChapter(storyId, choice.next_chapter_id);
        await loadChapter();
    } catch (err) {
        error.value = "Impossible de continuer l'histoire";
        console.error(err);
    } finally {
        loading.value = false;
    }
};

const restartStory = async () => {
    try {
        const storyId = route.params.id;
        await gameStore.resetGame(storyId);
        await loadChapter();
    } catch (err) {
        error.value = "Impossible de redémarrer l'histoire";
        console.error(err);
    }
};

const goBack = () => {
    router.push('/');
};
</script>

<style scoped>
.story-view {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.loading, .error {
    text-align: center;
    padding: 2rem;
}

.error {
    color: #e74c3c;
}

h1 {
    color: #2c3e50;
    margin-bottom: 2rem;
    text-align: center;
}

.chapter-content {
    font-size: 1.1rem;
    line-height: 1.8;
    margin-bottom: 2rem;
    color: #34495e;
    white-space: pre-line;
}

.choices {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 2rem;
}

.choice-button {
    padding: 1rem;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 1rem;
    text-align: left;
}

.choice-button:hover {
    background: #2980b9;
}

.story-end {
    text-align: center;
    margin-top: 2rem;
}

.restart-button, .back-button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
    margin: 0.5rem;
}

.restart-button {
    background: #2ecc71;
    color: white;
}

.restart-button:hover {
    background: #27ae60;
}

.back-button {
    background: #95a5a6;
    color: white;
}

.back-button:hover {
    background: #7f8c8d;
}
</style> 