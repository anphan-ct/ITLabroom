import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import { AUTH_ROLES } from "../../../constants/roles.constant";
import { loginByRole, saveAuthSession } from "../../../services/auth.service";

export default function StudentLogin() {
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
      const response = await loginByRole(AUTH_ROLES.STUDENT, formData);
      saveAuthSession(AUTH_ROLES.STUDENT, response.data);
      navigate("/student", { replace: true });
    } catch (error) {
      setErrorMessage(error.message || "Đăng nhập sinh viên thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <main className="flex flex-1 items-center justify-center bg-slate-100 px-4 py-10">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl md:grid-cols-[0.9fr_1.1fr]">
          <div className="hidden border-r border-slate-200 bg-slate-50 p-8 md:block">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
              Cổng sinh viên
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">
              Theo dõi lịch thực hành và tình trạng phòng máy
            </h1>
            <div className="mt-8 space-y-3 text-sm text-slate-600">
              <p>Tra cứu lịch học theo tuần, phòng và ca học.</p>
              <p>Xem máy được phân công, tình trạng thiết bị.</p>
              <p>Gửi báo hỏng và theo dõi điểm danh cá nhân.</p>
            </div>
          </div>

          <div className="p-8 md:p-10">
            <h2 className="text-2xl font-bold text-slate-900">
              Đăng nhập sinh viên
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Sử dụng tài khoản được cấp để truy cập hệ thống phòng máy.
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
                placeholder="Email sinh viên"
                type="email"
                value={formData.email}
              />
              <input
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                name="password"
                onChange={handleChange}
                placeholder="Mật khẩu"
                type="password"
                value={formData.password}
              />

              <button
                className="block w-full rounded-xl bg-blue-600 px-4 py-3 text-center font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </form>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
