<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Teacher extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'giang_vien';
    protected $fillable = ['ma_nguoi_dung', 'ma_giang_vien'];

    public function user(): BelongsTo { return $this->belongsTo(User::class, 'ma_nguoi_dung'); }
    public function classes(): HasMany { return $this->hasMany(SchoolClass::class, 'ma_giang_vien'); }
    public function assignments(): HasMany { return $this->hasMany(TeacherAssignment::class, 'ma_giang_vien'); }
    public function roomUsageHistories(): HasMany { return $this->hasMany(RoomUsageHistory::class, 'ma_giang_vien'); }
    public function roomBookingRequests(): HasMany { return $this->hasMany(RoomBookingRequest::class, 'ma_giang_vien'); }
    public function loanRequests(): HasMany { return $this->hasMany(LoanRequest::class, 'ma_giang_vien'); }
}
