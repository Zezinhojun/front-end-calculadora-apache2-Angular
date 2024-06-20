import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiGoogleSheetsEndpoint } from '../constant';


@Injectable({
  providedIn: 'root'
})
export class SheetsService {
  isLoading = signal<boolean>(false)
  constructor(private _http: HttpClient) { }

  getRows(): Observable<any> {
    return this._http.get<any>(`${ApiGoogleSheetsEndpoint.GoogleSheets.Rows}`)
  }

  getPatology(): Observable<any> {
    return this._http.get<any>(`${ApiGoogleSheetsEndpoint.GoogleSheets.Patology}`)
  }

  getService(): Observable<any> {
    return this._http.get<any>(`${ApiGoogleSheetsEndpoint.GoogleSheets.Service}`)
  }

  deleteRow(rowIndex: number): Observable<any> {
    return this._http.post(`${ApiGoogleSheetsEndpoint.GoogleSheets.DeleteRow}`, { lineId: rowIndex })
  }

  createRow(data: any) {
    return this._http.post(`${ApiGoogleSheetsEndpoint.GoogleSheets.CreateRow}`, data)
  }


}
