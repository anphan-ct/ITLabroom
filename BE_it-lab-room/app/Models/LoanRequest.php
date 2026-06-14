<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LoanRequest extends Model
{
    use HasFactory;

    protected $table = 'phieu_muon_may';
    protected $fillable = [
        'ma_phieu_muon',
        'ma_giang_vien',
        'ma_phong_ban',
        'ma_phong',
        'ngay_muon',
        'so_luong',
        'ly_do_muon',
    ];

    protected $casts = [
        'ngay_muon' => 'datetime',
        'so_luong' => 'integer',
    ];

    public function teacher(): BelongsTo { return $this->belongsTo(Teacher::class, 'ma_giang_vien'); }
    public function department(): BelongsTo { return $this->belongsTo(Department::class, 'ma_phong_ban'); }
    public function room(): BelongsTo { return $this->belongsTo(Room::class, 'ma_phong'); }
}
