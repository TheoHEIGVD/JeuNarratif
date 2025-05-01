<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Story;
use App\Models\Chapter;
use App\Models\Choice;

class ChapterSeeder extends Seeder
{
    public function run(): void
    {
        // Créer une histoire
        $story = Story::create([
            'title' => 'L\'Étudiant Face à son Destin',
            'summary' => 'Une aventure interactive sur la vie étudiante à la HEIG-VD',
            'user_id' => null
        ]);

        // Chapitre 1
        $chapter1 = Chapter::create([
            'story_id' => $story->id,
            'content' => 'Alex ouvre les yeux. Son réveil affiche 08:45. Il avait mis l\'alarme pour 07:00... Raté.',
            'chapter_number' => 1,
            'title' => 'Le réveil'
        ]);

        // Chapitre 2A
        $chapter2a = Chapter::create([
            'story_id' => $story->id,
            'content' => 'Alex court jusqu\'à l\'arrêt de bus, encore à moitié en pyjama. Le bus est là… mais il vient de fermer les portes et démarre au ralenti',
            'chapter_number' => 2,
            'title' => 'Périple transport'
        ]);

        // Chapitre 2B
        $chapter2b = Chapter::create([
            'story_id' => $story->id,
            'content' => 'Une heure passe. Alex a vu 14 vidéos de crocodile, 2 memes sur Laravel et un thread sur les IA.',
            'chapter_number' => 3,
            'title' => 'Réseaux'
        ]);

        // Chapitre 3A
        $chapter3a = Chapter::create([
            'story_id' => $story->id,
            'content' => 'Il arrive à la HEIG/VD essoufflé. Dans le hall, il croise un prof qui lui dit : "Tu es prêt pour ta présentation ?"',
            'chapter_number' => 4,
            'title' => 'L\'arrivée express'
        ]);

        // Chapitre 3B
        $chapter3b = Chapter::create([
            'story_id' => $story->id,
            'content' => 'Il monte en vitesse dans le taxi, essoufflé. Le chauffeur se retourne : "Monsieur Dupuis ? L\'ancien prof d\'algorithmique ?" Pendant le trajet, Dupuis lui fait une révision express de Laravel.',
            'chapter_number' => 5,
            'title' => 'Le taxi-scolaire'
        ]);

        // Chapitre 3C
        $chapter3c = Chapter::create([
            'story_id' => $story->id,
            'content' => '"L\'oral. Aujourd\'hui. A 12. Il est 10h31." Il saute de son lit, enfile son sweat à l\'envers, prend une banane au lieu de sa clé USB, et court.',
            'chapter_number' => 6,
            'title' => 'Panique'
        ]);

        // Chapitre 3D
        $chapter3d = Chapter::create([
            'story_id' => $story->id,
            'content' => 'Alex ouvre un document Google Docs et commence à écrire un manifeste intitulé "La pédagogie de la procrastination". Trois heures plus tard, il a un plan détaillé, un logo, et même un blog WordPress en ligne. Un inconnu sur Twitter partage son article. C\'est le buzz. Le lendemain, il est invité à une conférence TEDx pour parler de son "méta-parcours d\'échec contrôlé". Alex accepte l\'invitation au TEDx. Pris dans le tourbillon de sa gloire absurde, Alex oublie un détail : il n\'a jamais validé son module Laravel. Ni celui de WebMobUi. Ni... aucun, en fait. Les mails de rappel de la fac s\'empilent dans son dossier spam. Lorsqu\'il s\'en rend compte, il écrit à l\'administration : Il est viré du campus pour "absenteisme".',
            'chapter_number' => 7,
            'title' => 'Auteur malgré lui'
        ]);

        // Chapitre 4A
        $chapter4a = Chapter::create([
            'story_id' => $story->id,
            'content' => 'Il démarre sa présentation. Le sujet : Les API RESTful dans les jeux narratifs… sauf qu\'il parle de spaghetti.',
            'chapter_number' => 8,
            'title' => 'La présentation'
        ]);

        // Chapitre 4B
        $chapter4b = Chapter::create([
            'story_id' => $story->id,
            'content' => 'Dans les toilettes, il tombe sur un autre étudiant déguisé en banane. "Toi aussi t\'as fui ?"',
            'chapter_number' => 9,
            'title' => 'La fuite'
        ]);

        // Chapitre 5A
        $chapter5a = Chapter::create([
            'story_id' => $story->id,
            'content' => 'Alex réussit malgré tout, car à l\'improviste comme un roi',
            'chapter_number' => 10,
            'title' => 'La réussite'
        ]);

        // Chapitre 5B
        $chapter5b = Chapter::create([
            'story_id' => $story->id,
            'content' => 'Alors qu\' Alex sent qu\'il perd pied, il murmure : "Je suis désolé... je crois que je mange un truc pas frais..." Le silence est glacial. Le prof fronce les sourcils. "Bon… si tu es vraiment malade, on reporte"',
            'chapter_number' => 11,
            'title' => 'Le Dilemme'
        ]);

        // Chapitre 5C
        $chapter5c = Chapter::create([
            'story_id' => $story->id,
            'content' => 'L\'étudiant banane a une idée : organiser un faux exercice d\'évacuation incendie. Ils déclenchent l\'alarme avec un sèche-cheveux suffisant. Le bâtiment est évacué, mais la sécurité les intercepte. Alex nie tout et blâme la banane. Il est viré du campus pour "complicité dans un sabotage fruitier". Son dossier scolaire comporte désormais une annotation : "esprit créatif mais dangereux"',
            'chapter_number' => 12,
            'title' => 'Le plan banane'
        ]);

        // Créer les choix pour le chapitre 1
        Choice::create([
            'chapter_id' => $chapter1->id,
            'text' => 'Il saute du lit et commence à se préparer',
            'next_chapter_id' => $chapter2a->id
        ]);

        Choice::create([
            'chapter_id' => $chapter1->id,
            'text' => 'Il regarde son téléphone "juste 5 minutes"',
            'next_chapter_id' => $chapter2b->id
        ]);

        // Choix pour le chapitre 2A
        Choice::create([
            'chapter_id' => $chapter2a->id,
            'text' => 'Il tente de courir après le bus en mode parkour urbain',
            'next_chapter_id' => $chapter3a->id
        ]);

        Choice::create([
            'chapter_id' => $chapter2a->id,
            'text' => 'Il commande un taxi, mais c\'est un vieux prof reconverti en Uber driver',
            'next_chapter_id' => $chapter3b->id
        ]);

        // Choix pour le chapitre 2B
        Choice::create([
            'chapter_id' => $chapter2b->id,
            'text' => 'Il se rend compte qu\'il a une soutenance et il se met enfin en route',
            'next_chapter_id' => $chapter3c->id
        ]);

        Choice::create([
            'chapter_id' => $chapter2b->id,
            'text' => 'Il décide de ne pas aller en cours aujourd\'hui et d\'écrire un blog',
            'next_chapter_id' => $chapter3d->id
        ]);

        // Choix pour le chapitre 3A
        Choice::create([
            'chapter_id' => $chapter3a->id,
            'text' => 'Il improvise la présentation',
            'next_chapter_id' => $chapter4a->id
        ]);

        Choice::create([
            'chapter_id' => $chapter3a->id,
            'text' => 'il panique et s\'enfuit aux toilettes',
            'next_chapter_id' => $chapter4b->id
        ]);

        // Choix pour le chapitre 3B
        Choice::create([
            'chapter_id' => $chapter3b->id,
            'text' => 'Il arrive à temps pour passer son orale',
            'next_chapter_id' => $chapter3a->id
        ]);

        // Choix pour le chapitre 3C
        Choice::create([
            'chapter_id' => $chapter3c->id,
            'text' => 'Il tente de courir jusqu\'à l\'amphi et glisse sur un dépliant Moodle. Il finit à l\'infirmerie avec une entorse et un document PDF collé au front. Le prof vient le voir : "C\'est la première fois que Moodle blesse physiquement un étudiant." Il lui accorde une soutenance individuelle le lendemain',
            'next_chapter_id' => $chapter1->id
        ]);

        // Choix pour le chapitre 4A
        Choice::create([
            'chapter_id' => $chapter4a->id,
            'text' => 'Il justifie en disant que c\'est une métaphore et remprends sa présentation',
            'next_chapter_id' => $chapter5a->id
        ]);

        Choice::create([
            'chapter_id' => $chapter4a->id,
            'text' => 'Il fait semblant de tomber malade',
            'next_chapter_id' => $chapter5b->id
        ]);

        // Choix pour le chapitre 4B
        Choice::create([
            'chapter_id' => $chapter4b->id,
            'text' => 'Alex reçoit une notif : l\'oral va débuter, il se resaissit',
            'next_chapter_id' => $chapter4a->id
        ]);

        Choice::create([
            'chapter_id' => $chapter4b->id,
            'text' => 'Ils montent un plan pour faire annuler les cours',
            'next_chapter_id' => $chapter5c->id
        ]);

        // Choix pour le chapitre 5B
        Choice::create([
            'chapter_id' => $chapter5b->id,
            'text' => 'Alex reprend ses esprits, fait marche arrière et continue son oral',
            'next_chapter_id' => $chapter5a->id
        ]);

        Choice::create([
            'chapter_id' => $chapter5b->id,
            'text' => 'Alex maintient son mensonge et accepte de tout recommencer demain matin',
            'next_chapter_id' => $chapter1->id
        ]);
    }
} 