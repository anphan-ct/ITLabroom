<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ComputerConfig extends Model
{
    use HasFactory;

    protected $fillable = ['cpu', 'ram', 'storage', 'gpu', 'monitor', 'os', 'note'];

    public function computers(): HasMany { return $this->hasMany(Computer::class, 'config_id'); }
}
