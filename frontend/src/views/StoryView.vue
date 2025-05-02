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
            <!-- Barre de progression -->
            <div class="progress-bar">
                <div class="progress-info">
                    <span>Histoire : {{ storyTitle }}</span>
                    <span>Chapitre actuel : {{ currentChapter?.chapter_number || 1 }}/{{ totalChapters }}</span>
                </div>
                <div class="progress-track">
                    <div 
                        class="progress-fill"
                        :style="{ width: `${(currentChapter?.chapter_number || 1) / totalChapters * 100}%` }"
                    ></div>
                </div>
            </div>

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

            <!-- Actions supplémentaires -->
            <div class="story-actions">
                <button @click="restartStory" class="action-button">
                    Recommencer depuis le début
                </button>
                <button v-if="canGoBack" @click="goToPreviousChapter" class="action-button">
                    Retourner au chapitre précédent
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGameStore } from '@/stores/game';
import api from '@/services/api';

const route = useRoute();
const router = useRouter();
const gameStore = useGameStore();

const loading = ref(false);
const error = ref(null);
const currentChapter = ref(null);
const storyTitle = ref('');
const totalChapters = ref(0);
const canGoBack = ref(false);

onMounted(async () => {
    const storyId = route.params.id;
    try {
        // Charger les informations de l'histoire
        const storyResponse = await api.get(`/stories/${storyId}`);
        storyTitle.value = storyResponse.data.title;
        
        // Charger le nombre total de chapitres
        const chaptersResponse = await api.get(`/stories/${storyId}/chapters`);
        totalChapters.value = chaptersResponse.data.length;
        
        // Démarrer le jeu
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
        
        // Mettre à jour canGoBack
        canGoBack.value = gameStore.history && gameStore.history.length > 1;
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

const goToPreviousChapter = async () => {
    try {
        await gameStore.goBack();
        await loadChapter();
    } catch (err) {
        error.value = "Impossible de retourner au chapitre précédent";
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

.progress-bar {
    margin-bottom: 2rem;
    padding: 1rem;
    background: #f5f5f5;
    border-radius: 4px;
}

.progress-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    color: #666;
}

.progress-track {
    height: 8px;
    background: #ddd;
    border-radius: 4px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: #4CAF50;
    transition: width 0.3s ease;
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

.story-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
}

.action-button {
    padding: 0.75rem 1.5rem;
    background: #95a5a6;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.action-button:hover {
    background: #7f8c8d;
}

.restart-button {
    background: #2ecc71;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
    margin: 0.5rem;
}

.restart-button:hover {
    background: #27ae60;
}

.back-button {
    background: #95a5a6;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
    margin: 0.5rem;
}

.back-button:hover {
    background: #7f8c8d;
}
</style> 