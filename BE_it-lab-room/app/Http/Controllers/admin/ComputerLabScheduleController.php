<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ComputerLabScheduleRequest;
use App\Http\Resources\ComputerLabScheduleResource;
use App\Http\Resources\RoomUsageFormOptionsResource;
use App\Models\ComputerLabSchedule;
use App\Models\CourseSection;
use App\Models\Room;
use App\Models\SchoolClass;
use App\Models\Teacher;
use App\Models\Week;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;

class ComputerLabScheduleController extends Controller
{
    public function index(ComputerLabScheduleRequest $request)
    {
        try {
            $data = $request->validated();
            $keyword = $data['keyword'] ?? null;

            $schedules = ComputerLabSchedule::query()
                ->select([
                    'id',
                    'ma_phong',
                    'ma_lop',
                    'ma_lop_hoc_phan',
                    'ma_giang_vien',
                    'ma_tuan',
                    'ngay_hoc_cu_the',
                    'thu_trong_tuan',
                    'so_tiet_bat_dau',
                    'so_tiet_ket_thuc',
                    'loai_lich',
                    'ma_dat_phong_may',
                    'trang_thai',
                    'ghi_chu',
                ])
                ->with($this->scheduleRelations())
                ->when(
                    $data['room_id'] ?? null,
                    fn ($query, $roomId) =>
                        $query->where('ma_phong', $roomId)
                )
                ->when(
                    $data['week_id'] ?? null,
                    fn ($query, $weekId) =>
                        $query->where('ma_tuan', $weekId)
                )
                ->when($keyword, function ($query) use ($keyword) {
                    $this->applySearch($query, $keyword);
                })
                ->orderByDesc('ngay_hoc_cu_the')
                ->orderBy('so_tiet_bat_dau')
                ->paginate($data['per_page'] ?? 20);

            return response()->json([
                'status' => true,
                'message' => 'Lấy danh sách lịch phòng máy thành công',
                'error_code' => 200,
                'data' => [
                    'items' => ComputerLabScheduleResource::collection(
                        $schedules
                    ),
                    'pagination' => [
                        'current_page' => $schedules->currentPage(),
                        'per_page' => $schedules->perPage(),
                        'total' => $schedules->total(),
                        'last_page' => $schedules->lastPage(),
                    ],
                ],
            ], 200);
        } catch (Throwable $e) {
            return $this->serverErrorResponse();
        }
    }

    public function options(Request $request)
    {
        try {
            $request->validate([]);

            $options = [
                'rooms' => Room::query()
                    ->select(['id', 'ma_phong', 'ten_phong'])
                    ->orderBy('ma_phong')
                    ->get(),

                'classes' => SchoolClass::query()
                    ->select(['id', 'ma_lop'])
                    ->orderBy('ma_lop')
                    ->get(),

                'courseSections' => CourseSection::query()
                    ->select(['id', 'ma_lop_hoc_phan', 'ma_mon'])
                    ->with('subject:id,ten_mon')
                    ->orderBy('ma_lop_hoc_phan')
                    ->get(),

                'teachers' => Teacher::query()
                    ->select([
                        'id',
                        'ma_nguoi_dung',
                        'ma_giang_vien',
                    ])
                    ->with('user:id,ho_ten')
                    ->orderBy('ma_giang_vien')
                    ->get(),

                'weeks' => Week::query()
                    ->select([
                        'id',
                        'ma_nam_hoc',
                        'so_tuan',
                        'ngay_bat_dau',
                        'ngay_ket_thuc',
                    ])
                    ->with('academicYear:id,ten_nam_hoc')
                    ->orderByDesc('ngay_bat_dau')
                    ->get(),
            ];

            return response()->json([
                'status' => true,
                'message' => 'Lấy dữ liệu tạo lịch phòng máy thành công',
                'error_code' => 200,
                'data' => new RoomUsageFormOptionsResource($options),
            ], 200);
        } catch (Throwable $e) {
            return $this->serverErrorResponse();
        }
    }

    public function store(ComputerLabScheduleRequest $request)
    {
        try {
            $data = $request->validated();

            $invalidResponse = $this->validateWeekAndDay($data);

            if ($invalidResponse) {
                return $invalidResponse;
            }

            $result = DB::transaction(function () use ($data) {
                $this->lockScheduleResources($data);

                $conflict = $this->findConflict($data);

                if ($conflict) {
                    return $conflict;
                }

                return ComputerLabSchedule::create(
                    $this->scheduleData($data)
                );
            });

            if (is_string($result)) {
                return $this->conflictResponse($result);
            }

            $this->loadScheduleRelations($result);

            return response()->json([
                'status' => true,
                'message' => 'Tạo lịch phòng máy thành công',
                'error_code' => 201,
                'data' => new ComputerLabScheduleResource($result),
            ], 201);
        } catch (Throwable $e) {
            return $this->serverErrorResponse();
        }
    }

