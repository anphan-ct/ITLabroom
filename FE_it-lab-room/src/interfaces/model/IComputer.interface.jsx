/**
 * @typedef {Object} IComputerRoom
 * @property {number} id
 * @property {string} ma_phong
 * @property {string} ten_phong
 */

/**
 * @typedef {Object} IComputer
 * @property {number} id
 * @property {number} ma_phong
 * @property {string} ma_may
 * @property {string} ten_may
 * @property {string|null} vi_tri
 * @property {string|null} ma_qr
 * @property {string|null} bo_xu_ly
 * @property {string|null} ram
 * @property {string|null} card_do_hoa
 * @property {string|null} bo_mach_chu
 * @property {string|null} man_hinh
 * @property {string|null} ban_phim
 * @property {string|null} chuot
 * @property {string|null} hdd
 * @property {string|null} ssd
 * @property {string} trang_thai
 * @property {string|null} ghi_chu
 * @property {IComputerRoom|null} [phong]
 */

/**
 * @typedef {import("../common/IResponse.interface").IResponse<IComputer[]>} IResponseComputerList
 * @typedef {import("../common/IResponse.interface").IResponse<IComputer>} IResponseComputerDetail
 * @typedef {import("../common/IResponse.interface").IResponse<string>} IResponseComputerDelete
 */

export {};
