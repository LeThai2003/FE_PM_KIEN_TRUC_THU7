export const BASE_URL = "http://localhost:3000";
// export const BASE_URL = "http://localhost:3003";

const base_path = {
  auth: "auth",
  project: "project",
  task: "task",
  upload: "upload",
  search: "search",
  user: "user",
  comment: "comment",
  notification: "notification",
}

export const API_PATHS = {
  AUTH: {
    LOGIN: `/${base_path.auth}/login`,
    SIGNUP: `/${base_path.auth}/sign-up`,
    GOOGLE: `/${base_path.auth}/google`,
    PASSWORD_FORGOT: `/${base_path.auth}/password-forgot`,
    PASSWORD_OTP: `/${base_path.auth}/password-otp`,
    PASSWORD_RESET: `/${base_path.auth}/password-reset`,
    REFRESH_TOKEN: `/${base_path.auth}/refresh-token`,
    LOGOUT: `/${base_path.auth}/logout`
  },
  PROJECT: {
    CREATE: `/${base_path.project}/create`,
    UPDATE: `/${base_path.project}/update`,
    GET_ALL: `/${base_path.project}/get-all`,
    GET_DETAIL: (id) => `/${base_path.project}/${id}`,
    ADD_MEMBER: (id) => `/${base_path.project}/${id}/add-member`,
    REMOVE_MEMBER_INVITING: (id) => `/${base_path.project}/${id}/remove-member-inviting`,
    DATA_CHART: `/${base_path.project}/data/chart`,
    GET_PERCENT_COMPELETED: `/${base_path.project}/get-percent-completed`,
  },
  TASK: {
    CREATE: `/${base_path.task}/create`,
    GET_ALL: `/${base_path.task}/get-all`,
    UPDATE_STATUS: `/${base_path.task}/update-status`,
    UPDATE_TASK: (id) => `/${base_path.task}/update/${id}`,
    DELETE_TASK: (id) => `/${base_path.task}/delete/${id}`,
    TASK_DETAIL: (id) => `/${base_path.task}/${id}`,
    LIST_SUB_TASKS: (id) => `/${base_path.task}/update-completed/${id}`,
    DATA_CHART: `/${base_path.task}/data/chart`,
    PRIORITY: (prioriry) => `/${base_path.task}/priority/${prioriry}`,
  },
  UPLOAD: {
    IMAGE_SINGLE: `/${base_path.upload}/image-single`,
    IMAGES: `/${base_path.upload}/images`,
  },
  SEARCH: {
    MEMBER_IN_PROJECT: (id) => `/${base_path.search}/all-members/${id}`,   // id project
    ADD_MEMBER_TO_PROJECT: (id) => `/${base_path.search}/add-member/${id}`,
    ANYTHING: `/${base_path.search}/anything`,
  },
  USER: {
    UPDATE_PROFILE: (id) => `/${base_path.user}/update-profile/${id}`,   // id user
    UPDATE_ACCOUNT: (id) => `/${base_path.user}/update-account/${id}`,   
  },
  COMMENT: {
    GET_ALL: (id) => `/${base_path.comment}/${id}`,   // id task
    CREATE: (id) => `/${base_path.comment}/${id}`,   
    UPDATE: (id) => `/${base_path.comment}/${id}`, // id comment  
    DELETE: (id) => `/${base_path.comment}/${id}`,   
    LIKE: (id) => `/${base_path.comment}/like/${id}`,   
  },
  NOTIFICATION: {
    GET_ALL: `/${base_path.notification}`,
    UPDATE_SEEN: (id) => `/${base_path.notification}/update-seen/${id}`,  // notification id
  }
}