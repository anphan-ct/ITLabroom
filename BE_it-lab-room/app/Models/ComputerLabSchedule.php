<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ComputerLabSchedule extends Model
{
    use HasFactory;

    protected $table = 'lich_su_dung_phong_may';

    protected $fillable = [
        'ma_phong',
        'ma_lop',
        'ma_lop_hoc_phan',
        'ma_giang_vien',
        'ma_tuan',
        'ngay_hoc_cu_the',
        'thu_trong_tuan',
        'so_tiet_bat_dau',
        'so_tiet_ket_thuc',
        'loai_lich',
        'ma_dat_phong_may',
        'trang_thai',
        'ghi_chu',
    ];

    protected $casts = [
        'ngay_hoc_cu_the' => 'date',
        'so_tiet_bat_dau' => 'integer',
        'so_tiet_ket_thuc' => 'integer',
    ];

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class, 'ma_phong');
    }

    public function class(): BelongsTo
    {
        return $this->belongsTo(SchoolClass::class, 'ma_lop');
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class, 'ma_giang_vien');
    }

    public function courseSection(): BelongsTo
    {
        return $this->belongsTo(CourseSection::class, 'ma_lop_hoc_phan');
    }

    public function week(): BelongsTo
    {
        return $this->belongsTo(Week::class, 'ma_tuan');
    }

    public function roomBookingRequest(): BelongsTo
    {
        return $this->belongsTo(RoomBooking::class, 'ma_dat_phong_may');
    }

    public function attendanceRecords(): HasMany
    {
        return $this->hasMany(Attendance::class, 'ma_lich_su_dung');
    }

    public function teacherComputerRecords(): HasMany
    {
        return $this->hasMany(TeacherComputerRecord::class, 'ma_lich_su_dung');
    }
}
