<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RoomBookingRequest extends Model
{
    use HasFactory;

    protected $table = 'dat_phong_may';
    protected $fillable = [
        'ma_giang_vien',
        'ma_lop_hoc_phan',
        'ma_phong',
        'ma_mon',
        'ma_nam_hoc',
        'ma_tuan',
        'ngay_dat',
        'so_tiet_bat_dau',
        'so_tiet_ket_thuc',
        'muc_dich',
        'trang_thai_duyet',
    ];

    protected $casts = [
        'ngay_dat' => 'date',
        'so_tiet_bat_dau' => 'integer',
        'so_tiet_ket_thuc' => 'integer',
    ];

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class, 'ma_giang_vien');
    }

    public function courseSection(): BelongsTo
    {
        return $this->belongsTo(CourseSection::class, 'ma_lop_hoc_phan');
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class, 'ma_phong');
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class, 'ma_mon');
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class, 'ma_nam_hoc');
    }

    public function week(): BelongsTo
    {
        return $this->belongsTo(Week::class, 'ma_tuan');
    }

}
