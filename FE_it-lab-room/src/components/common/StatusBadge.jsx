const styles = {
  "Hoạt động": "bg-emerald-100 text-emerald-700",
  "Sẵn sàng": "bg-sky-100 text-sky-700",
  "Đang sử dụng": "bg-indigo-100 text-indigo-700",
  "Bảo trì": "bg-amber-100 text-amber-700",
  "Hỏng": "bg-rose-100 text-rose-700",
  "Chờ xử lý": "bg-amber-100 text-amber-700",
  "Chờ tiếp nhận": "bg-amber-100 text-amber-700",
  "Đã tiếp nhận": "bg-blue-100 text-blue-700",
  "Đang xử lý": "bg-blue-100 text-blue-700",
  "Đã xử lý": "bg-emerald-100 text-emerald-700",
  "Đang sửa": "bg-blue-100 text-blue-700",
  "Hoàn thành": "bg-emerald-100 text-emerald-700",
  "Từ chối": "bg-rose-100 text-rose-700",
  "Thấp": "bg-slate-100 text-slate-700",
  "Trung bình": "bg-amber-100 text-amber-700",
  "Cao": "bg-rose-100 text-rose-700",
  "Tạm khóa": "bg-gray-200 text-gray-700",
  "Có mặt": "bg-emerald-100 text-emerald-700",
  "Đã điểm danh": "bg-emerald-100 text-emerald-700",
  "Đi trễ": "bg-amber-100 text-amber-700",
  "Chưa điểm danh": "bg-amber-100 text-amber-700",
  "Chưa mở": "bg-slate-100 text-slate-700",
  "Đang mở": "bg-emerald-100 text-emerald-700",
  "Đã đóng": "bg-slate-200 text-slate-700",
  "Có dữ liệu": "bg-emerald-100 text-emerald-700",
  "Chưa có dữ liệu": "bg-slate-100 text-slate-700",
  "Vắng": "bg-rose-100 text-rose-700",
  "Đang mượn": "bg-indigo-100 text-indigo-700",
  "Đã trả": "bg-emerald-100 text-emerald-700",
  "Tạm dừng": "bg-amber-100 text-amber-700",
  "Đang dùng": "bg-emerald-100 text-emerald-700",
  "Ngừng dùng": "bg-slate-200 text-slate-700",
};

export default function StatusBadge({ value }) {
  return (
    <span className={`inline-flex min-w-[86px] justify-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${styles[value] || "bg-slate-100 text-slate-700"}`}>
      {value}
    </span>
  );
}
