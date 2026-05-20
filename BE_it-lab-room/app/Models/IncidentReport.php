<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class IncidentReport extends Model
{
    use HasFactory;

    protected $fillable = ['reported_by_user_id', 'room_id', 'computer_id', 'equipment_id', 'incident_type', 'title', 'description', 'severity_level', 'status'];

    public function reporter(): BelongsTo { return $this->belongsTo(User::class, 'reported_by_user_id'); }
    public function room(): BelongsTo { return $this->belongsTo(Room::class); }
    public function computer(): BelongsTo { return $this->belongsTo(Computer::class); }
    public function equipment(): BelongsTo { return $this->belongsTo(Equipment::class); }
    public function maintenanceTickets(): HasMany { return $this->hasMany(MaintenanceTicket::class); }
}
