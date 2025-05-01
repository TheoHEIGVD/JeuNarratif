<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Chapter;
use Illuminate\Support\Facades\Log;

class ChapterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $chapters = Chapter::with('choices')->get();
            return response()->json($chapters);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des chapitres: ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de la récupération des chapitres'], 500);
    }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $chapter = Chapter::with('choices')->find($id);
            
            if (!$chapter) {
                Log::info('Chapitre non trouvé: ' . $id);
                return response()->json(['error' => 'Chapitre non trouvé'], 404);
            }

            return response()->json($chapter);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération du chapitre ' . $id . ': ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de la récupération du chapitre'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string',
                'content' => 'required|string',
                'chapter_number' => 'required|integer',
                'story_id' => 'required|exists:stories,id'
            ]);

            $chapter = Chapter::create($validated);
            return response()->json($chapter, 201);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la création du chapitre: ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de la création du chapitre'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $chapter = Chapter::findOrFail($id);
            $validated = $request->validate([
                'title' => 'string',
                'content' => 'string',
                'chapter_number' => 'integer',
                'story_id' => 'exists:stories,id'
            ]);

            $chapter->update($validated);
            return response()->json($chapter);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la mise à jour du chapitre ' . $id . ': ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de la mise à jour du chapitre'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $chapter = Chapter::findOrFail($id);
            $chapter->delete();
            return response()->json(null, 204);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la suppression du chapitre ' . $id . ': ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de la suppression du chapitre'], 500);
        }
    }

    /**
     * Get chapters for a specific story
     */
    public function getChaptersByStory(string $id)
    {
        try {
            $chapters = Chapter::where('story_id', $id)
                ->orderBy('chapter_number', 'asc')
                ->with('choices')
                ->get();
                
            if ($chapters->isEmpty()) {
                Log::info('Aucun chapitre trouvé pour l\'histoire: ' . $id);
                return response()->json(['error' => 'Aucun chapitre trouvé pour cette histoire'], 404);
            }

            return response()->json($chapters);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des chapitres de l\'histoire ' . $id . ': ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de la récupération des chapitres'], 500);
        }
    }
}
