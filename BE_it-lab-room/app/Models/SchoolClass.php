<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SchoolClass extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'classes';
    protected $fillable = ['class_code', 'class_name', 'course_year', 'major', 'teacher_id'];

    public function teacher(): BelongsTo { return $this->belongsTo(Teacher::class); }
    public function students(): HasMany { return $this->hasMany(Student::class, 'class_id'); }
    public function assignments(): HasMany { return $this->hasMany(TeacherAssignment::class, 'class_id'); }
    public function schedules(): HasMany { return $this->hasMany(Schedule::class, 'class_id'); }
    public function loanRequests(): HasMany { return $this->hasMany(LoanRequest::class, 'class_id'); }
}
