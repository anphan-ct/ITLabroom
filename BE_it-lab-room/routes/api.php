<?php

use App\Http\Controllers\admin\AuthController as AdminAuthController;
use App\Http\Controllers\admin\ClassStudentController;
use App\Http\Controllers\member\AuthController as MemberAuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Nhóm API đăng nhập chuẩn RESTful cho admin, sinh viên và giảng viên.
Route::prefix('auth')->group(function () {
    Route::post('/admin/login', [AdminAuthController::class, 'login']);
    Route::post('/students/login', [MemberAuthController::class, 'studentLogin']);
    Route::post('/teachers/login', [MemberAuthController::class, 'teacherLogin']);
});

// Nhóm API quản trị lớp học, dùng để xem sinh viên theo từng lớp.
Route::prefix('admin/classes')->group(function () {
    Route::get('/{class}/students', [ClassStudentController::class, 'index']);
});

