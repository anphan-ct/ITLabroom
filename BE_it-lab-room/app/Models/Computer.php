<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Computer extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['room_id', 'config_id', 'computer_code', 'computer_name', 'ip_address', 'mac_address', 'status', 'note'];

    public function room(): BelongsTo { return $this->belongsTo(Room::class); }
    public function config(): BelongsTo { return $this->belongsTo(ComputerConfig::class, 'config_id'); }
    public function incidentReports(): HasMany { return $this->hasMany(IncidentReport::class); }
    public function loanRequests(): HasMany { return $this->hasMany(LoanRequest::class); }
    public function statusLogs(): HasMany { return $this->hasMany(ComputerStatusLog::class); }
}
