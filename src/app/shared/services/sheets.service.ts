import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiGoogleSheetsEndpoint } from '../constant';


@Injectable({
  providedIn: 'root'
})
export class SheetsService {
  constructor(private _http: HttpClient) { }

  getRows(): Observable<any> {
    return this._http.get<any>(`${ApiGoogleSheetsEndpoint.GoogleSheets.Rows}`)
  }

  getPatology(): Observable<any> {
    return this._http.get<any>(`${ApiGoogleSheetsEndpoint.GoogleSheets.Patology}`)
  }

  deleteRow(rowIndex: number): Observable<any> {
    return this._http.post(`${ApiGoogleSheetsEndpoint.GoogleSheets.DeleteRow}`, { lineId: rowIndex })
  }

  createRow(data: any) {
    return this._http.post(`${ApiGoogleSheetsEndpoint.GoogleSheets.CreateRow}`, data)
  }


}
