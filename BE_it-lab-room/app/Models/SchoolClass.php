<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SchoolClass extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'lop_hoc';
    protected $fillable = ['ma_lop', 'nien_khoa', 'chuyen_nganh', 'ma_giang_vien'];

    public function teacher(): BelongsTo { return $this->belongsTo(Teacher::class, 'ma_giang_vien'); }
    public function students(): HasMany { return $this->hasMany(Student::class, 'ma_lop'); }
    public function roomUsageHistories(): HasMany { return $this->hasMany(RoomUsageHistory::class, 'ma_lop'); }
}
