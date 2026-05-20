<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'role_id', 'full_name', 'email', 'password', 'phone', 'gender',
        'date_of_birth', 'address', 'status',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'date_of_birth' => 'date',
            'status' => 'integer',
        ];
    }

    public function role(): BelongsTo { return $this->belongsTo(Role::class); }
    public function teacher(): HasOne { return $this->hasOne(Teacher::class); }
    public function student(): HasOne { return $this->hasOne(Student::class); }
    public function approvedRoomBookings(): HasMany { return $this->hasMany(RoomBookingRequest::class, 'approved_by'); }
    public function approvedLoanRequests(): HasMany { return $this->hasMany(LoanRequest::class, 'approved_by'); }
    public function incidentReports(): HasMany { return $this->hasMany(IncidentReport::class, 'reported_by_user_id'); }
    public function assignedMaintenanceTickets(): HasMany { return $this->hasMany(MaintenanceTicket::class, 'assigned_to'); }
    public function computerStatusLogs(): HasMany { return $this->hasMany(ComputerStatusLog::class, 'updated_by_user_id'); }
}
