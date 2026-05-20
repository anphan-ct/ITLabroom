<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Chuẩn hóa ca học thành 2 buổi chính để lịch phòng máy không bị chia nhỏ theo từng tiết.
        DB::transaction(function (): void {
            DB::table('shifts')->where('id', 1)->update([
                'shift_name' => 'Ca sáng',
                'start_time' => '06:30:00',
                'end_time' => '11:25:00',
                'updated_at' => now(),
            ]);

            DB::table('shifts')->where('id', 2)->update([
                'shift_name' => 'Ca chiều',
                'start_time' => '12:30:00',
                'end_time' => '17:30:00',
                'updated_at' => now(),
            ]);

            DB::table('schedules')->whereIn('shift_id', [3, 4, 5, 6])->update(['shift_id' => 1]);
            DB::table('room_booking_requests')->whereIn('shift_id', [3, 4, 5, 6])->update(['shift_id' => 1]);
            DB::table('shifts')->whereIn('id', [3, 4, 5, 6])->delete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::transaction(function (): void {
            DB::table('shifts')->where('id', 1)->update([
                'shift_name' => 'Ca 1',
                'start_time' => '06:30:00',
                'end_time' => '07:15:00',
                'updated_at' => now(),
            ]);

            DB::table('shifts')->where('id', 2)->update([
                'shift_name' => 'Ca 2',
                'start_time' => '07:20:00',
                'end_time' => '08:05:00',
                'updated_at' => now(),
            ]);

            foreach ([
                ['id' => 3, 'shift_name' => 'Ca 3', 'start_time' => '08:10:00', 'end_time' => '08:55:00'],
                ['id' => 4, 'shift_name' => 'Ca 4', 'start_time' => '09:00:00', 'end_time' => '09:45:00'],
                ['id' => 5, 'shift_name' => 'Ca 5', 'start_time' => '09:50:00', 'end_time' => '10:35:00'],
                ['id' => 6, 'shift_name' => 'Ca 6', 'start_time' => '10:40:00', 'end_time' => '11:25:00'],
            ] as $shift) {
                DB::table('shifts')->updateOrInsert(
                    ['id' => $shift['id']],
                    [
                        'shift_name' => $shift['shift_name'],
                        'start_time' => $shift['start_time'],
                        'end_time' => $shift['end_time'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }
        });
    }
};
