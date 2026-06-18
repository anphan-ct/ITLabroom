<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'nguoi_dung';
    protected $fillable = [
        'ma_vai_tro', 'ho_ten', 'email', 'mat_khau', 'so_dien_thoai', 'gioi_tinh',
        'ngay_sinh', 'trang_thai',
    ];

    protected $hidden = ['mat_khau'];

    protected function casts(): array
    {
        return [
            'mat_khau' => 'hashed',
            'ngay_sinh' => 'date',
            'trang_thai' => 'integer',
        ];
    }

    public function getAuthPassword(): string
    {
        return $this->mat_khau;
    }

    public function role(): BelongsTo { return $this->belongsTo(Role::class, 'ma_vai_tro'); }
    public function teacher(): HasOne { return $this->hasOne(Teacher::class, 'ma_nguoi_dung'); }
    public function student(): HasOne { return $this->hasOne(Student::class, 'ma_nguoi_dung'); }
    public function incidentReports(): HasMany { return $this->hasMany(IncidentReport::class, 'ma_nguoi_bao_cao'); }
}
