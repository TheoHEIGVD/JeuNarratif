import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/services/api';

export const useGameStore = defineStore('game', () => {
  const currentStoryId = ref(null);
  const currentChapterId = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const startGame = async (storyId) => {
    try {
      loading.value = true;
      error.value = null;
      currentStoryId.value = storyId;
      
      // Récupérer la progression existante ou commencer au premier chapitre
      const progressResponse = await api.get('/progress');
      const existingProgress = progressResponse.data.find(p => p.story_id === storyId);

      if (existingProgress) {
        currentChapterId.value = existingProgress.chapter_id;
      } else {
        // Récupérer le premier chapitre de l'histoire
        const chaptersResponse = await api.get(`/stories/${storyId}/chapters`);
        if (chaptersResponse.data && chaptersResponse.data.length > 0) {
          const firstChapter = chaptersResponse.data[0];
          currentChapterId.value = firstChapter.id;

          // Sauvegarder la nouvelle progression
          await api.post('/progress', {
            story_id: storyId,
            chapter_id: firstChapter.id
          });
        } else {
          throw new Error('Aucun chapitre trouvé pour cette histoire');
        }
      }
    } catch (err) {
      error.value = "Impossible de démarrer le jeu";
      console.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const setChapter = async (storyId, chapterId) => {
    try {
      loading.value = true;
      error.value = null;

      // Vérifier si nous avons déjà une progression
      const progressResponse = await api.get('/progress');
      const existingProgress = progressResponse.data.find(p => p.story_id === storyId);

      if (existingProgress) {
        // Mettre à jour la progression existante
        await api.put(`/progress/${existingProgress.id}`, {
          chapter_id: chapterId
        });
      } else {
        // Créer une nouvelle progression
        await api.post('/progress', {
          story_id: storyId,
          chapter_id: chapterId
        });
      }

      currentStoryId.value = storyId;
      currentChapterId.value = chapterId;
    } catch (err) {
      error.value = "Impossible de mettre à jour la progression";
      console.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const resetGame = async (storyId) => {
    try {
      loading.value = true;
      error.value = null;

      // Récupérer la progression existante
      const progressResponse = await api.get('/progress');
      const existingProgress = progressResponse.data.find(p => p.story_id === storyId);

      if (existingProgress) {
        // Supprimer la progression actuelle
        await api.delete(`/progress/${existingProgress.id}`);
      }

      // Recommencer au premier chapitre
      const chaptersResponse = await api.get(`/stories/${storyId}/chapters`);
      if (chaptersResponse.data && chaptersResponse.data.length > 0) {
        const firstChapter = chaptersResponse.data[0];
        
        // Créer une nouvelle progression
        await api.post('/progress', {
          story_id: storyId,
          chapter_id: firstChapter.id
        });

        currentStoryId.value = storyId;
        currentChapterId.value = firstChapter.id;
      } else {
        throw new Error('Aucun chapitre trouvé pour cette histoire');
      }
    } catch (err) {
      error.value = "Impossible de réinitialiser le jeu";
      console.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    currentStoryId,
    currentChapterId,
    loading,
    error,
    startGame,
    setChapter,
    resetGame
  };
}); 