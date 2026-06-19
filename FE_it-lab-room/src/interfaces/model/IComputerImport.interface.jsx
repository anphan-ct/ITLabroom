/**
 * @typedef {import("./IComputer.interface").IComputer} IComputer
 */

/**
 * @typedef {Object} IComputerImportDetail
 * @property {number} id
 * @property {number} ma_phieu_nhap
 * @property {number} ma_may_tinh
 * @property {string|null} ghi_chu
 * @property {IComputer|null} may_tinh
 */

/**
 * @typedef {Object} IComputerImport
 * @property {number} id
 * @property {string} ma_phieu_nhap
 * @property {string} ngay_nhap
 * @property {number} so_luong
 * @property {string|null} nha_cung_cap
 * @property {string|null} ghi_chu
 * @property {IComputerImportDetail[]} [chi_tiet]
 */

/**
 * @typedef {Object} IComputerImportPayload
 * @property {string} ma_phieu_nhap
 * @property {string} ngay_nhap
 * @property {number} so_luong
 * @property {number|string} ma_phong
 * @property {string|null} [nha_cung_cap]
 * @property {string|null} [bo_xu_ly]
 * @property {string|null} [ram]
 * @property {string|null} [card_do_hoa]
 * @property {string|null} [bo_mach_chu]
 * @property {string|null} [man_hinh]
 * @property {string|null} [ban_phim]
 * @property {string|null} [chuot]
 * @property {string|null} [hdd]
 * @property {string|null} [ssd]
 * @property {string|null} [ghi_chu]
 */

/**
 * @typedef {import("../common/IResponse.interface").IResponse<IComputerImport[]>} IResponseComputerImportList
 * @typedef {import("../common/IResponse.interface").IResponse<IComputerImport>} IResponseComputerImportDetail
 */

export {};
