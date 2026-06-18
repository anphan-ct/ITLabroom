<?php

use App\Http\Controllers\admin\AuthController as AdminAuthController;
use App\Http\Controllers\admin\ClassStudentController;
use App\Http\Controllers\admin\ComputerController;
use App\Http\Controllers\admin\ComputerImportController;
use App\Http\Controllers\admin\RoomController;
use App\Http\Controllers\student\AuthController as StudentAuthController;
use App\Http\Controllers\teacher\AuthController as TeacherAuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Nhóm API đăng nhập chuẩn RESTful cho admin, sinh viên và giảng viên.
Route::prefix('auth')->group(function () {
    Route::post('/admin/login', [AdminAuthController::class, 'login']);
    Route::post('/students/login', [StudentAuthController::class, 'login']);
    Route::post('/teachers/login', [TeacherAuthController::class, 'login']);
});

// Nhóm API quản trị lớp học, dùng để xem sinh viên theo từng lớp.
Route::prefix('admin/classes')->group(function () {
    Route::get('/{class}/students', [ClassStudentController::class, 'index']);
});

// Nhóm API quản trị phòng máy.
Route::prefix('admin/rooms')->group(function () {
    Route::get('/', [RoomController::class, 'index']);
    Route::delete('/{room}', [RoomController::class, 'destroy']);
});

// Nhóm API quản trị máy tính.
Route::prefix('admin/computers')->group(function () {
    Route::get('/', [ComputerController::class, 'index']);
    Route::get('/{computer}', [ComputerController::class, 'show']);
    Route::delete('/{computer}', [ComputerController::class, 'destroy']);
});

// Nhóm API quản trị phiếu nhập máy, tự sinh máy tính theo số lượng nhập.
Route::prefix('admin/computer-imports')->group(function () {
    Route::get('/', [ComputerImportController::class, 'index']);
    Route::post('/', [ComputerImportController::class, 'store']);
    Route::get('/{computerImport}', [ComputerImportController::class, 'show']);
});
