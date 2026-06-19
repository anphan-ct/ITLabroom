import { CONST_APIS } from "../constants/apis.constant";
import { CONST_METHODS } from "../constants/methods.constant";
import { fetcher } from "../helpers/fetcher.helper";

export function getRoomsFromApi() {
  return fetcher(CONST_APIS.ROOMS.INDEX, {
    method: CONST_METHODS.GET,
  });
}

export function deleteRoomFromApi(id) {
  return fetcher(CONST_APIS.ROOMS.DESTROY(id), {
    method: CONST_METHODS.DELETE,
  });
}
