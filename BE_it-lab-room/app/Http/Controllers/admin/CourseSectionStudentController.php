<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CourseSectionStudentRequest;
use App\Http\Resources\CourseSectionResource;
use App\Http\Resources\CourseSectionStudentResource;
use App\Models\CourseSection;
use App\Models\CourseSectionStudent;
use App\Models\Student;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Throwable;

class CourseSectionStudentController extends Controller
{
    public function index(CourseSectionStudentRequest $request, CourseSection $courseSection)
    {
        try {
            $data = $request->validated();
            $keyword = (string) ($data['keyword'] ?? '');
            $perPage = (int) ($data['per_page'] ?? 100);

            $this->loadCourseSection($courseSection);

            if ($courseSection->ma_lop) {
                $manualDetails = CourseSectionStudent::query()
                    ->select(['id', 'ma_lop_hoc_phan', 'ma_sinh_vien', 'trang_thai', 'ghi_chu'])
                    ->where('ma_lop_hoc_phan', $courseSection->id)
                    ->with($this->studentRelations())
                    ->get()
                    ->keyBy('ma_sinh_vien');

                // Khi lớp học phần gắn lớp học, hiển thị toàn bộ sinh viên thuộc lớp đó.
                $classStudents = Student::query()
                    ->select(['id', 'ma_nguoi_dung', 'ma_lop', 'ma_sinh_vien', 'nien_khoa'])
                    ->with(['user:id,ho_ten,email', 'class:id,ma_lop'])
                    ->where('ma_lop', $courseSection->ma_lop)
                    ->when($keyword !== '', function ($query) use ($keyword) {
                        $query->where(function ($searchQuery) use ($keyword) {
                            $searchQuery
                                ->where('ma_sinh_vien', 'like', "%{$keyword}%")
                                ->orWhereHas('user', fn ($userQuery) =>
                                    $userQuery->where('ho_ten', 'like', "%{$keyword}%")
                                        ->orWhere('email', 'like', "%{$keyword}%")
                                );
                        });
                    })
                    ->orderBy('ma_sinh_vien')
                    ->paginate($perPage);

                $students = $classStudents->getCollection()
                    ->reject(function (Student $student) use ($manualDetails) {
                        return $manualDetails->get($student->id)?->trang_thai === 'inactive';
                    })
                    ->map(function (Student $student) use ($courseSection, $manualDetails) {
                        $detail = $manualDetails->get($student->id);

                        return [
                            'id' => "class-{$student->id}",
                            'detail_id' => $detail?->id,
                            'source_type' => 'class',
                            'ma_lop_hoc_phan' => $courseSection->id,
                            'ma_sinh_vien' => $student->id,
                            'trang_thai' => $detail?->trang_thai ?? 'active',
                            'ghi_chu' => $detail?->ghi_chu,
                            'sinh_vien' => [
                                'id' => $student->id,
                                'ma_sinh_vien' => $student->ma_sinh_vien,
                                'nien_khoa' => $student->nien_khoa,
                                'ho_ten' => $student->user?->ho_ten,
                                'email' => $student->user?->email,
                                'lop' => $student->class ? [
                                    'id' => $student->class->id,
                                    'ma_lop' => $student->class->ma_lop,
                                ] : null,
                            ],
                        ];
                    });

                $extraManualStudents = $manualDetails
                    ->reject(fn (CourseSectionStudent $detail) =>
                        (int) $detail->student?->ma_lop === (int) $courseSection->ma_lop
                    )
                    ->values()
                    ->map(fn (CourseSectionStudent $detail) =>
                        (new CourseSectionStudentResource($detail))->resolve()
                    );

                return response()->json([
                    'status' => true,
                    'message' => 'Lấy danh sách sinh viên lớp học phần thành công',
                    'error_code' => 200,
                    'data' => [
                        'course_section' => new CourseSectionResource($courseSection),
                        'students' => $students->concat($extraManualStudents)->values(),
                        'pagination' => [
                            'current_page' => $classStudents->currentPage(),
                            'per_page' => $classStudents->perPage(),
                            'total' => $classStudents->total() + $extraManualStudents->count(),
                            'last_page' => $classStudents->lastPage(),
                        ],
                    ],
                ], 200);
            }

            $students = CourseSectionStudent::query()
                ->select(['id', 'ma_lop_hoc_phan', 'ma_sinh_vien', 'trang_thai', 'ghi_chu'])
                ->with($this->studentRelations())
                ->where('ma_lop_hoc_phan', $courseSection->id)
                ->when($keyword !== '', function ($query) use ($keyword) {
                    $query->where(function ($searchQuery) use ($keyword) {
                        $searchQuery
                            ->where('ghi_chu', 'like', "%{$keyword}%")
                            ->orWhereHas('student', fn ($studentQuery) =>
                                $studentQuery->where('ma_sinh_vien', 'like', "%{$keyword}%")
                                    ->orWhereHas('user', fn ($userQuery) =>
                                        $userQuery->where('ho_ten', 'like', "%{$keyword}%")
                                            ->orWhere('email', 'like', "%{$keyword}%")
                                    )
                            );
                    });
                })
                ->orderBy(Student::query()
                    ->select('ma_sinh_vien')
                    ->whereColumn('sinh_vien.id', 'chi_tiet_lop_hoc_phan.ma_sinh_vien')
                    ->limit(1))
                ->paginate($perPage);

            return response()->json([
                'status' => true,
                'message' => 'Lấy danh sách sinh viên lớp học phần thành công',
                'error_code' => 200,
                'data' => [
                    'course_section' => new CourseSectionResource($courseSection),
                    'students' => CourseSectionStudentResource::collection($students),
                    'pagination' => [
                        'current_page' => $students->currentPage(),
                        'per_page' => $students->perPage(),
                        'total' => $students->total(),
                        'last_page' => $students->lastPage(),
                    ],
                ],
            ], 200);
        } catch (Throwable $e) {
            return $this->serverErrorResponse('Không thể lấy danh sách sinh viên lớp học phần');
        }
    }

