<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Shift extends Model
{
    use HasFactory;

    protected $fillable = ['shift_name', 'start_time', 'end_time'];

    protected $casts = [
        'start_time' => 'datetime:H:i:s',
        'end_time' => 'datetime:H:i:s',
    ];

    public function schedules(): HasMany { return $this->hasMany(Schedule::class); }
    public function roomBookingRequests(): HasMany { return $this->hasMany(RoomBookingRequest::class); }
}
