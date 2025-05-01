<template>
    <div class="home">
        <h1>Bienvenue dans le Jeu Narratif</h1>
        
        <div v-if="loading" class="loading">
            Chargement des histoires...
        </div>
        
        <div v-else-if="error" class="error">
            {{ error }}
        </div>
        
        <div v-else class="stories-grid">
            <div 
                v-for="story in stories" 
                :key="story.id" 
                class="story-card"
                @click="startGame(story.id)"
            >
                <h2>{{ story.title }}</h2>
                <p>{{ story.summary }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '@/stores/game';
import api from '@/services/api';

const router = useRouter();
const gameStore = useGameStore();

const stories = ref([]);
const loading = ref(false);
const error = ref(null);

onMounted(async () => {
    try {
        loading.value = true;
        const response = await api.get('/stories');
        stories.value = response.data;
    } catch (err) {
        error.value = "Impossible de charger les histoires";
        console.error(err);
    } finally {
        loading.value = false;
    }
});

const startGame = async (storyId) => {
    try {
        await gameStore.startGame(storyId);
        router.push(`/story/${storyId}`);
    } catch (err) {
        error.value = "Impossible de démarrer le jeu";
        console.error(err);
    }
};
</script>

<style scoped>
.home {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

h1 {
    text-align: center;
    margin-bottom: 2rem;
    color: #2c3e50;
}

.loading, .error {
    text-align: center;
    padding: 2rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.error {
    color: #e74c3c;
}

.stories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
}

.story-card {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}

.story-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.story-card h2 {
    margin: 0 0 1rem 0;
    color: #2c3e50;
}

.story-card p {
    margin: 0;
    color: #666;
    line-height: 1.5;
}
</style> 