    public function options(CourseSectionStudentRequest $request, CourseSection $courseSection)
    {
        try {
            $request->validated();

            $enrolledStudentIds = CourseSectionStudent::query()
                ->where('ma_lop_hoc_phan', $courseSection->id)
                ->where('trang_thai', 'active')
                ->pluck('ma_sinh_vien')
                ->map(fn ($studentId) => (int) $studentId)
                ->values();

            $students = Student::query()
                ->select(['id', 'ma_nguoi_dung', 'ma_lop', 'ma_sinh_vien', 'nien_khoa'])
                ->with(['user:id,ho_ten,email,trang_thai', 'class:id,ma_lop'])
                ->orderBy('ma_sinh_vien')
                ->get()
                ->map(fn (Student $student) => [
                    'id' => $student->id,
                    'student_code' => $student->ma_sinh_vien,
                    'full_name' => $student->user?->ho_ten,
                    'email' => $student->user?->email,
                    'class_code' => $student->class?->ma_lop,
                    'course_year' => $student->nien_khoa,
                    'is_enrolled' => $enrolledStudentIds->contains($student->id),
                    'is_in_class' => $courseSection->ma_lop
                        && (int) $student->ma_lop === (int) $courseSection->ma_lop,
                ]);

            return response()->json([
                'status' => true,
                'message' => 'Lấy danh sách sinh viên để chọn thành công',
                'error_code' => 200,
                'data' => [
                    'students' => $students,
                    'enrolled_student_ids' => $enrolledStudentIds,
                ],
            ], 200);
        } catch (Throwable $e) {
            return $this->serverErrorResponse('Không thể lấy danh sách sinh viên để chọn');
        }
    }

    public function store(CourseSectionStudentRequest $request, CourseSection $courseSection)
    {
        try {
            $data = $request->validated();

            $student = DB::transaction(function () use ($courseSection, $data) {
                $this->lockCapacity($courseSection);

                return CourseSectionStudent::create([
                    'ma_lop_hoc_phan' => $courseSection->id,
                    'ma_sinh_vien' => $data['ma_sinh_vien'],
                    'trang_thai' => $data['trang_thai'],
                    'ghi_chu' => isset($data['ghi_chu']) ? trim($data['ghi_chu']) : null,
                ]);
            });

            $student->load($this->studentRelations());

            return response()->json([
                'status' => true,
                'message' => 'Thêm sinh viên vào lớp học phần thành công',
                'error_code' => 201,
                'data' => new CourseSectionStudentResource($student),
            ], 201);
        } catch (QueryException $e) {
            return $this->databaseConflictResponse($e);
        } catch (Throwable $e) {
            return $this->serverErrorResponse('Không thể thêm sinh viên vào lớp học phần');
        }
    }

