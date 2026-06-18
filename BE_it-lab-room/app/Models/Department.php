<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends Model
{
    use HasFactory;

    protected $table = 'phong_ban';
    protected $fillable = [
        'ma_phong_ban',
        'ten_phong_ban',
        'trang_thai',
        'mo_ta',
    ];

    public function teachers(): HasMany { return $this->hasMany(Teacher::class, 'ma_phong_ban'); }
    public function loanRequests(): HasMany { return $this->hasMany(LoanRequest::class, 'ma_phong_ban'); }
}
