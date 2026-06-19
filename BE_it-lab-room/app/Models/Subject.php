<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Subject extends Model
{
    use HasFactory;

    protected $table = 'mon_hoc';
    protected $fillable = ['ma_mon_hoc', 'ten_mon', 'loai_mon', 'so_tin_chi', 'mo_ta'];
    protected $casts = [
        'so_tin_chi' => 'integer',
    ];

    public function assignments(): HasManyThrough
    {
        return $this->hasManyThrough(
            TeacherAssignment::class,
            CourseSection::class,
            'ma_mon',
            'ma_lop_hoc_phan',
            'id',
            'id'
        );
    }
    public function roomBookingRequests(): HasMany { return $this->hasMany(RoomBookingRequest::class, 'ma_mon'); }
}
