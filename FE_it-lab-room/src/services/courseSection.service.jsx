import { CONST_APIS } from "../constants/apis.constant";
import { CONST_METHODS } from "../constants/methods.constant";
import { fetcher } from "../helpers/fetcher.helper";

export function getCourseSectionsFromApi() {
  return fetcher(CONST_APIS.COURSE_SECTIONS.INDEX, {
    method: CONST_METHODS.GET,
  });
}

export function getCourseSectionOptionsFromApi() {
  return fetcher(CONST_APIS.COURSE_SECTIONS.OPTIONS, {
    method: CONST_METHODS.GET,
  });
}

export function createCourseSectionFromApi(payload) {
  return fetcher(CONST_APIS.COURSE_SECTIONS.STORE, {
    method: CONST_METHODS.POST,
    body: payload,
  });
}

export function getCourseSectionFromApi(id) {
  return fetcher(CONST_APIS.COURSE_SECTIONS.SHOW(id), {
    method: CONST_METHODS.GET,
  });
}

export function updateCourseSectionFromApi(id, payload) {
  return fetcher(CONST_APIS.COURSE_SECTIONS.UPDATE(id), {
    method: CONST_METHODS.PUT,
    body: payload,
  });
}

export function deleteCourseSectionFromApi(id) {
  return fetcher(CONST_APIS.COURSE_SECTIONS.DESTROY(id), {
    method: CONST_METHODS.DELETE,
  });
}

export function getCourseSectionStudentsFromApi(id, params = {}) {
  const query = new URLSearchParams(params).toString();

  return fetcher(`${CONST_APIS.COURSE_SECTIONS.STUDENTS(id)}${query ? `?${query}` : ""}`, {
    method: CONST_METHODS.GET,
  });
}

export function getCourseSectionStudentOptionsFromApi(id) {
  return fetcher(CONST_APIS.COURSE_SECTIONS.STUDENT_OPTIONS(id), {
    method: CONST_METHODS.GET,
  });
}

export function addCourseSectionStudentFromApi(id, payload) {
  return fetcher(CONST_APIS.COURSE_SECTIONS.STUDENTS(id), {
    method: CONST_METHODS.POST,
    body: payload,
  });
}

export function updateCourseSectionStudentFromApi(courseSectionId, studentDetailId, payload) {
  return fetcher(CONST_APIS.COURSE_SECTIONS.STUDENT_DETAIL(courseSectionId, studentDetailId), {
    method: CONST_METHODS.PUT,
    body: payload,
  });
}

export function deleteCourseSectionStudentFromApi(courseSectionId, studentDetailId) {
  return fetcher(CONST_APIS.COURSE_SECTIONS.STUDENT_DETAIL(courseSectionId, studentDetailId), {
    method: CONST_METHODS.DELETE,
  });
}

export function deleteCourseSectionStudentByStudentFromApi(courseSectionId, studentId) {
  return fetcher(CONST_APIS.COURSE_SECTIONS.STUDENT_BY_STUDENT(courseSectionId, studentId), {
    method: CONST_METHODS.DELETE,
  });
}
