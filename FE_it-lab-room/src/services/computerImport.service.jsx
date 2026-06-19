import { CONST_APIS } from "../constants/apis.constant";
import { CONST_METHODS } from "../constants/methods.constant";
import { fetcher } from "../helpers/fetcher.helper";

export function getComputerImports() {
  return fetcher(CONST_APIS.COMPUTER_IMPORTS.INDEX, {
    method: CONST_METHODS.GET,
  });
}

export function createComputerImport(payload) {
  return fetcher(CONST_APIS.COMPUTER_IMPORTS.STORE, {
    method: CONST_METHODS.POST,
    body: payload,
  });
}

export function generateComputerImportCode() {
  return fetcher(CONST_APIS.COMPUTER_IMPORTS.CODE, {
    method: CONST_METHODS.GET,
  });
}

export function getComputerImport(id) {
  return fetcher(CONST_APIS.COMPUTER_IMPORTS.SHOW(id), {
    method: CONST_METHODS.GET,
  });
}
