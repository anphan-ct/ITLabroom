<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AcademicYearRequest;
use App\Http\Resources\AcademicYearResource;
use App\Models\AcademicYear;
use App\Models\ComputerLabSchedule;
use App\Models\RoomBooking;
use App\Models\Week;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;

class AcademicYearController extends Controller
{
    public function index(AcademicYearRequest $request)
    {
        try {
            $data = $request->validated();
            $today = Carbon::today()->toDateString();

            $academicYears = AcademicYear::query()
                ->select(['id', 'ten_nam_hoc', 'ngay_bat_dau', 'ngay_ket_thuc', 'trang_thai'])
                ->with(['weeks' => fn ($query) => $query
                    ->select(['id', 'ma_nam_hoc', 'so_tuan', 'ngay_bat_dau', 'ngay_ket_thuc'])
                    ->orderBy('so_tuan')])
                ->withCount('weeks')
                ->when($data['search'] ?? null, function ($query, string $keyword) {
                    $query->where(function ($searchQuery) use ($keyword) {
                        $searchQuery->where('ten_nam_hoc', 'like', "%{$keyword}%");
                    });
                })
                ->when($data['status'] ?? null, function ($query, string $status) use ($today) {
                    if ($status === 'upcoming') {
                        $query->whereDate('ngay_bat_dau', '>', $today);
                    }

                    if ($status === 'completed') {
                        $query->whereDate('ngay_ket_thuc', '<', $today);
                    }

                    if ($status === 'active') {
                        $query->whereDate('ngay_bat_dau', '<=', $today)
                            ->whereDate('ngay_ket_thuc', '>=', $today);
                    }
                })
                ->orderByDesc('ngay_bat_dau')
                ->get();

            return response()->json([
                'status' => true,
                'message' => 'Lấy danh sách năm học thành công',
                'error_code' => 200,
                'data' => AcademicYearResource::collection($academicYears),
            ], 200);
        } catch (Throwable $e) {
            return $this->serverErrorResponse('Không thể lấy danh sách năm học');
        }
    }

    public function store(AcademicYearRequest $request)
    {
        try {
            $data = $request->validated();

            $academicYear = DB::transaction(function () use ($data) {
                $academicYear = AcademicYear::create($this->academicYearData($data));
                $this->syncWeeks($academicYear);

                return $academicYear;
            });

            $this->loadRelations($academicYear);

            return response()->json([
                'status' => true,
                'message' => 'Tạo năm học thành công',
                'error_code' => 201,
                'data' => new AcademicYearResource($academicYear),
            ], 201);
        } catch (Throwable $e) {
            return $this->serverErrorResponse('Không thể tạo năm học');
        }
    }

    public function show(Request $request, AcademicYear $academicYear)
    {
        try {
            $request->validate([]);
            $this->loadRelations($academicYear);

            return response()->json([
                'status' => true,
                'message' => 'Lấy chi tiết năm học thành công',
                'error_code' => 200,
                'data' => new AcademicYearResource($academicYear),
            ], 200);
        } catch (Throwable $e) {
            return $this->serverErrorResponse('Không thể lấy chi tiết năm học');
        }
    }

    public function update(AcademicYearRequest $request, AcademicYear $academicYear)
    {
        try {
            $data = $request->validated();
            $dateChanged = $academicYear->ngay_bat_dau?->format('Y-m-d') !== $data['ngay_bat_dau']
                || $academicYear->ngay_ket_thuc?->format('Y-m-d') !== $data['ngay_ket_thuc'];

            $blockingData = $this->blockingData($academicYear);

            if ($dateChanged && ($blockingData['lich_phong_may'] > 0 || $blockingData['yeu_cau_dat_phong'] > 0)) {
                return response()->json([
                    'status' => false,
                    'message' => $this->blockingMessage(
                        'Không thể đổi khoảng thời gian năm học vì đã có dữ liệu liên quan',
                        $blockingData
                    ),
                    'error_code' => 409,
                    'data' => $blockingData,
                ], 409);
            }

            DB::transaction(function () use ($academicYear, $data, $dateChanged) {
                $academicYear->update($this->academicYearData($data));

                if ($dateChanged) {
                    $this->syncWeeks($academicYear);
                }
            });

            $academicYear->refresh();
            $this->loadRelations($academicYear);

            return response()->json([
                'status' => true,
                'message' => 'Cập nhật năm học thành công',
                'error_code' => 200,
                'data' => new AcademicYearResource($academicYear),
            ], 200);
        } catch (Throwable $e) {
            return $this->serverErrorResponse('Không thể cập nhật năm học');
        }
    }

