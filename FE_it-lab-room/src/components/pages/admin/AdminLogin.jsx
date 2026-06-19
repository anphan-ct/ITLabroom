import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { AUTH_ROLES } from "../../../constants/roles.constant";
import { loginByRole, saveAuthSession, loginWithGoogleAPI } from "../../../services/auth.service";
import { GoogleLogin } from "@react-oauth/google";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await loginByRole(AUTH_ROLES.ADMIN, formData);
      saveAuthSession(AUTH_ROLES.ADMIN, response.data);
      navigate("/admin", { replace: true });
    } catch (error) {
      setErrorMessage(error.message || "Đăng nhập admin thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hàm xử lý khi Google trả về token thành công cho Admin
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setErrorMessage('');
      const res = await loginWithGoogleAPI(credentialResponse.credential, 'admin');

      if (res.status) {
        // Response đã chuẩn hóa: res.data chứa { token_type, access_token, user }
        saveAuthSession(AUTH_ROLES.ADMIN, res.data);
        navigate('/admin', { replace: true });
      }
    } catch (error) {
      setErrorMessage(error.message || 'Đăng nhập Google admin thất bại.');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <main className="flex w-full items-center justify-center px-4 py-10">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl md:grid-cols-[0.9fr_1.1fr]">
          <div className="hidden border-r border-slate-200 bg-slate-950 p-8 text-white md:block">
            <div className="inline-flex items-center gap-2 rounded-lg border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-100">
              <ShieldCheck size={18} />
              Khu vực quản trị
            </div>

            <h1 className="mt-8 text-3xl font-bold leading-tight">
              Điều phối phòng máy, thiết bị và lịch sử dụng
            </h1>
            <div className="mt-8 space-y-3 text-sm text-slate-300">
              <p>Quản lý người dùng, lớp học, môn học và phòng máy.</p>
              <p>Theo dõi tình trạng máy, cấu hình và phiếu bảo trì.</p>
              <p>Cập nhật lịch phòng theo ca để tránh trùng lịch.</p>
            </div>
          </div>

          <div className="p-8 md:p-10">
            <div className="mb-8 rounded-lg bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
              Chỉ dành cho tài khoản quản trị viên
            </div>

            <h2 className="text-2xl font-bold text-slate-900">
              Đăng nhập Admin
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Nhập email quản trị và mật khẩu để vào trang quản lý hệ thống.
            </p>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              {errorMessage && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {errorMessage}
                </div>
              )}

              <input
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                name="email"
                onChange={handleChange}
                placeholder="Email admin"
                type="email"
                value={formData.email}
              />
              <input
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                name="password"
                onChange={handleChange}
                placeholder="Mật khẩu admin"
                type="password"
                value={formData.password}
              />

              <button
                className="block w-full rounded-xl bg-slate-900 px-4 py-3 text-center font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập vào Admin Portal"}
              </button>
            </form>


            {/* Ngăn cách */}
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="px-3 text-gray-500">Hoặc</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* NÚT ĐĂNG NHẬP GOOGLE CHO ADMIN */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setErrorMessage('Đăng nhập Google thất bại. Vui lòng thử lại.')}
                useOneTap
                shape="rectangular"
                theme="outline"
              />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
