<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Story extends Model
{
    protected $fillable = ['title', 'summary', 'user_id'];

    public function chapters()
    {
        return $this->hasMany(Chapter::class);
    }

    public function getTotalChaptersAttribute()
    {
        return $this->chapters()->count();
    }
}



