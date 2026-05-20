<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RoomBookingRequest extends Model
{
    use HasFactory;

    protected $fillable = ['teacher_id', 'room_id', 'subject_id', 'booking_date', 'shift_id', 'purpose', 'approval_status', 'approved_by'];
    protected $casts = ['booking_date' => 'date'];

    public function teacher(): BelongsTo { return $this->belongsTo(Teacher::class); }
    public function room(): BelongsTo { return $this->belongsTo(Room::class); }
    public function subject(): BelongsTo { return $this->belongsTo(Subject::class); }
    public function shift(): BelongsTo { return $this->belongsTo(Shift::class); }
    public function approver(): BelongsTo { return $this->belongsTo(User::class, 'approved_by'); }
}
