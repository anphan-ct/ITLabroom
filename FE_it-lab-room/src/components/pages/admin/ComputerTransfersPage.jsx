import { useEffect, useMemo, useState } from "react";
import { ArrowRightLeft, Search } from "lucide-react";
import AppShell from "../../common/AppShell";
import DataTable from "../../common/DataTable";
import SectionCard from "../../common/SectionCard";
import { getAuthSession } from "../../../services/auth.service";
import { getComputersFromApi } from "../../../services/computer.service";
import { getRoomsFromApi } from "../../../services/room.service";
import { getComputerTransfers, transferComputer } from "../../../services/computerTransfer.service";
import { Field, SelectInput, TextInput } from "./adminFormControls";

// Form mặc định khi khởi tạo hoặc reset
const defaultForm = { ma_may_tinh: "", ma_phong_moi: "", ly_do: "", ghi_chu: "" };

function getApiErrorMessage(error) {
  const validationErrors = error.payload?.data;

  if (validationErrors && typeof validationErrors === "object") {
    const firstMessages = Object.values(validationErrors)[0];

    if (Array.isArray(firstMessages) && firstMessages[0]) {
      return firstMessages[0];
    }
  }

  return error.message || "Không thể thực hiện điều chuyển.";
}

function formatDateTime(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);

  // Trả về định dạng DD/MM/YYYY HH:mm
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Map dữ liệu API trả về thành dạng hiển thị trên DataTable.
 */
function mapTransferItem(item) {
  return {
    id: item.id,
    computer: item.may_tinh ? `${item.may_tinh.ma_may} - ${item.may_tinh.ten_may}` : "",
    fromRoom: item.phong_cu ? `${item.phong_cu.ma_phong} - ${item.phong_cu.ten_phong}` : "",
    toRoom: item.phong_moi ? `${item.phong_moi.ma_phong} - ${item.phong_moi.ten_phong}` : "",
    movedBy: item.nguoi_dieu_chuyen?.ho_ten || "",
    movedAt: formatDateTime(item.thoi_gian_dieu_chuyen),
    reason: item.ly_do || "",
    note: item.ghi_chu || "",
  };
}

