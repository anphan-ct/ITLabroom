<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Equipment extends Model
{
    use HasFactory;

    protected $table = 'thiet_bi';
    protected $fillable = ['ma_phong', 'ten_thiet_bi', 'so_luong', 'don_vi', 'trang_thai', 'ghi_chu'];
    protected $casts = ['so_luong' => 'integer'];

    public function room(): BelongsTo { return $this->belongsTo(Room::class, 'ma_phong'); }
    public function incidentReports(): HasMany { return $this->hasMany(IncidentReport::class, 'ma_thiet_bi'); }
}
