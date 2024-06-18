const apiUrls = 'http://localhost:3000/api'

export const ApiEndpoint = {
  Auth: {
    Register: `${apiUrls}/users/register`,
    Login: `${apiUrls}/users/login`,
    Me: `${apiUrls}/users/me`
  }
}

export const ApiGoogleSheetsEndpoint = {
  GoogleSheets: {
    Metadata: `${apiUrls}/googlesheets/metadata`,
    Rows: `${apiUrls}/googlesheets/rows`,
    Patology: `${apiUrls}/googlesheets/patology`,
    CreateRow: `${apiUrls}/googlesheets/addrow`,
    Updatevalue: `${apiUrls}/googlesheets/updatevalue`,
    DeleteRow: `${apiUrls}/googlesheets/dashboard/delete`,
  }
}

export const LocalStorage = {
  token: 'USER_TOKEN'
}
