<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Room extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['room_code', 'room_name', 'capacity', 'status', 'description'];
    protected $casts = ['capacity' => 'integer'];

    public function computers(): HasMany { return $this->hasMany(Computer::class); }
    public function equipments(): HasMany { return $this->hasMany(Equipment::class); }
    public function schedules(): HasMany { return $this->hasMany(Schedule::class); }
    public function roomBookingRequests(): HasMany { return $this->hasMany(RoomBookingRequest::class); }
    public function incidentReports(): HasMany { return $this->hasMany(IncidentReport::class); }
    public function loanRequests(): HasMany { return $this->hasMany(LoanRequest::class); }
}
