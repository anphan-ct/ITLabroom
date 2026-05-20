/**
 * @typedef {'admin' | 'student' | 'teacher'} AuthRole
 */

/**
 * @typedef {Object} LoginPayload
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} AuthRoleInfo
 * @property {number} id
 * @property {string} role_name
 * @property {string|null} description
 */

/**
 * @typedef {Object} AuthStudentProfile
 * @property {number} id
 * @property {string} student_code
 * @property {number|null} class_id
 * @property {string|null} course_year
 * @property {boolean} is_class_monitor
 */

/**
 * @typedef {Object} AuthTeacherProfile
 * @property {number} id
 * @property {string} teacher_code
 * @property {string|null} department
 */

/**
 * @typedef {Object} AuthUser
 * @property {number} id
 * @property {string} full_name
 * @property {string} email
 * @property {string|null} phone
 * @property {string|null} gender
 * @property {string|null} date_of_birth
 * @property {string|null} address
 * @property {number} status
 * @property {AuthRoleInfo|null} role
 * @property {AuthStudentProfile|null} [student]
 * @property {AuthTeacherProfile|null} [teacher]
 */

/**
 * @typedef {Object} AuthData
 * @property {string} token_type
 * @property {string} access_token
 * @property {AuthUser} user
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} status
 * @property {string} message
 * @property {number} error_code
 * @property {*} data
 */

export const AUTH_ROLES = {
  ADMIN: "admin",
  STUDENT: "student",
  TEACHER: "teacher",
};
