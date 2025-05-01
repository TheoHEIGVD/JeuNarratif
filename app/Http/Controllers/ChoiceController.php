<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreChoiceRequest;
use App\Models\Choice;

class ChoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($chapterId)
    {
        try {
            $choices = \App\Models\Choice::where('chapter_id', $chapterId)->get();
            return response()->json($choices);
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la récupération des choix: ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de la récupération des choix'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreChoiceRequest $request)
    {
        return Choice::create($request->validated());
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
