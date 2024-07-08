// const apiUrls = 'https://back-end-calculadora-apache2-angular.onrender.com/api'
const apiUrls = 'http://localhost:3000/api';

export const ApiEndpoint = {
  Auth: {
    Register: `${apiUrls}/users/register`,
    Login: `${apiUrls}/users/login`,
    Me: `${apiUrls}/users/me`,
  },
};

export const ApiGoogleSheetsEndpoint = {
  GoogleSheets: {
    Metadata: `${apiUrls}/googlesheets/metadata`,
    Rows: `${apiUrls}/googlesheets/rows`,
    Patology: `${apiUrls}/googlesheets/patology`,
    Treatments: `${apiUrls}/googlesheets/treatments`,
    Row: `${apiUrls}/googlesheets/row/:lineId`,
    CreateRow: `${apiUrls}/googlesheets/addrow`,
    Updatevalue: `${apiUrls}/googlesheets/updatevalue`,
    DeleteRow: `${apiUrls}/googlesheets/dashboard/delete`,
  },
};

export const LocalStorage = {
  token: 'USER_TOKEN',
};
