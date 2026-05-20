<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['user_id', 'class_id', 'student_code', 'role', 'course_year'];

    protected $casts = [
        'role' => 'integer',
    ];

    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function class(): BelongsTo { return $this->belongsTo(SchoolClass::class, 'class_id'); }
    public function attendanceRecords(): HasMany { return $this->hasMany(Attendance::class); }
    public function loanRequests(): HasMany { return $this->hasMany(LoanRequest::class); }
}
