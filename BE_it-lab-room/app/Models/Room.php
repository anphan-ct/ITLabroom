<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Room extends Model
{
    use HasFactory;

    protected $table = 'phong_may';
    protected $fillable = ['ma_phong', 'ten_phong', 'suc_chua', 'trang_thai', 'mo_ta'];
    protected $casts = ['suc_chua' => 'integer'];

    public function computers(): HasMany { return $this->hasMany(Computer::class, 'ma_phong'); }
    public function equipments(): HasMany { return $this->hasMany(Equipment::class, 'ma_phong'); }
    public function roomUsageHistories(): HasMany { return $this->hasMany(RoomUsageHistory::class, 'ma_phong'); }
    public function roomBookingRequests(): HasMany { return $this->hasMany(RoomBookingRequest::class, 'ma_phong'); }
}
