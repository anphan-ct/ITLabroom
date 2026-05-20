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

    protected $fillable = ['user_id', 'teacher_code', 'department'];

    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function classes(): HasMany { return $this->hasMany(SchoolClass::class, 'teacher_id'); }
    public function assignments(): HasMany { return $this->hasMany(TeacherAssignment::class); }
    public function schedules(): HasMany { return $this->hasMany(Schedule::class); }
    public function roomBookingRequests(): HasMany { return $this->hasMany(RoomBookingRequest::class); }
}
