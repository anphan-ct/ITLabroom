<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Week extends Model
{
    use HasFactory;

    protected $table = 'tuan';

    protected $fillable = [
        'ma_nam_hoc',
        'so_tuan',
        'ngay_bat_dau',
        'ngay_ket_thuc',
    ];

    protected $casts = [
        'so_tuan' => 'integer',
        'ngay_bat_dau' => 'date',
        'ngay_ket_thuc' => 'date',
    ];

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class, 'ma_nam_hoc');
    }

    public function roomUsageHistories(): HasMany
    {
        return $this->hasMany(RoomUsageHistory::class, 'ma_tuan');
    }

    public function roomBookingRequests(): HasMany
    {
        return $this->hasMany(RoomBookingRequest::class, 'ma_tuan');
    }
}
