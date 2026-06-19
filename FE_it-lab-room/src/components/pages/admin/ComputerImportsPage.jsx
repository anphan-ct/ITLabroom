import { useEffect, useMemo, useState } from "react";
import { PackagePlus, Search } from "lucide-react";
import AppShell from "../../common/AppShell";
import DataTable from "../../common/DataTable";
import SectionCard from "../../common/SectionCard";
import { Field, SelectInput, TextInput } from "./adminFormControls";
import { createComputerImport, generateComputerImportCode, getComputerImports } from "../../../services/computerImport.service";
import { getRoomsFromApi } from "../../../services/room.service";

const defaultForm = {
  ma_phieu_nhap: "",
  ngay_nhap: "2026-05-30",
  so_luong: "1",
  ma_phong: "",
  nha_cung_cap: "",
  bo_xu_ly: "",
  ram: "",
  card_do_hoa: "",
  bo_mach_chu: "",
  man_hinh: "",
  ban_phim: "",
  chuot: "",
  hdd: "",
  ssd: "",
  ghi_chu: "",
};

const computerConfigFields = [
  { name: "bo_xu_ly", label: "CPU", placeholder: "VD: Intel Core i5" },
  { name: "ram", label: "RAM", placeholder: "VD: 8GB" },
  { name: "card_do_hoa", label: "Card đồ họa", placeholder: "VD: Intel UHD" },
  { name: "bo_mach_chu", label: "Bo mạch chủ", placeholder: "VD: H610M" },
  { name: "man_hinh", label: "Màn hình", placeholder: "VD: 21.5 inch" },
  { name: "ban_phim", label: "Bàn phím", placeholder: "VD: Logitech K120" },
  { name: "chuot", label: "Chuột", placeholder: "VD: Logitech B100" },
  { name: "hdd", label: "HDD", placeholder: "VD: 1TB" },
  { name: "ssd", label: "SSD", placeholder: "VD: 256GB" },
];

function getApiErrorMessage(error) {
  const validationErrors = error.payload?.data;

  if (validationErrors && typeof validationErrors === "object") {
    const firstMessages = Object.values(validationErrors)[0];

    if (Array.isArray(firstMessages) && firstMessages[0]) {
      return firstMessages[0];
    }
  }

  return error.message || "Không thể tạo phiếu nhập.";
}

function mapImportReceipt(item) {
  return {
    id: item.id,
    code: item.ma_phieu_nhap,
    date: item.ngay_nhap,
    quantity: item.so_luong,
    supplier: item.nha_cung_cap || "",
    note: item.ghi_chu || "",
  };
}

function mapImportReceipts(imports) {
  return imports.map(mapImportReceipt);
}

function cleanText(value) {
  return value.trim() || null;
}

