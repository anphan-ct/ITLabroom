import { CONST_APIS } from "../constants/apis.constant";
import { CONST_METHODS } from "../constants/methods.constant";
import { fetcher } from "../helpers/fetcher.helper";

export function getClassesFromApi() {
  return fetcher(CONST_APIS.CLASSES.INDEX, {
    method: CONST_METHODS.GET,
  });
}

export function getClassOptionsFromApi() {
  return fetcher(CONST_APIS.CLASSES.OPTIONS, {
    method: CONST_METHODS.GET,
  });
}

export function createClassFromApi(payload) {
  return fetcher(CONST_APIS.CLASSES.STORE, {
    method: CONST_METHODS.POST,
    body: payload,
  });
}

export function getClassFromApi(id) {
  return fetcher(CONST_APIS.CLASSES.SHOW(id), {
    method: CONST_METHODS.GET,
  });
}

export function getClassStudentsFromApi(id, params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = queryString
    ? `${CONST_APIS.CLASSES.STUDENTS(id)}?${queryString}`
    : CONST_APIS.CLASSES.STUDENTS(id);

  return fetcher(endpoint, {
    method: CONST_METHODS.GET,
  });
}

export function getClassStudentOptionsFromApi(id) {
  return fetcher(CONST_APIS.CLASSES.STUDENT_OPTIONS(id), {
    method: CONST_METHODS.GET,
  });
}

export function addClassStudentFromApi(id, payload) {
  return fetcher(CONST_APIS.CLASSES.STUDENTS(id), {
    method: CONST_METHODS.POST,
    body: payload,
  });
}

export function updateClassStudentFromApi(classId, studentId, payload) {
  return fetcher(CONST_APIS.CLASSES.STUDENT_DETAIL(classId, studentId), {
    method: CONST_METHODS.PUT,
    body: payload,
  });
}

export function deleteClassStudentFromApi(classId, studentId) {
  return fetcher(CONST_APIS.CLASSES.STUDENT_DETAIL(classId, studentId), {
    method: CONST_METHODS.DELETE,
  });
}

export function updateClassFromApi(id, payload) {
  return fetcher(CONST_APIS.CLASSES.UPDATE(id), {
    method: CONST_METHODS.PUT,
    body: payload,
  });
}

export function deleteClassFromApi(id) {
  return fetcher(CONST_APIS.CLASSES.DESTROY(id), {
    method: CONST_METHODS.DELETE,
  });
}