    public function show(ComputerLabScheduleRequest $request,ComputerLabSchedule $computerLabSchedule) {
        try {
            $request->validate([]);

            $this->loadScheduleRelations($computerLabSchedule);

            return response()->json([
                'status' => true,
                'message' => 'Lấy chi tiết lịch phòng máy thành công',
                'error_code' => 200,
                'data' => new ComputerLabScheduleResource(
                    $computerLabSchedule
                ),
            ], 200);
        } catch (Throwable $e) {
            return $this->serverErrorResponse();
        }
    }

    public function update(ComputerLabScheduleRequest $request,ComputerLabSchedule $computerLabSchedule) {
        try {
            $data = $request->validated();

            $invalidResponse = $this->validateWeekAndDay($data);

            if ($invalidResponse) {
                return $invalidResponse;
            }

            $result = DB::transaction(
                function () use ($data, $computerLabSchedule) {
                    $this->lockScheduleResources($data);

                    $conflict = $this->findConflict(
                        $data,
                        $computerLabSchedule->id
                    );

                    if ($conflict) {
                        return $conflict;
                    }

                    $computerLabSchedule->update(
                        $this->scheduleData($data)
                    );

                    return $computerLabSchedule;
                }
            );

            if (is_string($result)) {
                return $this->conflictResponse($result);
            }

            $result->refresh();
            $this->loadScheduleRelations($result);

            return response()->json([
                'status' => true,
                'message' => 'Cập nhật lịch phòng máy thành công',
                'error_code' => 200,
                'data' => new ComputerLabScheduleResource($result),
            ], 200);
        } catch (Throwable $e) {
            return $this->serverErrorResponse();
        }
    }