export default function ComputerTransfersPage() {
  // Mã người điều chuyển (ma_nguoi_dieu_chuyen) lấy từ tài khoản admin đang đăng nhập, không cho nhập tay.
  const currentAdmin = getAuthSession()?.user;

  // State dữ liệu từ API
  const [computers, setComputers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [transfers, setTransfers] = useState([]);

  // State form và trạng thái submit
  const [form, setForm] = useState(defaultForm);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  // Load dữ liệu ban đầu từ API khi component mount
  useEffect(() => {
    let isMounted = true;

    Promise.all([getComputersFromApi(), getRoomsFromApi(), getComputerTransfers()])
      .then(([computersRes, roomsRes, transfersRes]) => {
        if (!isMounted) return;

        const nextComputers = computersRes.data || [];
        const nextRooms = roomsRes.data || [];
        const nextTransfers = (transfersRes.data || []).map(mapTransferItem);

        setComputers(nextComputers);
        setRooms(nextRooms);
        setTransfers(nextTransfers);

        // Tự chọn máy tính đầu tiên nếu có
        if (nextComputers.length > 0) {
          setForm((currentForm) => ({
            ...currentForm,
            ma_may_tinh: currentForm.ma_may_tinh || nextComputers[0].id.toString(),
          }));
        }
      })
      .catch(() => {
        if (isMounted) {
          setFormError("Không thể tải dữ liệu từ cơ sở dữ liệu.");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Tìm máy tính đang được chọn để xác định phòng cũ
  const selectedComputer = computers.find(
    (computer) => computer.id.toString() === form.ma_may_tinh
  );

  // Phòng cũ (ma_phong_cu) suy ra từ phòng hiện tại của máy, không để admin tự chọn tránh sai lệch dữ liệu.
  const currentRoomId = selectedComputer?.ma_phong;
  const currentRoom = rooms.find((room) => room.id === currentRoomId);
  const fromRoomLabel = currentRoom
    ? `${currentRoom.ma_phong} - ${currentRoom.ten_phong}`
    : "Chưa xác định";

  // Phòng mới (ma_phong_moi) không được trùng phòng hiện tại của máy.
  const availableRooms = rooms.filter((room) => room.id !== currentRoomId);

  /**
   * Xử lý submit form: gọi transferComputer, hiển thị loading state ở button "Xác nhận",
   * catch error và hiển thị thông báo. Đóng modal và gọi hàm onSuccess để refresh danh sách nếu API trả về 200.
   */
  const submit = async (event) => {
    event.preventDefault();
    setFormError("");

    // Validate phía client trước khi gọi API
    if (!form.ma_may_tinh) {
      setFormError("Vui lòng chọn máy tính cần điều chuyển.");
      return;
    }

    if (!form.ma_phong_moi) {
      setFormError("Vui lòng chọn phòng mới.");
      return;
    }

    if (!form.ly_do.trim()) {
      setFormError("Vui lòng nhập lý do điều chuyển.");
      return;
    }

    if (!currentAdmin) {
      setFormError("Không xác định được tài khoản admin đang đăng nhập, vui lòng đăng nhập lại.");
      return;
    }

    // Hiển thị loading state ở button
    setIsSubmitting(true);

    try {
      // Gọi API tạo điều chuyển
      const response = await transferComputer({
        ma_may_tinh: Number(form.ma_may_tinh),
        ma_phong_moi: Number(form.ma_phong_moi),
        ly_do: form.ly_do.trim(),
        ghi_chu: form.ghi_chu.trim() || null,
      });

      // Thành công: thêm bản ghi mới vào đầu danh sách
      const newTransfer = mapTransferItem(response.data);
      setTransfers((currentTransfers) => [newTransfer, ...currentTransfers]);

      // Cập nhật lại ma_phong của máy tính trong state local để phòng cũ hiển thị đúng
      setComputers((currentComputers) =>
        currentComputers.map((computer) =>
          computer.id.toString() === form.ma_may_tinh
            ? { ...computer, ma_phong: Number(form.ma_phong_moi) }
            : computer
        )
      );

      // Reset form, giữ lại máy tính đã chọn
      setForm({ ...defaultForm, ma_may_tinh: form.ma_may_tinh });
      setFormError("");
    } catch (apiError) {
      // Hiển thị thông báo lỗi từ API
      setFormError(getApiErrorMessage(apiError));
    } finally {
      // Tắt loading state
      setIsSubmitting(false);
    }
  };

  // Lọc danh sách lịch sử theo từ khóa tìm kiếm
  const filteredTransfers = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return transfers.filter((item) => {
      const searchContent = [
        item.computer,
        item.fromRoom,
        item.toRoom,
        item.movedBy,
        item.movedAt,
        item.reason,
        item.note,
      ]
        .join(" ")
        .toLowerCase();
      return !keyword || searchContent.includes(keyword);
    });
  }, [transfers, searchKeyword]);

  return (
    <AppShell role="admin" title="Điều chuyển máy" subtitle="Theo dõi lịch sử chuyển máy giữa các phòng">
      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <SectionCard title="Tạo điều chuyển">
          <form onSubmit={submit} className="grid gap-4">
            {/* Chọn máy tính cần điều chuyển */}
            <Field label="Máy tính">
              <SelectInput
                value={form.ma_may_tinh}
                onChange={(value) => setForm({ ...form, ma_may_tinh: value, ma_phong_moi: "" })}
              >
                <option value="">Chọn máy tính</option>
                {computers.map((computer) => (
                  <option key={computer.id} value={computer.id}>
                    {computer.ma_may} - {computer.ten_may}
                  </option>
                ))}
              </SelectInput>
            </Field>

            {/* Phòng cũ hiển thị tự động, không cho chỉnh */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
              <span className="font-semibold text-slate-700">Phòng cũ: </span>
              <span className="text-slate-900">{fromRoomLabel}</span>
            </div>

            {/* Chọn phòng mới (đã loại phòng hiện tại) */}
            <Field label="Phòng mới">
              <SelectInput value={form.ma_phong_moi} onChange={(value) => setForm({ ...form, ma_phong_moi: value })}>
                <option value="">Chọn phòng mới</option>
                {availableRooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.ma_phong} - {room.ten_phong}
                  </option>
                ))}
              </SelectInput>
            </Field>

            {/* Người điều chuyển hiển thị tự động từ session */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
              <span className="font-semibold text-slate-700">Người điều chuyển: </span>
              <span className="text-slate-900">{currentAdmin?.full_name || currentAdmin?.ho_ten || "Chưa xác định"}</span>
            </div>

            {/* Lý do điều chuyển (bắt buộc) */}
            <Field label="Lý do">
              <TextInput
                value={form.ly_do}
                onChange={(value) => setForm({ ...form, ly_do: value })}
                placeholder="Lý do điều chuyển"
              />
            </Field>

            {/* Ghi chú (không bắt buộc) */}
            <Field label="Ghi chú">
              <TextInput
                value={form.ghi_chu}
                onChange={(value) => setForm({ ...form, ghi_chu: value })}
                placeholder="Ghi chú thêm (không bắt buộc)"
              />
            </Field>

            {/* Hiển thị lỗi nếu có */}
            {formError && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                {formError}
              </div>
            )}

            {/* Button submit với loading state */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              <ArrowRightLeft size={16} />
              {isSubmitting ? "Đang xử lý..." : "Xác nhận điều chuyển"}
            </button>
          </form>
        </SectionCard>

        {/* Bảng lịch sử điều chuyển */}
        <SectionCard
          title="Lịch sử điều chuyển"
          rightAction={
            <div className="relative">
              <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
                placeholder="Tìm điều chuyển"
                className="w-full min-w-[240px] rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100 sm:w-72"
              />
            </div>
          }
        >
          <DataTable
            columns={[
              { key: "computer", title: "Máy" },
              { key: "fromRoom", title: "Phòng cũ" },
              { key: "toRoom", title: "Phòng mới" },
              { key: "movedBy", title: "Người điều chuyển" },
              { key: "movedAt", title: "Thời gian" },
              { key: "reason", title: "Lý do" },
              { key: "note", title: "Ghi chú" },
            ]}
            data={filteredTransfers}
            emptyText="Chưa có lịch sử điều chuyển"
          />
        </SectionCard>
      </div>
    </AppShell>
  );
}