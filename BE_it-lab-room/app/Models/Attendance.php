<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    use HasFactory;

    protected $table = 'attendance';
    protected $fillable = ['schedule_id', 'student_id', 'computer_id', 'check_in_time', 'status', 'note'];
    protected $casts = ['check_in_time' => 'datetime'];

    public function schedule(): BelongsTo { return $this->belongsTo(Schedule::class); }
    public function student(): BelongsTo { return $this->belongsTo(Student::class); }
    public function computer(): BelongsTo { return $this->belongsTo(Computer::class); }
}
