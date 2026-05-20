<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subject extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['subject_code', 'subject_name', 'credits', 'description'];
    protected $casts = ['credits' => 'integer'];

    public function assignments(): HasMany { return $this->hasMany(TeacherAssignment::class); }
    public function schedules(): HasMany { return $this->hasMany(Schedule::class); }
    public function roomBookingRequests(): HasMany { return $this->hasMany(RoomBookingRequest::class); }
}
