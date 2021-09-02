import ajax from './ajax'

export const reqLogin = (data = {}) => ajax("/login", data, "POST");