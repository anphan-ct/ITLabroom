<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ComputerImport extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'phieu_nhap_may';

    protected $fillable = [
        'ma_phieu_nhap',
        'ngay_nhap',
        'so_luong',
        'nha_cung_cap',
        'ghi_chu',
    ];

    protected $casts = [
        'ngay_nhap' => 'date',
        'so_luong' => 'integer',
    ];

    public function details(): HasMany { return $this->hasMany(ComputerImportDetail::class, 'ma_phieu_nhap'); }
}
