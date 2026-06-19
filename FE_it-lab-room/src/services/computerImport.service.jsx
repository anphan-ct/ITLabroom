import { CONST_APIS } from "../constants/apis.constant";
import { CONST_METHODS } from "../constants/methods.constant";
import { fetcher } from "../helpers/fetcher.helper";

/**
 * @returns {Promise<import("../interfaces/model/IComputerImport.interface").IResponseComputerImportList>}
 */
export function getComputerImports() {
  return fetcher(CONST_APIS.COMPUTER_IMPORTS.INDEX, {
    method: CONST_METHODS.GET,
  });
}

/**
 * @param {import("../interfaces/model/IComputerImport.interface").IComputerImportPayload} payload
 * @returns {Promise<import("../interfaces/model/IComputerImport.interface").IResponseComputerImportDetail>}
 */
export function createComputerImport(payload) {
  return fetcher(CONST_APIS.COMPUTER_IMPORTS.STORE, {
    method: CONST_METHODS.POST,
    body: payload,
  });
}

/**
 * @param {number|string} id
 * @returns {Promise<import("../interfaces/model/IComputerImport.interface").IResponseComputerImportDetail>}
 */
export function getComputerImport(id) {
  return fetcher(CONST_APIS.COMPUTER_IMPORTS.SHOW(id), {
    method: CONST_METHODS.GET,
  });
}
