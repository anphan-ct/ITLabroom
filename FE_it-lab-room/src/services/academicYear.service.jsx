import { CONST_APIS } from "../constants/apis.constant";
import { CONST_METHODS } from "../constants/methods.constant";
import { fetcher } from "../helpers/fetcher.helper";

export function getAcademicYearsFromApi(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = queryString
    ? `${CONST_APIS.ACADEMIC_YEARS.INDEX}?${queryString}`
    : CONST_APIS.ACADEMIC_YEARS.INDEX;

  return fetcher(endpoint, {
    method: CONST_METHODS.GET,
  });
}

export function createAcademicYearFromApi(payload) {
  return fetcher(CONST_APIS.ACADEMIC_YEARS.STORE, {
    method: CONST_METHODS.POST,
    body: payload,
  });
}

export function getAcademicYearFromApi(id) {
  return fetcher(CONST_APIS.ACADEMIC_YEARS.SHOW(id), {
    method: CONST_METHODS.GET,
  });
}

export function updateAcademicYearFromApi(id, payload) {
  return fetcher(CONST_APIS.ACADEMIC_YEARS.UPDATE(id), {
    method: CONST_METHODS.PUT,
    body: payload,
  });
}

export function deleteAcademicYearFromApi(id) {
  return fetcher(CONST_APIS.ACADEMIC_YEARS.DESTROY(id), {
    method: CONST_METHODS.DELETE,
  });
}
