const USER_KEY = 'user_key';

export const saveUser = (user = {}) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const getUser = (): string => {
  return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
}

export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
}