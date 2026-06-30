import { CONST_APIS } from "../constants/apis.constant";
import { CONST_METHODS } from "../constants/methods.constant";
import { fetcher } from "../helpers/fetcher.helper";

// Lấy danh sách lịch sử điều chuyển máy tính
export function getComputerTransfers() {
  return fetcher(CONST_APIS.COMPUTER_TRANSFERS.INDEX, {
    method: CONST_METHODS.GET,
  });
}

// Tạo điều chuyển máy tính mới (cập nhật phòng + ghi log)
export function transferComputer(payload) {
  return fetcher(CONST_APIS.COMPUTER_TRANSFERS.STORE, {
    method: CONST_METHODS.POST,
    body: payload,
  });
}
