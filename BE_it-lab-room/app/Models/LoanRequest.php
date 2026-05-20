<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class LoanRequest extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'request_code',
        'student_id',
        'class_id',
        'room_id',
        'computer_id',
        'equipment_id',
        'quantity',
        'borrowed_at',
        'expected_return_at',
        'returned_at',
        'purpose',
        'note',
        'status',
        'approved_by',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'borrowed_at' => 'datetime',
        'expected_return_at' => 'datetime',
        'returned_at' => 'datetime',
    ];

    public function student(): BelongsTo { return $this->belongsTo(Student::class); }
    public function class(): BelongsTo { return $this->belongsTo(SchoolClass::class, 'class_id'); }
    public function room(): BelongsTo { return $this->belongsTo(Room::class); }
    public function computer(): BelongsTo { return $this->belongsTo(Computer::class); }
    public function equipment(): BelongsTo { return $this->belongsTo(Equipment::class); }
    public function approver(): BelongsTo { return $this->belongsTo(User::class, 'approved_by'); }
}
