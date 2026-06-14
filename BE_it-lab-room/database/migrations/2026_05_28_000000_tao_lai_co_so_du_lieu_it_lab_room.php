<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tạo lại toàn bộ cấu trúc database cho hệ thống IT Lab Room.
     */
    public function up(): void
    {
        // Nhóm bảng nghiệp vụ bắt đầu từ phân quyền và người dùng.
        Schema::create('vai_tro', function (Blueprint $table) {
            $table->id();
            $table->string('ten_vai_tro')->unique();
            $table->text('mo_ta')->nullable();
            $table->timestamps();
        });

        Schema::create('nguoi_dung', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ma_vai_tro')->constrained('vai_tro')->restrictOnDelete();
            $table->string('ho_ten');
            $table->string('email')->unique();
            $table->string('mat_khau');
            $table->string('so_dien_thoai', 20)->nullable()->index();
            $table->string('gioi_tinh', 20)->nullable();
            $table->date('ngay_sinh')->nullable();
            $table->unsignedTinyInteger('trang_thai')->default(1)->index();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->morphs('tokenable');
            $table->string('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });

        // Nhóm bảng danh mục nền tảng cho phòng máy, môn học và học kỳ.
        Schema::create('giang_vien', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ma_nguoi_dung')->unique()->constrained('nguoi_dung')->cascadeOnDelete();
            $table->string('ma_giang_vien')->unique();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('lop_hoc', function (Blueprint $table) {
            $table->id();
            $table->string('ma_lop')->unique();
            $table->string('nien_khoa')->index();
            $table->string('chuyen_nganh')->index();
            $table->foreignId('ma_giang_vien')->nullable()->constrained('giang_vien')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('sinh_vien', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ma_nguoi_dung')->unique()->constrained('nguoi_dung')->cascadeOnDelete();
            $table->foreignId('ma_lop')->constrained('lop_hoc')->restrictOnDelete();
            $table->string('ma_sinh_vien')->unique();
            $table->string('nien_khoa')->index();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('phong_ban', function (Blueprint $table) {
            $table->id();
            $table->string('ma_phong_ban')->unique();
            $table->string('ten_phong_ban');
            $table->string('trang_thai')->default('active')->index();
            $table->text('mo_ta')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('phong_may', function (Blueprint $table) {
            $table->id();
            $table->string('ma_phong')->unique();
            $table->string('ten_phong');
            $table->string('vi_tri')->nullable();
            $table->unsignedInteger('suc_chua')->default(0);
            $table->string('trang_thai')->default('active')->index();
            $table->text('mo_ta')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('mon_hoc', function (Blueprint $table) {
            $table->id();
            $table->string('ma_mon_hoc')->nullable()->unique();
            $table->string('ten_mon');
            $table->string('loai_mon')->nullable()->index();
            $table->unsignedTinyInteger('so_tin_chi')->default(0);
            $table->text('mo_ta')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('nam_hoc', function (Blueprint $table) {
            $table->id();
            $table->string('ten_nam_hoc', 20)->unique();
            $table->date('ngay_bat_dau');
            $table->date('ngay_ket_thuc');
            $table->string('trang_thai', 50)->default('active');
            $table->timestamps();
        });

        Schema::create('tuan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ma_nam_hoc')->constrained('nam_hoc')->cascadeOnDelete();
            $table->unsignedSmallInteger('so_tuan');
            $table->date('ngay_bat_dau');
            $table->date('ngay_ket_thuc');
            $table->timestamps();

            $table->unique(['ma_nam_hoc', 'so_tuan'], 'tuan_nam_hoc_so_tuan_unique');
            $table->index(['ngay_bat_dau', 'ngay_ket_thuc'], 'tuan_ngay_bat_dau_ket_thuc_index');
        });

        Schema::create('may_tinh', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ma_phong')->constrained('phong_may')->restrictOnDelete();
            $table->string('ma_may')->unique();
            $table->string('ten_may');
            $table->string('vi_tri')->nullable();
            $table->string('ma_qr')->nullable()->unique();
            $table->string('bo_xu_ly')->nullable();
            $table->string('ram')->nullable();
            $table->string('card_do_hoa')->nullable();
            $table->string('bo_mach_chu')->nullable();
            $table->string('man_hinh')->nullable();
            $table->string('ban_phim')->nullable();
            $table->string('chuot')->nullable();
            $table->string('hdd')->nullable();
            $table->string('ssd')->nullable();
            $table->string('trang_thai')->default('active')->index();
            $table->text('ghi_chu')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['ma_phong', 'ten_may'], 'may_tinh_ma_phong_ten_may_unique');
        });

        Schema::create('phieu_nhap_may', function (Blueprint $table) {
            $table->id();
            $table->string('ma_phieu_nhap')->unique();
            $table->date('ngay_nhap')->index();
            $table->unsignedInteger('so_luong')->default(0);
            $table->string('nha_cung_cap')->nullable();
            $table->text('ghi_chu')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('chi_tiet_phieu_nhap_may', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ma_phieu_nhap')->constrained('phieu_nhap_may')->cascadeOnDelete();
            $table->foreignId('ma_may_tinh')->constrained('may_tinh')->restrictOnDelete();
            $table->text('ghi_chu')->nullable();
            $table->timestamps();

            $table->unique(['ma_phieu_nhap', 'ma_may_tinh'], 'chi_tiet_phieu_nhap_may_unique');
        });

        Schema::create('thiet_bi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ma_phong')->constrained('phong_may')->restrictOnDelete();
            $table->string('ten_thiet_bi');
            $table->unsignedInteger('so_luong')->default(0);
            $table->string('don_vi', 50)->nullable();
            $table->string('trang_thai')->default('active')->index();
            $table->text('ghi_chu')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // Nhóm bảng nghiệp vụ lịch học, điểm danh, mượn thiết bị và xử lý sự cố.
        Schema::create('lop_hoc_phan', function (Blueprint $table) {
            $table->id();
            $table->string('ma_lop_hoc_phan')->unique();
            $table->foreignId('ma_mon')->constrained('mon_hoc')->restrictOnDelete();
            $table->foreignId('ma_nam_hoc')->constrained('nam_hoc')->restrictOnDelete();
            $table->foreignId('ma_phong')->nullable()->constrained('phong_may')->nullOnDelete();
            $table->unsignedInteger('si_so_toi_da')->default(0);
            $table->string('trang_thai')->default('active')->index();
            $table->text('ghi_chu')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('phan_cong_giang_vien', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ma_giang_vien')->constrained('giang_vien')->cascadeOnDelete();
            $table->foreignId('ma_lop_hoc_phan')->constrained('lop_hoc_phan')->cascadeOnDelete();
            $table->string('trang_thai', 50)->default('active')->index();
            $table->text('ghi_chu')->nullable();
            $table->timestamps();

            $table->unique(['ma_giang_vien', 'ma_lop_hoc_phan'], 'phan_cong_giang_vien_lhp_unique');
        });

        Schema::create('chi_tiet_lop_hoc_phan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ma_lop_hoc_phan')->constrained('lop_hoc_phan')->cascadeOnDelete();
            $table->foreignId('ma_sinh_vien')->constrained('sinh_vien')->cascadeOnDelete();
            $table->string('trang_thai')->default('active')->index();
            $table->text('ghi_chu')->nullable();
            $table->timestamps();

            $table->unique(['ma_lop_hoc_phan', 'ma_sinh_vien'], 'chi_tiet_lhp_sinh_vien_unique');
        });

        Schema::create('dat_phong_may', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ma_giang_vien')->constrained('giang_vien')->cascadeOnDelete();
            $table->foreignId('ma_lop_hoc_phan')->nullable()->constrained('lop_hoc_phan')->nullOnDelete();
            $table->foreignId('ma_phong')->constrained('phong_may')->restrictOnDelete();
            $table->foreignId('ma_mon')->nullable()->constrained('mon_hoc')->nullOnDelete();
            $table->foreignId('ma_nam_hoc')->nullable()->constrained('nam_hoc')->nullOnDelete();
            $table->foreignId('ma_tuan')->nullable()->constrained('tuan')->nullOnDelete();
            $table->date('ngay_dat')->index();
            $table->unsignedTinyInteger('so_tiet_bat_dau');
            $table->unsignedTinyInteger('so_tiet_ket_thuc');
            $table->text('muc_dich')->nullable();
            $table->string('trang_thai_duyet')->default('pending')->index();
            $table->timestamps();

            $table->index(
                ['ma_phong', 'ngay_dat', 'so_tiet_bat_dau', 'so_tiet_ket_thuc'],
                'dat_phong_phong_ngay_tiet_index'
            );
        });

        Schema::create('lich_su_dung_phong_may', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ma_phong')->constrained('phong_may')->cascadeOnDelete();
            $table->foreignId('ma_lop')->nullable()->constrained('lop_hoc')->nullOnDelete();
            $table->foreignId('ma_lop_hoc_phan')->constrained('lop_hoc_phan')->restrictOnDelete();
            $table->foreignId('ma_giang_vien')->constrained('giang_vien')->restrictOnDelete();
            $table->foreignId('ma_tuan')->constrained('tuan')->restrictOnDelete();
            $table->date('ngay_hoc_cu_the')->index();
            $table->string('thu_trong_tuan', 20);
            $table->unsignedTinyInteger('so_tiet_bat_dau');
            $table->unsignedTinyInteger('so_tiet_ket_thuc');
            $table->string('loai_lich', 50)->default('ChinhThuc')->index();
            $table->foreignId('ma_dat_phong_may')->nullable()->constrained('dat_phong_may')->nullOnDelete();
            $table->string('trang_thai')->default('scheduled')->index();
            $table->text('ghi_chu')->nullable();
            $table->timestamps();

            $table->index(['ma_lop', 'ngay_hoc_cu_the'], 'ls_dung_lop_ngay_index');
            $table->index(['ma_lop_hoc_phan', 'ngay_hoc_cu_the'], 'ls_dung_lhp_ngay_index');
            $table->index(
                ['ma_phong', 'ngay_hoc_cu_the', 'so_tiet_bat_dau', 'so_tiet_ket_thuc'],
                'ls_dung_phong_ngay_tiet_index'
            );
        });

        Schema::create('ghi_nhan_may_giao_vien', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ma_lich_su_dung')->constrained('lich_su_dung_phong_may')->cascadeOnDelete();
            $table->foreignId('ma_may_tinh_giao_vien')->constrained('may_tinh')->cascadeOnDelete();
            $table->string('ghi_chu_buoi_hoc')->nullable();
            $table->timestamps();
        });

        Schema::create('diem_danh', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ma_lich_su_dung')->constrained('lich_su_dung_phong_may')->cascadeOnDelete();
            $table->foreignId('ma_sinh_vien')->constrained('sinh_vien')->cascadeOnDelete();
            $table->foreignId('ma_may_tinh')->nullable()->constrained('may_tinh')->nullOnDelete();
            $table->timestamp('thoi_gian_check_in')->nullable();
            $table->string('trang_thai')->default('present')->index();
            $table->text('ghi_chu')->nullable();
            $table->timestamps();

            $table->unique(['ma_lich_su_dung', 'ma_sinh_vien'], 'diem_danh_lich_su_sinh_vien_unique');
        });

        Schema::create('phieu_muon_may', function (Blueprint $table) {
            $table->id();
            $table->string('ma_phieu_muon', 20)->unique();
            $table->foreignId('ma_giang_vien')->constrained('giang_vien')->restrictOnDelete();
            $table->foreignId('ma_phong_ban')->constrained('phong_ban')->restrictOnDelete();
            $table->foreignId('ma_phong')->constrained('phong_may')->restrictOnDelete();
            $table->dateTime('ngay_muon');
            $table->unsignedInteger('so_luong');
            $table->string('ly_do_muon')->nullable();
            $table->timestamps();
        });

        Schema::create('chi_tiet_muon_may', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ma_phieu_muon')->constrained('phieu_muon_may')->cascadeOnDelete();
            $table->foreignId('ma_may_tinh')->constrained('may_tinh')->restrictOnDelete();
            $table->string('tinh_trang_khi_muon')->nullable();
            $table->text('ghi_chu')->nullable();
            $table->timestamps();

            $table->unique(['ma_phieu_muon', 'ma_may_tinh'], 'chi_tiet_muon_may_unique');
        });

        Schema::create('phieu_tra_may', function (Blueprint $table) {
            $table->id();
            $table->string('ma_phieu_tra')->unique();
            $table->foreignId('ma_phieu_muon')->nullable()->constrained('phieu_muon_may')->nullOnDelete();
            $table->foreignId('ma_giang_vien')->nullable()->constrained('giang_vien')->nullOnDelete();
            $table->timestamp('thoi_gian_tra')->nullable()->index();
            $table->unsignedInteger('so_luong');
            $table->text('ghi_chu')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('chi_tiet_tra_may', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ma_phieu_tra')->constrained('phieu_tra_may')->cascadeOnDelete();
            $table->foreignId('ma_may_tinh')->constrained('may_tinh')->restrictOnDelete();
            $table->string('tinh_trang_khi_tra')->nullable();
            $table->text('ghi_chu')->nullable();
            $table->timestamps();

            $table->unique(['ma_phieu_tra', 'ma_may_tinh'], 'chi_tiet_tra_may_unique');
        });

        Schema::create('bao_cao_su_co', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ma_nguoi_bao_cao')->constrained('nguoi_dung')->cascadeOnDelete();
            $table->foreignId('ma_may_tinh')->nullable()->constrained('may_tinh')->nullOnDelete();
            $table->foreignId('ma_thiet_bi')->nullable()->constrained('thiet_bi')->nullOnDelete();
            $table->string('loai_su_co')->index();
            $table->string('tieu_de');
            $table->text('mo_ta')->nullable();
            $table->string('muc_do')->default('normal')->index();
            $table->string('trang_thai')->default('open')->index();
            $table->timestamps();
        });

        Schema::create('phieu_bao_tri', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ma_bao_cao_su_co')->constrained('bao_cao_su_co')->cascadeOnDelete();
            $table->string('loai_bao_tri')->index();
            $table->date('ngay_bat_dau');
            $table->date('ngay_ket_thuc')->nullable();
            $table->text('cach_xu_ly')->nullable();
            $table->decimal('chi_phi', 12, 2)->default(0);
            $table->string('trang_thai')->default('pending')->index();
            $table->timestamps();
        });

        Schema::create('nhat_ky_sua_chua', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ma_phieu_bao_tri')->nullable()->constrained('phieu_bao_tri')->nullOnDelete();
            $table->foreignId('ma_may_tinh')->nullable()->constrained('may_tinh')->nullOnDelete();
            $table->foreignId('ma_thiet_bi')->nullable()->constrained('thiet_bi')->nullOnDelete();
            $table->foreignId('ma_nguoi_sua')->nullable()->constrained('nguoi_dung')->nullOnDelete();
            $table->timestamp('thoi_gian_sua')->nullable()->index();
            $table->text('noi_dung_sua')->nullable();
            $table->string('ket_qua')->nullable();
            $table->decimal('chi_phi', 12, 2)->default(0);
            $table->timestamps();
        });

        Schema::create('lich_su_dieu_chuyen_may', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ma_may_tinh')->constrained('may_tinh')->cascadeOnDelete();
            $table->foreignId('ma_phong_cu')->nullable()->constrained('phong_may')->nullOnDelete();
            $table->foreignId('ma_phong_moi')->nullable()->constrained('phong_may')->nullOnDelete();
            $table->foreignId('ma_nguoi_dieu_chuyen')->nullable()->constrained('nguoi_dung')->nullOnDelete();
            $table->timestamp('thoi_gian_dieu_chuyen')->nullable()->index();
            $table->string('ly_do')->nullable();
            $table->text('ghi_chu')->nullable();
            $table->timestamps();
        });

    }

    /**
     * Xóa toàn bộ bảng theo thứ tự ngược để không lỗi khóa ngoại khi rollback.
     */
    public function down(): void
    {
        Schema::dropIfExists('ghi_nhan_may_giao_vien');
        Schema::dropIfExists('diem_danh');
        Schema::dropIfExists('lich_su_dung_phong_may');
        Schema::dropIfExists('lich_su_dieu_chuyen_may');
        Schema::dropIfExists('nhat_ky_sua_chua');
        Schema::dropIfExists('phieu_bao_tri');
        Schema::dropIfExists('bao_cao_su_co');
        Schema::dropIfExists('chi_tiet_tra_may');
        Schema::dropIfExists('phieu_tra_may');
        Schema::dropIfExists('chi_tiet_muon_may');
        Schema::dropIfExists('phieu_muon_may');
        Schema::dropIfExists('dat_phong_may');
        Schema::dropIfExists('chi_tiet_lop_hoc_phan');
        Schema::dropIfExists('phan_cong_giang_vien');
        Schema::dropIfExists('lop_hoc_phan');
        Schema::dropIfExists('thiet_bi');
        Schema::dropIfExists('chi_tiet_phieu_nhap_may');
        Schema::dropIfExists('phieu_nhap_may');
        Schema::dropIfExists('may_tinh');
        Schema::dropIfExists('tuan');
        Schema::dropIfExists('nam_hoc');
        Schema::dropIfExists('mon_hoc');
        Schema::dropIfExists('phong_may');
        Schema::dropIfExists('phong_ban');
        Schema::dropIfExists('sinh_vien');
        Schema::dropIfExists('lop_hoc');
        Schema::dropIfExists('giang_vien');
        Schema::dropIfExists('personal_access_tokens');
        Schema::dropIfExists('nguoi_dung');
        Schema::dropIfExists('vai_tro');
    }
};
