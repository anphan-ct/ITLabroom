<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TeacherComputerRecord extends Model
{
    use HasFactory;

    protected $table = 'ghi_nhan_may_giao_vien';

    protected $fillable = [
        'ma_lich_su_dung',
        'ma_may_tinh_giao_vien',
        'ghi_chu_buoi_hoc',
    ];

    public function computerLabSchedule(): BelongsTo { return $this->belongsTo(ComputerLabSchedule::class, 'ma_lich_su_dung'); }
    public function computer(): BelongsTo { return $this->belongsTo(Computer::class, 'ma_may_tinh_giao_vien'); }
}
