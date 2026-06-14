<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Department extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'phong_ban';
    protected $fillable = [
        'ma_phong_ban',
        'ten_phong_ban',
        'trang_thai',
        'mo_ta',
    ];

    public function loanRequests(): HasMany { return $this->hasMany(LoanRequest::class, 'ma_phong_ban'); }
}
