<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Schedule extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['class_id', 'subject_id', 'semester_id', 'teacher_id', 'room_id', 'shift_id', 'study_date', 'week_number', 'lesson_start', 'lesson_end', 'status', 'note'];
    protected $casts = ['study_date' => 'date', 'week_number' => 'integer', 'lesson_start' => 'integer', 'lesson_end' => 'integer'];

    public function class(): BelongsTo { return $this->belongsTo(SchoolClass::class, 'class_id'); }
    public function subject(): BelongsTo { return $this->belongsTo(Subject::class); }
    public function semester(): BelongsTo { return $this->belongsTo(Semester::class); }
    public function teacher(): BelongsTo { return $this->belongsTo(Teacher::class); }
    public function room(): BelongsTo { return $this->belongsTo(Room::class); }
    public function shift(): BelongsTo { return $this->belongsTo(Shift::class); }
    public function attendanceRecords(): HasMany { return $this->hasMany(Attendance::class); }
}
