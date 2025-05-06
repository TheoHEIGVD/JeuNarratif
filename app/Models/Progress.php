<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Progress extends Model
{
    protected $fillable = [
        'user_id',
        'story_id',
        'chapter_id',
        'choices_history'
    ];

    protected $casts = [
        'choices_history' => 'array'
    ];

    // Lien avec l'utilisateur
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Lien avec l'histoire
    public function story()
    {
        return $this->belongsTo(Story::class);
    }

    // Lien avec le chapitre
    public function chapter()
    {
        return $this->belongsTo(Chapter::class);
    }

    public function addChoiceToHistory($choiceId)
    {
        $history = $this->choices_history ?? [];
        $history[] = $choiceId;
        $this->choices_history = $history;
        $this->save();
    }

    public function getLastChoice()
    {
        $history = $this->choices_history ?? [];
        return end($history);
    }
} 