export default function ComputerImportsPage() {
  const [receipts, setReceipts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    Promise.all([getRoomsFromApi(), getComputerImports(), generateComputerImportCode()])
      .then(([roomsResponse, importsResponse, codeResponse]) => {
        if (!isMounted) {
          return;
        }

        const nextRooms = roomsResponse.data || [];
        const nextReceipts = mapImportReceipts(importsResponse.data || []);

        setRooms(nextRooms);
        setReceipts(nextReceipts);
        setForm((currentForm) => ({
          ...currentForm,
          ma_phieu_nhap: codeResponse.data?.ma_phieu_nhap || "",
          ma_phong: currentForm.ma_phong || nextRooms[0]?.id?.toString() || "",
        }));
      })
      .catch(() => {
        if (isMounted) {
          setError("Không thể tải dữ liệu phiếu nhập từ cơ sở dữ liệu.");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (name, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const buildPayload = () => ({
    ma_phieu_nhap: form.ma_phieu_nhap.trim().toUpperCase(),
    ngay_nhap: form.ngay_nhap,
    so_luong: Number(form.so_luong),
    ma_phong: Number(form.ma_phong),
    nha_cung_cap: cleanText(form.nha_cung_cap),
    bo_xu_ly: cleanText(form.bo_xu_ly),
    ram: cleanText(form.ram),
    card_do_hoa: cleanText(form.card_do_hoa),
    bo_mach_chu: cleanText(form.bo_mach_chu),
    man_hinh: cleanText(form.man_hinh),
    ban_phim: cleanText(form.ban_phim),
    chuot: cleanText(form.chuot),
    hdd: cleanText(form.hdd),
    ssd: cleanText(form.ssd),
    ghi_chu: cleanText(form.ghi_chu),
  });

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.ma_phieu_nhap.trim() || !form.ngay_nhap) {
      setError("Vui lòng nhập mã phiếu và ngày nhập.");
      return;
    }

    if (!form.ma_phong) {
      setError("Vui lòng chọn phòng máy.");
      return;
    }

    if (Number(form.so_luong) <= 0) {
      setError("Số lượng máy nhập phải lớn hơn 0.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createComputerImport(buildPayload());
      const newReceipt = mapImportReceipt(response.data);
      const nextCodeResponse = await generateComputerImportCode();

      setReceipts((currentReceipts) => [newReceipt, ...currentReceipts]);
      setForm((currentForm) => ({
        ...defaultForm,
        ma_phieu_nhap: nextCodeResponse.data?.ma_phieu_nhap || "",
        ngay_nhap: currentForm.ngay_nhap,
        ma_phong: currentForm.ma_phong,
      }));
    } catch (apiError) {
      setError(getApiErrorMessage(apiError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredReceipts = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return receipts.filter((receipt) => {
      const searchContent = [
        receipt.code,
        receipt.date,
        receipt.quantity,
        receipt.supplier,
        receipt.note,
      ].join(" ").toLowerCase();

      return !keyword || searchContent.includes(keyword);
    });
  }, [receipts, searchKeyword]);

  return (
    <AppShell role="admin" title="Phiếu nhập máy" subtitle="Tạo và theo dõi phiếu nhập máy vào phòng máy">
      <div className="grid gap-6 xl:grid-cols-[minmax(420px,520px)_minmax(0,1fr)]">
        <SectionCard title="Tạo phiếu nhập">
          <form onSubmit={submit} className="grid gap-4">
            <div className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <h3 className="text-sm font-bold text-slate-900">Thông tin phiếu nhập</h3>
              </div>

              <Field label="Mã phiếu nhập">
                <TextInput
                  value={form.ma_phieu_nhap}
                  onChange={(value) => handleChange("ma_phieu_nhap", value)}
                  disabled
                />
              </Field>

              <Field label="Ngày nhập">
                <TextInput
                  type="date"
                  value={form.ngay_nhap}
                  onChange={(value) => handleChange("ngay_nhap", value)}
                />
              </Field>

              <Field label="Số lượng máy mới">
                <TextInput
                  type="number"
                  value={form.so_luong}
                  onChange={(value) => handleChange("so_luong", value)}
                />
              </Field>

              <Field label="Phòng máy">
                <SelectInput
                  value={form.ma_phong}
                  onChange={(value) => handleChange("ma_phong", value)}
                >
                  <option value="">Chọn phòng máy</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.ma_phong} - {room.ten_phong}
                    </option>
                  ))}
                </SelectInput>
              </Field>

              <Field label="Nhà cung cấp">
                <TextInput
                  value={form.nha_cung_cap}
                  onChange={(value) => handleChange("nha_cung_cap", value)}
                  placeholder="VD: Công ty ABC"
                />
              </Field>

              <div className="sm:col-span-2">
                <Field label="Ghi chú phiếu nhập">
                  <TextInput
                    value={form.ghi_chu}
                    onChange={(value) => handleChange("ghi_chu", value)}
                    placeholder="Ghi chú phiếu nhập"
                  />
                </Field>
              </div>
            </div>

            <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <h3 className="text-sm font-bold text-slate-900">Cấu hình máy nhập</h3>
              </div>

              {computerConfigFields.map((field) => (
                <Field key={field.name} label={field.label}>
                  <TextInput
                    value={form[field.name]}
                    onChange={(value) => handleChange(field.name, value)}
                    placeholder={field.placeholder}
                  />
                </Field>
              ))}
            </div>

            {error && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              <PackagePlus size={16} />
              {isSubmitting ? "Đang tạo..." : "Tạo phiếu nhập"}
            </button>
          </form>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard
            title="Danh sách phiếu nhập"
            rightAction={
              <div className="relative">
                <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={searchKeyword}
                  onChange={(event) => setSearchKeyword(event.target.value)}
                  placeholder="Tìm phiếu nhập"
                  className="w-full min-w-[240px] rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100 sm:w-72"
                />
              </div>
            }
          >
            <DataTable
              columns={[
                { key: "code", title: "Mã phiếu" },
                { key: "date", title: "Ngày nhập" },
                { key: "quantity", title: "Số lượng" },
                { key: "supplier", title: "Nhà cung cấp" },
                { key: "note", title: "Ghi chú" },
              ]}
              data={filteredReceipts}
              getRowLink={(receipt) => `/admin/computer-imports/${receipt.id}`}
              emptyText="Chưa có phiếu nhập trong cơ sở dữ liệu"
            />
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}
