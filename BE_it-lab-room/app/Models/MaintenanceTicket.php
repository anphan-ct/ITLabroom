<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MaintenanceTicket extends Model
{
    use HasFactory;

    protected $fillable = ['incident_report_id', 'assigned_to', 'maintenance_type', 'start_date', 'end_date', 'solution', 'cost', 'status'];
    protected $casts = ['start_date' => 'date', 'end_date' => 'date', 'cost' => 'decimal:2'];

    public function incidentReport(): BelongsTo { return $this->belongsTo(IncidentReport::class); }
    public function assignee(): BelongsTo { return $this->belongsTo(User::class, 'assigned_to'); }
}
