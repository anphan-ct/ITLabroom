<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Teacher extends Model
{
    use HasFactory;

    protected $table = 'giang_vien';
    protected $fillable = ['ma_nguoi_dung', 'ma_giang_vien', 'ma_phong_ban'];

    public function user(): BelongsTo { return $this->belongsTo(User::class, 'ma_nguoi_dung'); }
    public function department(): BelongsTo { return $this->belongsTo(Department::class, 'ma_phong_ban'); }
    public function classes(): HasMany { return $this->hasMany(SchoolClass::class, 'ma_giang_vien'); }
    public function assignments(): HasMany { return $this->hasMany(TeacherAssignment::class, 'ma_giang_vien'); }
    public function computerLabSchedules(): HasMany { return $this->hasMany(ComputerLabSchedule::class, 'ma_giang_vien'); }
    public function roomBookingRequests(): HasMany { return $this->hasMany(RoomBooking::class, 'ma_giang_vien'); }
    public function loanRequests(): HasMany { return $this->hasMany(LoanRequest::class, 'ma_giang_vien'); }
}
