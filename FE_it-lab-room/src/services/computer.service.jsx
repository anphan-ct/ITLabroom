import { CONST_APIS } from "../constants/apis.constant";
import { CONST_METHODS } from "../constants/methods.constant";
import { fetcher } from "../helpers/fetcher.helper";

/**
 * @returns {Promise<import("../interfaces/model/IComputer.interface").IResponseComputerList>}
 */
export function getComputersFromApi() {
  return fetcher(CONST_APIS.COMPUTERS.INDEX, {
    method: CONST_METHODS.GET,
  });
}

/**
 * @param {number|string} id
 * @returns {Promise<import("../interfaces/model/IComputer.interface").IResponseComputerDetail>}
 */
export function getComputerFromApi(id) {
  return fetcher(CONST_APIS.COMPUTERS.SHOW(id), {
    method: CONST_METHODS.GET,
  });
}

/**
 * @param {number|string} id
 * @returns {Promise<import("../interfaces/model/IComputer.interface").IResponseComputerDelete>}
 */
export function deleteComputerFromApi(id) {
  return fetcher(CONST_APIS.COMPUTERS.DESTROY(id), {
    method: CONST_METHODS.DELETE,
  });
}
