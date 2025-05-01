<?php

namespace App\Http\Controllers;

use App\Models\Progress;
use App\Models\Story;
use App\Models\Chapter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ProgressController extends Controller
{
    public function index()
    {
        try {
            $user = Auth::user();
            $progress = Progress::where('user_id', $user->id)
                ->with(['story', 'chapter'])
                ->get();

            return response()->json($progress);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération de la progression: ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de la récupération de la progression'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'story_id' => 'required|exists:stories,id',
                'chapter_id' => 'required|exists:chapters,id'
            ]);

            $user = Auth::user();

            // Vérifier si une progression existe déjà
            $existingProgress = Progress::where('user_id', $user->id)
                ->where('story_id', $validated['story_id'])
                ->first();

            if ($existingProgress) {
                $existingProgress->update([
                    'chapter_id' => $validated['chapter_id']
                ]);
                $progress = $existingProgress;
            } else {
                $progress = Progress::create([
                    'user_id' => $user->id,
                    'story_id' => $validated['story_id'],
                    'chapter_id' => $validated['chapter_id']
                ]);
            }

            return response()->json($progress->load(['story', 'chapter']), 201);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la sauvegarde de la progression: ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de la sauvegarde de la progression'], 500);
        }
    }

    public function show(Progress $progress)
    {
        try {
            $this->authorize('view', $progress);
            return response()->json($progress->load(['story', 'chapter']));
        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'affichage de la progression: ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de l\'affichage de la progression'], 500);
        }
    }

    public function update(Request $request, Progress $progress)
    {
        try {
            $this->authorize('update', $progress);

            $validated = $request->validate([
                'chapter_id' => 'required|exists:chapters,id'
            ]);

            $progress->update([
                'chapter_id' => $validated['chapter_id']
            ]);

            return response()->json($progress->load(['story', 'chapter']));
        } catch (\Exception $e) {
            Log::error('Erreur lors de la mise à jour de la progression: ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de la mise à jour de la progression'], 500);
        }
    }

    public function destroy(Progress $progress)
    {
        try {
            $this->authorize('delete', $progress);
            $progress->delete();
            return response()->json(null, 204);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la suppression de la progression: ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de la suppression de la progression'], 500);
        }
    }
} 