import { CONST_APIS } from "../constants/apis.constant";
import { CONST_METHODS } from "../constants/methods.constant";
import { fetcher } from "../helpers/fetcher.helper";

export function getComputersFromApi() {
  return fetcher(CONST_APIS.COMPUTERS.INDEX, {
    method: CONST_METHODS.GET,
  });
}

export function getComputerFromApi(id) {
  return fetcher(CONST_APIS.COMPUTERS.SHOW(id), {
    method: CONST_METHODS.GET,
  });
}

export function updateComputerFromApi(id, payload) {
  return fetcher(CONST_APIS.COMPUTERS.UPDATE(id), {
    method: CONST_METHODS.PUT,
    body: payload,
  });
}

export function deleteComputerFromApi(id) {
  return fetcher(CONST_APIS.COMPUTERS.DESTROY(id), {
    method: CONST_METHODS.DELETE,
  });
}
