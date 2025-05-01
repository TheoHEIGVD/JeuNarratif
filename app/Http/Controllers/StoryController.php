<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreStoryRequest;
use App\Models\Story;

class StoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $stories = Story::with('chapters')->get();
        return response()->json($stories);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStoryRequest $request)
    {
        $story = Story::create($request->validated());
        return response()->json($story, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $story = Story::with('chapters')->findOrFail($id);
        return response()->json($story);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $story = Story::findOrFail($id);
        $story->update($request->all());
        return response()->json($story);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $story = Story::findOrFail($id);
        $story->delete();
        return response()->json(null, 204);
    }
}