    public function destroy(Request $request,ComputerLabSchedule $computerLabSchedule) {
        try {
            $request->validate([]);

            $deleted = DB::transaction(
                function () use ($computerLabSchedule) {
                    // Khóa lịch để không phát sinh dữ liệu trong lúc xóa.
                    $lockedSchedule = ComputerLabSchedule::query()
                        ->whereKey($computerLabSchedule->id)
                        ->lockForUpdate()
                        ->firstOrFail();

                    $lockedSchedule->loadCount([
                        'attendanceRecords',
                        'teacherComputerRecords',
                    ]);

                    if (
                        $lockedSchedule->attendance_records_count > 0
                        || $lockedSchedule
                            ->teacher_computer_records_count > 0
                    ) {
                        return false;
                    }

                    $lockedSchedule->delete();

                    return true;
                }
            );

            if (! $deleted) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không thể xóa lịch vì đã có dữ liệu điểm danh hoặc ghi nhận máy',
                    'error_code' => 409,
                    'data' => '',
                ], 409);
            }

            return response()->json([
                'status' => true,
                'message' => 'Xóa lịch phòng máy thành công',
                'error_code' => 200,
                'data' => '',
            ], 200);
        } catch (Throwable $e) {
            return $this->serverErrorResponse();
        }
    }

    private function applySearch($query, string $keyword): void
    {
        $query->where(function ($subQuery) use ($keyword) {
            $subQuery
                ->where(
                    'thu_trong_tuan',
                    'like',
                    "%{$keyword}%"
                )
                ->orWhere(
                    'loai_lich',
                    'like',
                    "%{$keyword}%"
                )
                ->orWhere(
                    'trang_thai',
                    'like',
                    "%{$keyword}%"
                )
                ->orWhereHas(
                    'room',
                    fn ($roomQuery) => $roomQuery
                        ->where(
                            'ma_phong',
                            'like',
                            "%{$keyword}%"
                        )
                        ->orWhere(
                            'ten_phong',
                            'like',
                            "%{$keyword}%"
                        )
                )
                ->orWhereHas(
                    'class',
                    fn ($classQuery) => $classQuery->where(
                        'ma_lop',
                        'like',
                        "%{$keyword}%"
                    )
                )
                ->orWhereHas(
                    'courseSection',
                    fn ($courseQuery) => $courseQuery
                        ->where(
                            'ma_lop_hoc_phan',
                            'like',
                            "%{$keyword}%"
                        )
                        ->orWhereHas(
                            'subject',
                            fn ($subjectQuery) =>
                                $subjectQuery->where(
                                    'ten_mon',
                                    'like',
                                    "%{$keyword}%"
                                )
                        )
                )
                ->orWhereHas(
                    'teacher.user',
                    fn ($userQuery) => $userQuery->where(
                        'ho_ten',
                        'like',
                        "%{$keyword}%"
                    )
                );
        });
    }

    private function lockScheduleResources(array $data): void
    {
        // Khóa các tài nguyên để request đồng thời không tạo lịch trùng.
        Room::query()
            ->whereKey($data['ma_phong'])
            ->lockForUpdate()
            ->firstOrFail();

        Teacher::query()
            ->whereKey($data['ma_giang_vien'])
            ->lockForUpdate()
            ->firstOrFail();

        CourseSection::query()
            ->whereKey($data['ma_lop_hoc_phan'])
            ->lockForUpdate()
            ->firstOrFail();
    }

    private function findConflict(array $data,?int $ignoredScheduleId = null): ?string {
        if ($data['trang_thai'] === 'cancelled') {
            return null;
        }

        $conflictFields = [
            'room_conflict' => [
                'ma_phong',
                $data['ma_phong'],
            ],
            'teacher_conflict' => [
                'ma_giang_vien',
                $data['ma_giang_vien'],
            ],
            'course_section_conflict' => [
                'ma_lop_hoc_phan',
                $data['ma_lop_hoc_phan'],
            ],
        ];

        foreach ($conflictFields as $conflict => [$field, $value]) {
            $exists = ComputerLabSchedule::query()
                ->when(
                    $ignoredScheduleId,
                    fn ($query) => $query->where(
                        'id',
                        '!=',
                        $ignoredScheduleId
                    )
                )
                ->where($field, $value)
                ->whereDate(
                    'ngay_hoc_cu_the',
                    $data['ngay_hoc_cu_the']
                )
                ->where('trang_thai', '!=', 'cancelled')
                ->where(
                    'so_tiet_bat_dau',
                    '<=',
                    $data['so_tiet_ket_thuc']
                )
                ->where(
                    'so_tiet_ket_thuc',
                    '>=',
                    $data['so_tiet_bat_dau']
                )
                ->exists();

            if ($exists) {
                return $conflict;
            }
        }

        return null;
    }

    private function scheduleData(array $data): array
    {
        return [
            'ma_phong' => $data['ma_phong'],
            'ma_lop' => $data['ma_lop'] ?? null,
            'ma_lop_hoc_phan' => $data['ma_lop_hoc_phan'],
            'ma_giang_vien' => $data['ma_giang_vien'],
            'ma_tuan' => $data['ma_tuan'],
            'ngay_hoc_cu_the' => $data['ngay_hoc_cu_the'],
            'thu_trong_tuan' => $data['thu_trong_tuan'],
            'so_tiet_bat_dau' => $data['so_tiet_bat_dau'],
            'so_tiet_ket_thuc' => $data['so_tiet_ket_thuc'],
            'loai_lich' => $data['loai_lich'],
            'ma_dat_phong_may' =>
                $data['ma_dat_phong_may'] ?? null,
            'trang_thai' => $data['trang_thai'],
            'ghi_chu' => $data['ghi_chu'] ?? null,
        ];
    }

    private function validateWeekAndDay(array $data)
    {
        $week = Week::query()
            ->select([
                'id',
                'ngay_bat_dau',
                'ngay_ket_thuc',
            ])
            ->findOrFail($data['ma_tuan']);

        $studyDate = Carbon::createFromFormat(
            'Y-m-d',
            $data['ngay_hoc_cu_the']
        );

        $dayLabels = [
            1 => 'Thứ 2',
            2 => 'Thứ 3',
            3 => 'Thứ 4',
            4 => 'Thứ 5',
            5 => 'Thứ 6',
            6 => 'Thứ 7',
            7 => 'Chủ nhật',
        ];

        if (
            ! $studyDate->betweenIncluded(
                $week->ngay_bat_dau,
                $week->ngay_ket_thuc
            )
        ) {
            return response()->json([
                'status' => false,
                'message' => 'Ngày học không nằm trong tuần đã chọn',
                'error_code' => 422,
                'data' => [
                    'ngay_hoc_cu_the' => [
                        'Ngày học không nằm trong tuần đã chọn.',
                    ],
                ],
            ], 422);
        }

        if (
            $dayLabels[$studyDate->dayOfWeekIso]
            !== $data['thu_trong_tuan']
        ) {
            return response()->json([
                'status' => false,
                'message' => 'Ngày học không khớp với thứ trong tuần',
                'error_code' => 422,
                'data' => [
                    'thu_trong_tuan' => [
                        'Thứ trong tuần không khớp với ngày học.',
                    ],
                ],
            ], 422);
        }

        return null;
    }

    private function scheduleRelations(): array
    {
        return [
            'room:id,ma_phong,ten_phong',
            'class:id,ma_lop',
            'courseSection:id,ma_lop_hoc_phan,ma_mon',
            'courseSection.subject:id,ten_mon',
            'teacher:id,ma_nguoi_dung,ma_giang_vien',
            'teacher.user:id,ho_ten',
            'week:id,so_tuan,ngay_bat_dau,ngay_ket_thuc',
        ];
    }

    private function loadScheduleRelations(
        ComputerLabSchedule $schedule
    ): void {
        $schedule->load($this->scheduleRelations());
    }

    private function conflictResponse(string $conflict)
    {
        $messages = [
            'room_conflict' =>
                'Phòng máy đã có lịch trùng ngày và khoảng tiết',

            'teacher_conflict' =>
                'Giảng viên đã có lịch trùng ngày và khoảng tiết',

            'course_section_conflict' =>
                'Lớp học phần đã có lịch trùng ngày và khoảng tiết',
        ];

        return response()->json([
            'status' => false,
            'message' => $messages[$conflict],
            'error_code' => 409,
            'data' => '',
        ], 409);
    }

    private function serverErrorResponse()
    {
        return response()->json([
            'status' => false,
            'message' => 'Hiện tại tôi không thể xử lí yêu cầu của bạn',
            'error_code' => 500,
            'data' => '',
        ], 500);
    }
}