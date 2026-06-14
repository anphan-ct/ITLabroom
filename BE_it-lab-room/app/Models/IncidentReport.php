<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class IncidentReport extends Model
{
    use HasFactory;

    protected $table = 'bao_cao_su_co';
    protected $fillable = ['ma_nguoi_bao_cao', 'ma_may_tinh', 'ma_thiet_bi', 'loai_su_co', 'tieu_de', 'mo_ta', 'muc_do', 'trang_thai'];

    public function reporter(): BelongsTo { return $this->belongsTo(User::class, 'ma_nguoi_bao_cao'); }
    public function computer(): BelongsTo { return $this->belongsTo(Computer::class, 'ma_may_tinh'); }
    public function equipment(): BelongsTo { return $this->belongsTo(Equipment::class, 'ma_thiet_bi'); }
    public function maintenanceTickets(): HasMany { return $this->hasMany(MaintenanceTicket::class, 'ma_bao_cao_su_co'); }
}
