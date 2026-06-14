<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TeacherAssignment extends Model
{
    use HasFactory;

    protected $table = 'phan_cong_giang_vien';
    protected $fillable = [
        'ma_giang_vien',
        'ma_lop_hoc_phan',
        'trang_thai',
        'ghi_chu',
    ];

    public function teacher(): BelongsTo { return $this->belongsTo(Teacher::class, 'ma_giang_vien'); }
    public function courseSection(): BelongsTo { return $this->belongsTo(CourseSection::class, 'ma_lop_hoc_phan'); }
}
