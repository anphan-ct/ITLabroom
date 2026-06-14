<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    use HasFactory;

    protected $table = 'vai_tro';
    protected $fillable = ['ten_vai_tro', 'mo_ta'];

    public function users(): HasMany { return $this->hasMany(User::class, 'ma_vai_tro'); }
}
