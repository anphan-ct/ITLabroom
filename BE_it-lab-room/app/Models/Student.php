<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'sinh_vien';
    protected $fillable = ['ma_nguoi_dung', 'ma_lop', 'ma_sinh_vien', 'nien_khoa'];

    public function user(): BelongsTo { return $this->belongsTo(User::class, 'ma_nguoi_dung'); }
    public function class(): BelongsTo { return $this->belongsTo(SchoolClass::class, 'ma_lop'); }
    public function attendanceRecords(): HasMany { return $this->hasMany(Attendance::class, 'ma_sinh_vien'); }
}
