import { CONST_APIS } from "../constants/apis.constant";
import { CONST_METHODS } from "../constants/methods.constant";
import { fetcher } from "../helpers/fetcher.helper";

export function getSubjectsFromApi() {
  return fetcher(CONST_APIS.SUBJECTS.INDEX, {
    method: CONST_METHODS.GET,
  });
}

export function createSubjectFromApi(payload) {
  return fetcher(CONST_APIS.SUBJECTS.STORE, {
    method: CONST_METHODS.POST,
    body: payload,
  });
}

export function getSubjectFromApi(id) {
  return fetcher(CONST_APIS.SUBJECTS.SHOW(id), {
    method: CONST_METHODS.GET,
  });
}

export function updateSubjectFromApi(id, payload) {
  return fetcher(CONST_APIS.SUBJECTS.UPDATE(id), {
    method: CONST_METHODS.PUT,
    body: payload,
  });
}

export function deleteSubjectFromApi(id) {
  return fetcher(CONST_APIS.SUBJECTS.DESTROY(id), {
    method: CONST_METHODS.DELETE,
  });
}
