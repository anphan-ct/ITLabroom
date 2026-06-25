<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseSectionStudent extends Model
{
    use HasFactory;

    protected $table = 'chi_tiet_lop_hoc_phan';

    protected $fillable = [
        'ma_lop_hoc_phan',
        'ma_sinh_vien',
        'trang_thai',
        'ghi_chu',
    ];

    public function courseSection(): BelongsTo
    {
        return $this->belongsTo(CourseSection::class, 'ma_lop_hoc_phan');
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'ma_sinh_vien');
    }
}