    public function update(
        CourseSectionStudentRequest $request,
        CourseSection $courseSection,
        CourseSectionStudent $courseSectionStudent
    ) {
        try {
            $this->ensureBelongsToCourseSection($courseSection, $courseSectionStudent);
            $data = $request->validated();

            DB::transaction(function () use ($courseSectionStudent, $data) {
                $courseSectionStudent->update([
                    'ma_sinh_vien' => $data['ma_sinh_vien'],
                    'trang_thai' => $data['trang_thai'],
                    'ghi_chu' => isset($data['ghi_chu']) ? trim($data['ghi_chu']) : null,
                ]);
            });

            $courseSectionStudent->refresh()->load($this->studentRelations());

            return response()->json([
                'status' => true,
                'message' => 'Cập nhật sinh viên trong lớp học phần thành công',
                'error_code' => 200,
                'data' => new CourseSectionStudentResource($courseSectionStudent),
            ], 200);
        } catch (QueryException $e) {
            return $this->databaseConflictResponse($e);
        } catch (Throwable $e) {
            return $this->serverErrorResponse('Không thể cập nhật sinh viên trong lớp học phần');
        }
    }

    public function destroy(CourseSection $courseSection, CourseSectionStudent $courseSectionStudent)
    {
        try {
            $this->ensureBelongsToCourseSection($courseSection, $courseSectionStudent);
            $courseSectionStudent->delete();

            return response()->json([
                'status' => true,
                'message' => 'Xóa sinh viên khỏi lớp học phần thành công',
                'error_code' => 200,
                'data' => '',
            ], 200);
        } catch (Throwable $e) {
            return $this->serverErrorResponse('Không thể xóa sinh viên khỏi lớp học phần');
        }
    }

    public function destroyByStudent(CourseSection $courseSection, Student $student)
    {
        try {
            DB::transaction(function () use ($courseSection, $student) {
                // Với sinh viên đi theo lớp học chính, chỉ loại khỏi lớp học phần hiện tại.
                CourseSectionStudent::query()->updateOrCreate(
                    [
                        'ma_lop_hoc_phan' => $courseSection->id,
                        'ma_sinh_vien' => $student->id,
                    ],
                    [
                        'trang_thai' => 'inactive',
                        'ghi_chu' => 'Đã xóa khỏi lớp học phần',
                    ]
                );
            });

            return response()->json([
                'status' => true,
                'message' => 'Xóa sinh viên khỏi lớp học phần thành công',
                'error_code' => 200,
                'data' => '',
            ], 200);
        } catch (Throwable $e) {
            return $this->serverErrorResponse('Không thể xóa sinh viên khỏi lớp học phần');
        }
    }

    private function studentRelations(): array
    {
        return [
            'student:id,ma_nguoi_dung,ma_lop,ma_sinh_vien,nien_khoa',
            'student.user:id,ho_ten,email',
            'student.class:id,ma_lop',
        ];
    }

    private function loadCourseSection(CourseSection $courseSection): void
    {
        $courseSection->load([
            'subject:id,ma_mon_hoc,ten_mon',
            'academicYear:id,ten_nam_hoc',
            'class:id,ma_lop',
            'room:id,ma_phong,ten_phong',
            'assignments:id,ma_lop_hoc_phan,ma_giang_vien',
            'assignments.teacher:id,ma_nguoi_dung,ma_giang_vien',
            'assignments.teacher.user:id,ho_ten',
        ])->loadCount('studentDetails');
    }

    private function lockCapacity(CourseSection $courseSection): void
    {
        $lockedCourseSection = CourseSection::query()
            ->whereKey($courseSection->id)
            ->lockForUpdate()
            ->firstOrFail();

        $studentCount = CourseSectionStudent::query()
            ->where('ma_lop_hoc_phan', $lockedCourseSection->id)
            ->lockForUpdate()
            ->count();

        if ($studentCount >= $lockedCourseSection->si_so_toi_da) {
            abort(response()->json([
                'status' => false,
                'message' => 'Lớp học phần đã đạt sĩ số tối đa',
                'error_code' => 409,
                'data' => '',
            ], 409));
        }
    }

    private function ensureBelongsToCourseSection(
        CourseSection $courseSection,
        CourseSectionStudent $courseSectionStudent
    ): void {
        if ((int) $courseSectionStudent->ma_lop_hoc_phan !== (int) $courseSection->id) {
            abort(response()->json([
                'status' => false,
                'message' => 'Sinh viên không thuộc lớp học phần này',
                'error_code' => 404,
                'data' => '',
            ], 404));
        }
    }

    private function databaseConflictResponse(QueryException $exception)
    {
        if (in_array((string) $exception->getCode(), ['23000', '23505'], true)) {
            return response()->json([
                'status' => false,
                'message' => 'Sinh viên đã có trong lớp học phần này',
                'error_code' => 409,
                'data' => '',
            ], 409);
        }

        return $this->serverErrorResponse('Không thể xử lý sinh viên lớp học phần');
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
