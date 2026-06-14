<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ComputerImportDetail extends Model
{
    use HasFactory;

    protected $table = 'chi_tiet_phieu_nhap_may';

    protected $fillable = [
        'ma_phieu_nhap',
        'ma_may_tinh',
        'ghi_chu',
    ];

    public function import(): BelongsTo { return $this->belongsTo(ComputerImport::class, 'ma_phieu_nhap'); }
    public function computer(): BelongsTo { return $this->belongsTo(Computer::class, 'ma_may_tinh'); }
}
