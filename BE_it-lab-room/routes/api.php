<?php

use App\Http\Controllers\admin\AuthController as AdminAuthController;
use App\Http\Controllers\admin\ClassStudentController;
use App\Http\Controllers\admin\ComputerController;
use App\Http\Controllers\admin\ComputerImportController;
use App\Http\Controllers\admin\ComputerLabScheduleController;
use App\Http\Controllers\admin\CourseSectionController;
use App\Http\Controllers\admin\RoomBookingController as AdminRoomBookingController;
use App\Http\Controllers\admin\RoomController;
use App\Http\Controllers\admin\SchoolClassController;
use App\Http\Controllers\admin\SubjectController;
use App\Http\Controllers\student\AuthController as StudentAuthController;
use App\Http\Controllers\student\ComputerLabScheduleController as StudentComputerLabScheduleController;
use App\Http\Controllers\teacher\AuthController as TeacherAuthController;
use App\Http\Controllers\teacher\ComputerLabScheduleController as TeacherComputerLabScheduleController;
use App\Http\Controllers\teacher\RoomBookingController as TeacherRoomBookingController;
use Illuminate\Support\Facades\Route;

// Nhóm API đăng nhập chuẩn RESTful cho admin, sinh viên và giảng viên.
Route::prefix('auth')->group(function () {
    Route::post('/admin/login', [AdminAuthController::class, 'login']);
    Route::post('/students/login', [StudentAuthController::class, 'login']);
    Route::post('/teachers/login', [TeacherAuthController::class, 'login']);
});

// Lịch giảng dạy và lịch học được lọc theo tài khoản đăng nhập.
Route::middleware(['auth:sanctum', 'abilities:teacher'])->group(function () {
    Route::get('/teacher/computer-lab-schedules', [TeacherComputerLabScheduleController::class, 'index']);
    Route::get('/teacher/room-bookings', [TeacherRoomBookingController::class, 'index']);
    Route::get('/teacher/room-bookings/availability', [TeacherRoomBookingController::class, 'availability']);
    Route::post('/teacher/room-bookings', [TeacherRoomBookingController::class, 'store']);
});

Route::middleware(['auth:sanctum', 'abilities:student'])
    ->get('/student/computer-lab-schedules', [StudentComputerLabScheduleController::class, 'index']);

Route::middleware(['auth:sanctum', 'abilities:admin'])->group(function () {
    Route::prefix('admin/room-bookings')->group(function () {
        Route::get('/', [AdminRoomBookingController::class, 'index']);
        Route::patch('/{roomBooking}', [AdminRoomBookingController::class, 'update']);
    });

    // Nhóm API quản trị lớp học và xem sinh viên theo từng lớp.
    Route::prefix('admin/classes')->group(function () {
        Route::get('/', [SchoolClassController::class, 'index']);
        Route::post('/', [SchoolClassController::class, 'store']);
        Route::get('/options', [SchoolClassController::class, 'options']);
        Route::get('/{class}/students', [ClassStudentController::class, 'index']);
        Route::get('/{class}', [SchoolClassController::class, 'show']);
        Route::put('/{class}', [SchoolClassController::class, 'update']);
        Route::delete('/{class}', [SchoolClassController::class, 'destroy']);
    });

    // Nhóm API quản trị lớp học phần và phân công giảng viên.
    Route::prefix('admin/course-sections')->group(function () {
        Route::get('/', [CourseSectionController::class, 'index']);
        Route::post('/', [CourseSectionController::class, 'store']);
        Route::get('/options', [CourseSectionController::class, 'options']);
        Route::get('/{courseSection}', [CourseSectionController::class, 'show']);
        Route::put('/{courseSection}', [CourseSectionController::class, 'update']);
        Route::delete('/{courseSection}', [CourseSectionController::class, 'destroy']);
    });

    // Nhóm API quản trị phòng máy.
    Route::prefix('admin/rooms')->group(function () {
        Route::get('/', [RoomController::class, 'index']);
        Route::post('/', [RoomController::class, 'store']);
        Route::get('/{room}/computers', [RoomController::class, 'computers']);
        Route::get('/{room}', [RoomController::class, 'show']);
        Route::put('/{room}', [RoomController::class, 'update']);
        Route::delete('/{room}', [RoomController::class, 'destroy']);
    });

    // Nhóm API quản trị môn học.
    Route::prefix('admin/subjects')->group(function () {
        Route::get('/', [SubjectController::class, 'index']);
        Route::post('/', [SubjectController::class, 'store']);
        Route::get('/{subject}', [SubjectController::class, 'show']);
        Route::put('/{subject}', [SubjectController::class, 'update']);
        Route::delete('/{subject}', [SubjectController::class, 'destroy']);
    });

    // Nhóm API quản trị lịch sử dụng phòng máy.
    Route::prefix('admin/computer-lab-schedules')->group(function () {
        Route::get('/', [ComputerLabScheduleController::class, 'index']);
        Route::post('/', [ComputerLabScheduleController::class, 'store']);
        Route::get('/options', [ComputerLabScheduleController::class, 'options']);
        Route::get('/{computerLabSchedule}', [ComputerLabScheduleController::class, 'show']);
        Route::put('/{computerLabSchedule}', [ComputerLabScheduleController::class, 'update']);
        Route::delete('/{computerLabSchedule}', [ComputerLabScheduleController::class, 'destroy']);
    });

    // Nhóm API quản trị máy tính.
    Route::prefix('admin/computers')->group(function () {
        Route::get('/', [ComputerController::class, 'index']);
        Route::get('/{computer}', [ComputerController::class, 'show']);
        Route::put('/{computer}', [ComputerController::class, 'update']);
        Route::delete('/{computer}', [ComputerController::class, 'destroy']);
    });

    // Nhóm API quản trị phiếu nhập máy, tự sinh máy tính theo số lượng nhập.
    Route::prefix('admin/computer-imports')->group(function () {
        Route::get('/', [ComputerImportController::class, 'index']);
        Route::post('/', [ComputerImportController::class, 'store']);
        Route::get('/code', [ComputerImportController::class, 'generateCode']);
        Route::get('/{computerImport}', [ComputerImportController::class, 'show']);
    });
});
