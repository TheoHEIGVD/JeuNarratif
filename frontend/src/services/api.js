import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { config } from '@/config';

const api = axios.create({
    baseURL: config.API_URL,
    timeout: config.API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
    const authStore = useAuthStore();
    const token = authStore.token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const authStore = useAuthStore();
            authStore.logout();
        }
        return Promise.reject(error);
    }
);

export const storyService = {
    // Récupérer tous les chapitres d'une histoire
    async getChapters() {
        try {
            const response = await api.get('/chapters');
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des chapitres:', error);
            throw error;
        }
    },

    // Récupérer un chapitre spécifique
    async getChapter(id) {
        try {
            const response = await api.get(`/chapters/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération du chapitre ${id}:`, error);
            throw error;
        }
    },

    // Récupérer les choix d'un chapitre
    async getChapterChoices(chapterId) {
        try {
            const response = await api.get(`/chapters/${chapterId}/choices`);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération des choix du chapitre ${chapterId}:`, error);
            throw error;
        }
    },

    // Récupérer la progression de l'utilisateur
    async getProgress() {
        try {
            const response = await api.get('/progress');
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération de la progression:', error);
            throw error;
        }
    },

    // Sauvegarder la progression
    async saveProgress(storyId, chapterId, choiceId = null) {
        try {
            const response = await api.post('/progress', {
                story_id: storyId,
                chapter_id: chapterId,
                choice_id: choiceId
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de la progression:', error);
            throw error;
        }
    },

    // Mettre à jour la progression
    async updateProgress(progressId, chapterId, choiceId = null) {
        try {
            const response = await api.put(`/progress/${progressId}`, {
                chapter_id: chapterId,
                choice_id: choiceId
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la progression:', error);
            throw error;
        }
    }
};

export default api; 