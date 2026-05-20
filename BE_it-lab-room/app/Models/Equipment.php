<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Equipment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['room_id', 'equipment_name', 'equipment_type', 'quantity', 'status', 'note'];
    protected $casts = ['quantity' => 'integer'];

    public function room(): BelongsTo { return $this->belongsTo(Room::class); }
    public function incidentReports(): HasMany { return $this->hasMany(IncidentReport::class); }
    public function loanRequests(): HasMany { return $this->hasMany(LoanRequest::class); }
}
