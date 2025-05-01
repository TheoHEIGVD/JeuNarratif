<template>
    <div class="chapter">
        <div v-if="loading">Chargement...</div>
        <div v-else-if="error">{{ error }}</div>
        <div v-else-if="currentChapter">
            <div class="chapter-content">
                <h1>Chapitre {{ currentChapter.chapter_number }}</h1>
                <div class="text">{{ currentChapter.content }}</div>
            </div>

            <div class="choices" v-if="currentChapter.choices && currentChapter.choices.length > 0">
                <h2>Que voulez-vous faire ?</h2>
                <div class="choices-list">
                    <button
                        v-for="choice in currentChapter.choices"
                        :key="choice.id"
                        @click="makeChoice(choice.next_chapter_id)"
                        class="choice-btn"
                    >
                        {{ choice.text }}
                    </button>
                </div>
            </div>
            <div v-else class="end-message">
                <p>Fin de l'histoire</p>
                <button @click="$emit('back')" class="btn">Retour à l'accueil</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import chapterService from '../services/chapterService';

const props = defineProps({
    id: {
        type: [String, Number],
        required: true
    }
});

const currentChapter = ref(null);
const loading = ref(false);
const error = ref(null);

const makeChoice = (nextChapterId) => {
    if (nextChapterId) {
        props.id = nextChapterId;
        fetchChapter();
    }
};

const fetchChapter = async () => {
    loading.value = true;
    try {
        currentChapter.value = await chapterService.getById(props.id);
    } catch (err) {
        error.value = err.message;
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchChapter();
});
</script>

<style scoped>
.chapter {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
}

.chapter-content {
    margin-bottom: 3rem;
}

.text {
    font-size: 1.2rem;
    line-height: 1.8;
    color: #333;
    margin-top: 1.5rem;
}

.choices {
    margin-top: 2rem;
}

.choices-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1.5rem;
}

.choice-btn {
    padding: 1rem;
    background: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background-color 0.2s;
}

.choice-btn:hover {
    background: #3aa876;
}

.end-message {
    text-align: center;
    margin-top: 3rem;
    padding: 2rem;
    background: #f8f9fa;
    border-radius: 8px;
}

.btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background: #42b983;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    margin-top: 1rem;
    border: none;
    cursor: pointer;
}

.btn:hover {
    background: #3aa876;
}
</style> 