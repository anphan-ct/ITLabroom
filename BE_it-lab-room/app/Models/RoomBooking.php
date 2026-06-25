<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RoomBooking extends Model
{
    use HasFactory;

    protected $table = 'dat_phong_may';

    protected $fillable = [
        'ma_giang_vien',
        'ma_phong',
        'ngay_dat',
        'tiet_bat_dau',
        'tiet_ket_thuc',
        'muc_dich',
        'trang_thai_duyet',
    ];

    protected $casts = [
        'ngay_dat' => 'date',
        'tiet_bat_dau' => 'integer',
        'tiet_ket_thuc' => 'integer',
    ];

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class, 'ma_giang_vien');
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class, 'ma_phong');
    }
}
