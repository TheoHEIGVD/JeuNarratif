import { defineStore } from "pinia";
import { storyService } from "@/services/api";
import api from '@/services/api';

export const useGameStore = defineStore("game", {
    state: () => ({
        currentChapter: null,
        currentStory: null,
        history: [], // Pour garder une trace du parcours du joueur
        gameStarted: false,
        loading: false,
        error: null,
        chaptersCache: {}, // Cache des chapitres
        progress: null, // Progression de l'utilisateur
        currentStoryId: null,
        currentChapterId: null,
    }),

    actions: {
        async startGame(storyId) {
            try {
                this.loading = true;
                this.error = null;
                this.currentStoryId = storyId;

                // Récupérer la progression existante si elle existe
                const progress = await storyService.getProgress();
                const existingProgress = progress.find(p => p.story_id === storyId);

                if (existingProgress) {
                    // Charger le dernier chapitre joué
                    const chapter = await storyService.getChapter(existingProgress.chapter_id);
                    const choices = await storyService.getChapterChoices(existingProgress.chapter_id);
                    
                    this.currentChapter = {
                        ...chapter,
                        choices,
                    };
                    this.currentChapterId = existingProgress.chapter_id;
                    this.chaptersCache[chapter.id] = this.currentChapter;
                    this.history = existingProgress.choices_history || [chapter.id];
                    this.progress = existingProgress;
                } else {
                    // Commencer une nouvelle partie - récupérer le premier chapitre de l'histoire
                    const chaptersResponse = await api.get(`/stories/${storyId}/chapters`);
                    if (chaptersResponse.data && chaptersResponse.data.length > 0) {
                        const firstChapter = chaptersResponse.data[0];
                        const choices = await storyService.getChapterChoices(firstChapter.id);

                        this.currentChapter = {
                            ...firstChapter,
                            choices,
                        };
                        this.currentChapterId = firstChapter.id;
                        this.chaptersCache[firstChapter.id] = this.currentChapter;
                        this.history = [firstChapter.id];
                        
                        // Sauvegarder la nouvelle progression
                        this.progress = await storyService.saveProgress(storyId, firstChapter.id);
                    } else {
                        throw new Error("Aucun chapitre trouvé pour cette histoire");
                    }
                }

                this.gameStarted = true;
            } catch (error) {
                this.error = "Impossible de démarrer le jeu. Veuillez réessayer.";
                console.error("Erreur lors du démarrage du jeu:", error);
            } finally {
                this.loading = false;
            }
        },

        async setChapter(chapterId, storyId = null) {
            try {
                this.loading = true;
                this.error = null;

                if (storyId) {
                    this.currentStoryId = storyId;
                }

                // Vérifier si nous avons déjà le chapitre en cache
                if (!this.chaptersCache[chapterId]) {
                    const chapter = await storyService.getChapter(chapterId);
                    const choices = await storyService.getChapterChoices(chapterId);
                    this.chaptersCache[chapterId] = {
                        ...chapter,
                        choices,
                    };
                }

                this.currentChapter = this.chaptersCache[chapterId];
                this.currentChapterId = chapterId;
                this.history.push(chapterId);

                // Mettre à jour la progression
                if (this.progress) {
                    this.progress = await storyService.updateProgress(
                        this.progress.id,
                        chapterId,
                        this.history[this.history.length - 2] // Le choix précédent
                    );
                } else if (storyId) {
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
                }
            } catch (error) {
                this.error = "Impossible de charger le chapitre. Veuillez réessayer.";
                console.error("Erreur lors du chargement du chapitre:", error);
            } finally {
                this.loading = false;
            }
        },

        goBack() {
            if (this.history.length > 1) {
                this.history.pop();
                const previousChapterId = this.history[this.history.length - 1];
                this.currentChapter = this.chaptersCache[previousChapterId];
                this.currentChapterId = previousChapterId;
            }
        },

        async resetGame(storyId = null) {
            if (storyId || this.currentStoryId) {
                const targetStoryId = storyId || this.currentStoryId;
                
                try {
                    this.loading = true;
                    this.error = null;

                    // Récupérer la progression existante
                    const progressResponse = await api.get('/progress');
                    const existingProgress = progressResponse.data.find(p => p.story_id === targetStoryId);

                    if (existingProgress) {
                        // Supprimer la progression actuelle
                        await api.delete(`/progress/${existingProgress.id}`);
                    }

                    // Recommencer au premier chapitre
                    const chaptersResponse = await api.get(`/stories/${targetStoryId}/chapters`);
                    if (chaptersResponse.data && chaptersResponse.data.length > 0) {
                        const firstChapter = chaptersResponse.data[0];
                        
                        // Créer une nouvelle progression
                        await api.post('/progress', {
                            story_id: targetStoryId,
                            chapter_id: firstChapter.id
                        });

                        this.currentStoryId = targetStoryId;
                        this.currentChapterId = firstChapter.id;
                        
                        // Recharger le chapitre
                        await this.setChapter(firstChapter.id, targetStoryId);
                    }
                } catch (error) {
                    this.error = "Impossible de réinitialiser le jeu";
                    console.error(error);
                } finally {
                    this.loading = false;
                }
            } else {
                // Reset complet sans appels API
                this.currentChapter = null;
                this.currentStory = null;
                this.currentStoryId = null;
                this.currentChapterId = null;
                this.history = [];
                this.gameStarted = false;
                this.error = null;
                this.chaptersCache = {};
                this.progress = null;
            }
        }
    },

    getters: {
        canGoBack: (state) => state.history.length > 1,
        isLoading: (state) => state.loading,
        hasError: (state) => state.error !== null,
        currentProgress: (state) => state.progress,
    }
});
 