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
  hang_cpu: "Intel",
  ma_cpu: "",
  hang_ram: "",
  dung_luong_ram: "8GB",
  card_do_hoa: "",
  ten_card_roi: "",
  bo_mach_chu: "",
  hang_man_hinh: "",
  ban_phim: "",
  chuot: "",
  hdd: "",
  ssd: "",
  ghi_chu: "",
};

const cpuBrands = ["Intel", "AMD", "Apple M"];
const ramCapacities = ["4GB", "8GB", "16GB", "32GB", "64GB"];
const graphicCardOptions = ["Card Onboard", "Card Rời"];
const hddCapacities = ["500GB", "1TB", "2TB"];
const ssdCapacities = ["128GB", "256GB", "512GB", "1TB", "2TB"];

function joinText(...parts) {
  return parts.map((part) => part.trim()).filter(Boolean).join(" ");
}

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

function getGraphicCardName(form) {
  if (form.card_do_hoa !== "Card Rời") {
    return form.card_do_hoa;
  }

  return joinText(form.card_do_hoa, form.ten_card_roi);
}

function buildConfigSummary(form) {
  const cpu = joinText(form.hang_cpu, form.ma_cpu);
  const ram = joinText(form.hang_ram, form.dung_luong_ram);
  const graphicCard = getGraphicCardName(form);
  const monitor = form.hang_man_hinh.trim();

  return [
    cpu && `CPU: ${cpu}`,
    ram && `RAM: ${ram}`,
    graphicCard && `VGA: ${graphicCard}`,
    form.bo_mach_chu && `Bo mạch chủ: ${form.bo_mach_chu}`,
    monitor && `Màn hình: ${monitor}`,
    form.hdd && `HDD: ${form.hdd}`,
    form.ssd && `SSD: ${form.ssd}`,
    form.ban_phim && `Bàn phím: ${form.ban_phim}`,
    form.chuot && `Chuột: ${form.chuot}`,
  ].filter(Boolean).join(" | ");
}

function buildComputerNote(form) {
  return [
    form.nha_cung_cap && `Nhà cung cấp: ${form.nha_cung_cap.trim()}`,
    buildConfigSummary(form) && `Cấu hình: ${buildConfigSummary(form)}`,
    form.ghi_chu && `Ghi chú: ${form.ghi_chu.trim()}`,
  ].filter(Boolean).join("\n");
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

    Promise.all([getRoomsFromApi({ includeStorage: true }), getComputerImports(), generateComputerImportCode()])
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
      ...(name === "card_do_hoa" && value !== "Card Rời" ? { ten_card_roi: "" } : {}),
    }));
  };

  const buildPayload = () => ({
    ma_phieu_nhap: form.ma_phieu_nhap.trim().toUpperCase(),
    ngay_nhap: form.ngay_nhap,
    so_luong: Number(form.so_luong),
    ma_phong: Number(form.ma_phong),
    nha_cung_cap: cleanText(form.nha_cung_cap),
    bo_xu_ly: cleanText(joinText(form.hang_cpu, form.ma_cpu)),
    ram: cleanText(joinText(form.hang_ram, form.dung_luong_ram)),
    card_do_hoa: cleanText(getGraphicCardName(form)),
    bo_mach_chu: cleanText(form.bo_mach_chu),
    man_hinh: cleanText(form.hang_man_hinh),
    ban_phim: cleanText(form.ban_phim),
    chuot: cleanText(form.chuot),
    hdd: cleanText(form.hdd),
    ssd: cleanText(form.ssd),
    ghi_chu: cleanText(buildComputerNote(form)),
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

            <div className="grid gap-4 rounded-lg border border-blue-200 bg-white p-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <h3 className="text-sm font-bold text-blue-700">Cấu hình chung</h3>
              </div>

              <Field label="Hãng CPU">
                <SelectInput value={form.hang_cpu} onChange={(value) => handleChange("hang_cpu", value)}>
                  {cpuBrands.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </SelectInput>
              </Field>

              <Field label="Thế hệ / Mã CPU">
                <TextInput
                  value={form.ma_cpu}
                  onChange={(value) => handleChange("ma_cpu", value)}
                  placeholder="VD: Core i5 12400F"
                />
              </Field>

              <Field label="Hãng RAM">
                <TextInput
                  value={form.hang_ram}
                  onChange={(value) => handleChange("hang_ram", value)}
                  placeholder="VD: Kingston"
                />
              </Field>

              <Field label="Dung lượng RAM">
                <SelectInput value={form.dung_luong_ram} onChange={(value) => handleChange("dung_luong_ram", value)}>
                  {ramCapacities.map((capacity) => (
                    <option key={capacity} value={capacity}>{capacity}</option>
                  ))}
                </SelectInput>
              </Field>

              <div className={form.card_do_hoa === "Card Rời" ? "" : "sm:col-span-2"}>
                <Field label="Card đồ họa">
                  <SelectInput value={form.card_do_hoa} onChange={(value) => handleChange("card_do_hoa", value)}>
                    <option value="">Chọn card đồ họa</option>
                    {graphicCardOptions.map((card) => (
                      <option key={card} value={card}>{card}</option>
                    ))}
                  </SelectInput>
                </Field>
              </div>

              {form.card_do_hoa === "Card Rời" && (
                <Field label="Tên Card Rời">
                  <TextInput
                    value={form.ten_card_roi}
                    onChange={(value) => handleChange("ten_card_roi", value)}
                    placeholder="VD: RTX 3060"
                  />
                </Field>
              )}

              <div className="sm:col-span-2">
                <Field label="Bo mạch chủ">
                  <TextInput
                    value={form.bo_mach_chu}
                    onChange={(value) => handleChange("bo_mach_chu", value)}
                    placeholder="VD: H610M"
                  />
                </Field>
              </div>

              <div className="sm:col-span-2">
                <Field label="Màn hình">
                  <TextInput
                    value={form.hang_man_hinh}
                    onChange={(value) => handleChange("hang_man_hinh", value)}
                    placeholder="VD: Dell"
                  />
                </Field>
              </div>

              <Field label="HDD">
                <SelectInput value={form.hdd} onChange={(value) => handleChange("hdd", value)}>
                  <option value="">Không có HDD</option>
                  {hddCapacities.map((capacity) => (
                    <option key={capacity} value={capacity}>{capacity}</option>
                  ))}
                </SelectInput>
              </Field>

              <Field label="SSD">
                <SelectInput value={form.ssd} onChange={(value) => handleChange("ssd", value)}>
                  <option value="">Không có SSD</option>
                  {ssdCapacities.map((capacity) => (
                    <option key={capacity} value={capacity}>{capacity}</option>
                  ))}
                </SelectInput>
              </Field>

              <Field label="Bàn phím">
                <TextInput
                  value={form.ban_phim}
                  onChange={(value) => handleChange("ban_phim", value)}
                  placeholder="VD: HP"
                />
              </Field>

              <Field label="Chuột">
                <TextInput
                  value={form.chuot}
                  onChange={(value) => handleChange("chuot", value)}
                  placeholder="VD: HP"
                />
              </Field>

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