    public function destroy(Request $request, AcademicYear $academicYear)
    {
        try {
            $request->validate([]);
            $blockingData = $this->blockingData($academicYear);

            if (array_sum($blockingData) > 0) {
                return response()->json([
                    'status' => false,
                    'message' => $this->blockingMessage(
                        'Không thể xóa năm học vì đã có dữ liệu liên quan',
                        $blockingData
                    ),
                    'error_code' => 409,
                    'data' => $blockingData,
                ], 409);
            }

            $academicYear->delete();

            return response()->json([
                'status' => true,
                'message' => 'Xóa năm học thành công',
                'error_code' => 200,
                'data' => '',
            ], 200);
        } catch (Throwable $e) {
            return $this->serverErrorResponse('Không thể xóa năm học');
        }
    }

    private function academicYearData(array $data): array
    {
        return [
            'ten_nam_hoc' => trim($data['ten_nam_hoc']),
            'ngay_bat_dau' => $data['ngay_bat_dau'],
            'ngay_ket_thuc' => $data['ngay_ket_thuc'],
            'trang_thai' => $this->resolveStatus($data['ngay_bat_dau'], $data['ngay_ket_thuc']),
        ];
    }

    private function syncWeeks(AcademicYear $academicYear): void
    {
        $academicYear->weeks()->delete();

        $startDate = Carbon::parse($academicYear->ngay_bat_dau);
        $endDate = Carbon::parse($academicYear->ngay_ket_thuc);
        $weekNumber = 1;

        while ($startDate->lte($endDate)) {
            $weekEndDate = $startDate->copy()->addDays(6);

            if ($weekEndDate->gt($endDate)) {
                $weekEndDate = $endDate->copy();
            }

            Week::create([
                'ma_nam_hoc' => $academicYear->id,
                'so_tuan' => $weekNumber,
                'ngay_bat_dau' => $startDate->toDateString(),
                'ngay_ket_thuc' => $weekEndDate->toDateString(),
            ]);

            $startDate = $weekEndDate->copy()->addDay();
            $weekNumber++;
        }
    }

    private function blockingData(AcademicYear $academicYear): array
    {
        $weekIds = Week::query()
            ->where('ma_nam_hoc', $academicYear->id)
            ->pluck('id');

        return [
            'lop_hoc_phan' => $academicYear->courseSections()->count(),
            'lich_phong_may' => $weekIds->isEmpty()
                ? 0
                : ComputerLabSchedule::query()->whereIn('ma_tuan', $weekIds)->count(),
            'yeu_cau_dat_phong' => $weekIds->isEmpty()
                ? 0
                : RoomBooking::query()->whereIn('ma_tuan', $weekIds)->count(),
        ];
    }

    private function blockingMessage(string $prefix, array $blockingData): string
    {
        $labels = [
            'lop_hoc_phan' => 'lớp học phần',
            'lich_phong_may' => 'lịch phòng máy',
            'yeu_cau_dat_phong' => 'yêu cầu đặt phòng',
        ];

        $details = collect($blockingData)
            ->filter(fn (int $count) => $count > 0)
            ->map(fn (int $count, string $key) => "{$count} {$labels[$key]}")
            ->values()
            ->implode(', ');

        return "{$prefix}: {$details}";
    }

    private function resolveStatus(string $startDate, string $endDate): string
    {
        $today = Carbon::today();

        if ($today->lt(Carbon::parse($startDate))) {
            return 'upcoming';
        }

        if ($today->gt(Carbon::parse($endDate))) {
            return 'completed';
        }

        return 'active';
    }

    private function loadRelations(AcademicYear $academicYear): void
    {
        $academicYear->load(['weeks' => fn ($query) => $query->orderBy('so_tuan')])
            ->loadCount('weeks');
    }

    private function serverErrorResponse(string $message)
    {
        return response()->json([
            'status' => false,
            'message' => $message,
            'error_code' => 500,
            'data' => '',
        ], 500);
    }
}
