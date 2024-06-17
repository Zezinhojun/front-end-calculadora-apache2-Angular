const apiUrls = 'http://localhost:3000/api'

export const ApiEndpoint = {
  Auth: {
    Register: `${apiUrls}/users/register`,
    Login: `${apiUrls}/users/login`,
    Me: `${apiUrls}/users/me`
  }
}

export const LocalStorage = {
  token: 'USER_TOKEN'
}
