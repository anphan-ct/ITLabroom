<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MaintenanceTicket extends Model
{
    use HasFactory;

    protected $table = 'phieu_bao_tri';
    protected $fillable = ['ma_bao_cao_su_co', 'loai_bao_tri', 'ngay_bat_dau', 'ngay_ket_thuc', 'cach_xu_ly', 'chi_phi', 'trang_thai'];
    protected $casts = ['ngay_bat_dau' => 'date', 'ngay_ket_thuc' => 'date', 'chi_phi' => 'decimal:2'];

    public function incidentReport(): BelongsTo { return $this->belongsTo(IncidentReport::class, 'ma_bao_cao_su_co'); }
}
