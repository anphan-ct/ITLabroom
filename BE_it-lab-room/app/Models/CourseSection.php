<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CourseSection extends Model
{
    use HasFactory;

    protected $table = 'lop_hoc_phan';

    protected $fillable = [
        'ma_lop_hoc_phan',
        'ma_mon',
        'ma_nam_hoc',
        'ma_phong',
        'si_so_toi_da',
        'trang_thai',
        'ghi_chu',
    ];

    protected $casts = [
        'si_so_toi_da' => 'integer',
    ];

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class, 'ma_mon');
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class, 'ma_nam_hoc');
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class, 'ma_phong');
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(TeacherAssignment::class, 'ma_lop_hoc_phan');
    }

    public function computerLabSchedules(): HasMany
    {
        return $this->hasMany(ComputerLabSchedule::class, 'ma_lop_hoc_phan');
    }

    public function studentDetails(): HasMany
    {
        return $this->hasMany(CourseSectionStudent::class, 'ma_lop_hoc_phan');
    }
}
