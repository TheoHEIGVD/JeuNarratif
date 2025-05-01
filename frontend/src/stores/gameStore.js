import { defineStore } from "pinia";
import { storyService } from "@/services/api";

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
    }),

    actions: {
        async startGame(storyId) {
            try {
                this.loading = true;
                this.error = null;

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
                    this.chaptersCache[chapter.id] = this.currentChapter;
                    this.history = existingProgress.choices_history || [chapter.id];
                    this.progress = existingProgress;
                } else {
                    // Commencer une nouvelle partie
                    const chapter = await storyService.getChapter(1);
                    const choices = await storyService.getChapterChoices(1);

                    this.currentChapter = {
                        ...chapter,
                        choices,
                    };
                    this.chaptersCache[chapter.id] = this.currentChapter;
                    this.history = [chapter.id];
                    
                    // Sauvegarder la nouvelle progression
                    this.progress = await storyService.saveProgress(storyId, chapter.id);
                }

                this.gameStarted = true;
            } catch (error) {
                this.error = "Impossible de démarrer le jeu. Veuillez réessayer.";
                console.error("Erreur lors du démarrage du jeu:", error);
            } finally {
                this.loading = false;
            }
        },

        async setChapter(chapterId) {
            try {
                this.loading = true;
                this.error = null;

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
                this.history.push(chapterId);

                // Mettre à jour la progression
                if (this.progress) {
                    this.progress = await storyService.updateProgress(
                        this.progress.id,
                        chapterId,
                        this.history[this.history.length - 2] // Le choix précédent
                    );
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
            }
        },

        resetGame() {
            this.currentChapter = null;
            this.currentStory = null;
            this.history = [];
            this.gameStarted = false;
            this.error = null;
            this.chaptersCache = {};
            this.progress = null;
        },
    },

    getters: {
        canGoBack: (state) => state.history.length > 1,
        isLoading: (state) => state.loading,
        hasError: (state) => state.error !== null,
        currentProgress: (state) => state.progress,

        chapters: () => ({
            chapitre1: {
                id: "chapitre1",
                title: "Chapitre 1 — Le réveil",
                content:
                    "Alex ouvre les yeux. Son réveil affiche 08:45. Il avait mis l'alarme pour 07:00... Raté.",
                choices: [
                    {
                        id: "choice1",
                        text: "Il saute du lit et commence à se préparer",
                        nextChapter: "chapitre2A",
                    },
                    {
                        id: "choice2",
                        text: 'Il regarde son téléphone "juste 5 minutes"',
                        nextChapter: "chapitre2B",
                    },
                ],
            },
            chapitre2A: {
                id: "chapitre2A",
                title: "Chapitre 2A — Périple transport",
                content:
                    "Alex court jusqu'à l'arrêt de bus, encore à moitié en pyjama. Le bus est là… mais il vient de fermer les portes et démarre au ralenti",
                choices: [
                    {
                        id: "choice2A_1",
                        text: "Il tente de courir après le bus en mode parkour urbain",
                        nextChapter: "chapitre3A",
                    },
                    {
                        id: "choice2A_2",
                        text: "Il commande un taxi, mais c'est un vieux prof reconverti en Uber driver",
                        nextChapter: "chapitre3B",
                    },
                ],
            },
            chapitre2B: {
                id: "chapitre2B",
                title: "Chapitre 2B — Réseaux",
                content:
                    "Une heure passe. Alex a vu 14 vidéos de crocodile, 2 memes sur Laravel et un thread sur les IA.",
                choices: [
                    {
                        id: "choice2B_1",
                        text: "Il se rend compte qu'il a une soutenance et il se met enfin en route",
                        nextChapter: "chapitre3C",
                    },
                    {
                        id: "choice2B_2",
                        text: "Il décide de ne pas aller en cours aujourd'hui et d'écrire un blog",
                        nextChapter: "chapitre3D",
                    },
                ],
            },
            chapitre3A: {
                id: "chapitre3A",
                title: "Chapitre 3A — L'arrivée express",
                content:
                    'Il arrive à la HEIG/VD essoufflé. Dans le hall, il croise un prof qui lui dit : "Tu es prêt pour ta présentation ?"',
                choices: [
                    {
                        id: "choice3A_1",
                        text: "Il improvise la présentation",
                        nextChapter: "chapitre4A",
                    },
                    {
                        id: "choice3A_2",
                        text: "Il panique et s'enfuit aux toilettes",
                        nextChapter: "chapitre4B",
                    },
                ],
            },
            chapitre3B: {
                id: "chapitre3B",
                title: "Chapitre 3B — Le taxi-scolaire",
                content:
                    "Il monte en vitesse dans le taxi, essoufflé. Le chauffeur se retourne : \"Monsieur Dupuis ? L'ancien prof d'algorithmique ?\" Pendant le trajet, Dupuis lui fait une révision express de Laravel.",
                choices: [
                    {
                        id: "choice3B_1",
                        text: "Il arrive à temps pour passer son orale",
                        nextChapter: "chapitre3A",
                    },
                ],
            },
            chapitre3C: {
                id: "chapitre3C",
                title: "Chapitre 3C — Panique",
                content:
                    "\"L'oral. Aujourd'hui. A 12. Il est 10h31.\" Il saute de son lit, enfile son sweat à l'envers, prend une banane au lieu de sa clé USB, et court.",
                choices: [
                    {
                        id: "choice3C_1",
                        text: "Il tente de courir jusqu'à l'amphi et glisse sur un dépliant Moodle. Il finit à l'infirmerie avec une entorse et un document PDF collé au front. Le prof vient le voir : \"C'est la première fois que Moodle blesse physiquement un étudiant.\" Il lui accorde une soutenance individuelle le lendemain",
                        nextChapter: "chapitre1",
                    },
                ],
            },
            chapitre3D: {
                id: "chapitre3D",
                title: "Chapitre 3D — Auteur malgré lui",
                content:
                    "Alex ouvre un document Google Docs et commence à écrire un manifeste intitulé \"La pédagogie de la procrastination\". Trois heures plus tard, il a un plan détaillé, un logo, et même un blog WordPress en ligne. Un inconnu sur Twitter partage son article. C'est le buzz. Le lendemain, il est invité à une conférence TEDx pour parler de son \"méta-parcours d'échec contrôlé\". Alex accepte l'invitation au TEDx. Pris dans le tourbillon de sa gloire absurde, Alex oublie un détail : il n'a jamais validé son module Laravel. Ni celui de WebMobUi. Ni... aucun, en fait. Les mails de rappel de la fac s'empilent dans son dossier spam. Lorsqu'il s'en rend compte, il écrit à l'administration : Il est viré du campus pour \"absentéisme\".",
                choices: [],
            },
            chapitre4A: {
                id: "chapitre4A",
                title: "Chapitre 4A — La présentation",
                content:"Il démarre sa présentation. Le sujet : Les API RESTful dans les jeux narratifs sauf qu'il parle de spaghetti",
                choices: [
                    {
                        id: "choice4A_1",
                        text: "Il justifie en disant que c'est une métaphore et remprends sa présentation",
                        nextChapter: "chapitre5A",
                    },
                    {
                        id: "choice4A_2",
                        text: "Il fait semblant de tomber malade",
                        nextChapter: "chapitre5B",
                    },
                ],
            },
            chapitre4B: {
                id: "chapitre4B",
                title: "Chapitre 4B — La fuite",
                content:
                    'Dans les toilettes, il tombe sur un autre étudiant déguisé en banane. "Toi aussi t\'as fui ?"',
                choices: [
                    {
                        id: "choice4B_1",
                        text: "Alex reçoit une notif : l'oral va débuter, il se resaissit",
                        nextChapter: "chapitre4A",
                    },
                    {
                        id: "choice4B_2",
                        text: "Ils montent un plan pour faire annuler les cours",
                        nextChapter: "chapitre5C",
                    },
                ],
            },
            chapitre5A: {
                id: "chapitre5A",
                title: "Chapitre 5A — La réussite",
                content:
                    "Alex réussit malgré tout, car à l'improviste comme un roi",
                choices: [],
            },
            chapitre5B: {
                id: "chapitre5B",
                title: "Chapitre 5B — Le Dilemme",
                content:
                    'Alors qu\' Alex sent qu\'il perd pied, il murmure : "Je suis désolé... je crois que je mange un truc pas frais..." Le silence est glacial. Le prof fronce les sourcils. "Bon… si tu es vraiment malade, on reporte"',
                choices: [
                    {
                        id: "choice5B_1",
                        text: "Alex reprend ses esprits, fait marche arrière et continue son oral",
                        nextChapter: "chapitre5A",
                    },
                    {
                        id: "choice5B_2",
                        text: "Alex maintient son mensonge et accepte de tout recommencer demain matin",
                        nextChapter: "chapitre1",
                    },
                ],
            },
            chapitre5C: {
                id: "chapitre5C",
                title: "Chapitre 5C — Le plan banane",
                content:
                    'L\'étudiant banane a une idée : organiser un faux exercice d\'évacuation incendie. Ils déclenchent l\'alarme avec un sèche-cheveux suffisant. Le bâtiment est évacué, mais la sécurité les intercepte. Alex nie tout et blâme la banane. Il est viré du campus pour "complicité dans un sabotage fruitier". Son dossier scolaire comporte désormais une annotation : "esprit créatif mais dangereux"',
                choices: [],
            },
        }),
    },
});
 